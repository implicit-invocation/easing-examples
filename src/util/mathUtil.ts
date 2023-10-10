import { Color, Vector2 } from "gdxts";

export const lerpVector2 = (
  output: Vector2,
  value1: Vector2,
  value2: Vector2,
  alpha: number
): Vector2 => {
  return output
    .setVector(value2)
    .subVector(value1)
    .scale(alpha)
    .addVector(value1);
};

export const lerpColor = (
  output: Color,
  color1: Color,
  color2: Color,
  alpha: number
): Color => {
  const r = lerp(color1.r, color2.r, alpha);
  const g = lerp(color1.g, color2.g, alpha);
  const b = lerp(color1.b, color2.b, alpha);
  const a = lerp(color1.a, color2.a, alpha);
  return output.set(r, g, b, a);
};

export const lerp = (start: number, end: number, alpha: number): number => {
  return start + (end - start) * alpha;
};

export function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export type Ref = {
  value: number;
};

export function smoothDamp(
  current: number,
  target: number,
  currentVelocityRef: Ref,
  smoothTime: number,
  maxSpeed: number = Infinity,
  deltaTime: number
): number {
  // Based on Game Programming Gems 4 Chapter 1.10
  smoothTime = Math.max(0.0001, smoothTime);
  const omega = 2 / smoothTime;

  const x = omega * deltaTime;
  const exp = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x);
  let change = current - target;
  const originalTo = target;

  // Clamp maximum speed
  const maxChange = maxSpeed * smoothTime;
  change = clamp(change, -maxChange, maxChange);
  target = current - change;

  const temp = (currentVelocityRef.value + omega * change) * deltaTime;
  currentVelocityRef.value = (currentVelocityRef.value - omega * temp) * exp;
  let output = target + (change + temp) * exp;

  // Prevent overshooting
  if (originalTo - current > 0.0 === output > originalTo) {
    output = originalTo;
    currentVelocityRef.value = (output - originalTo) / deltaTime;
  }

  return output;
}

export function smoothDampVec2(
  current: Vector2,
  target: Vector2,
  currentVelocityRef: Vector2,
  smoothTime: number,
  maxSpeed: number = Infinity,
  deltaTime: number,
  out: Vector2
) {
  // Based on Game Programming Gems 4 Chapter 1.10
  smoothTime = Math.max(0.0001, smoothTime);
  const omega = 2 / smoothTime;

  const x = omega * deltaTime;
  const exp = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x);

  let targetX = target.x;
  let targetY = target.y;

  let changeX = current.x - targetX;
  let changeY = current.y - targetY;

  const originalToX = targetX;
  const originalToY = targetY;

  // Clamp maximum speed
  const maxChange = maxSpeed * smoothTime;

  const maxChangeSq = maxChange * maxChange;
  const magnitudeSq = changeX * changeX + changeY * changeY;

  if (magnitudeSq > maxChangeSq) {
    const magnitude = Math.sqrt(magnitudeSq);
    changeX = (changeX / magnitude) * maxChange;
    changeY = (changeY / magnitude) * maxChange;
  }

  targetX = current.x - changeX;
  targetY = current.y - changeY;

  const tempX = (currentVelocityRef.x + omega * changeX) * deltaTime;
  const tempY = (currentVelocityRef.y + omega * changeY) * deltaTime;

  currentVelocityRef.x = (currentVelocityRef.x - omega * tempX) * exp;
  currentVelocityRef.y = (currentVelocityRef.y - omega * tempY) * exp;

  out.x = targetX + (changeX + tempX) * exp;
  out.y = targetY + (changeY + tempY) * exp;

  // Prevent overshooting
  const origMinusCurrentX = originalToX - current.x;
  const origMinusCurrentY = originalToY - current.y;
  const outMinusOrigX = out.x - originalToX;
  const outMinusOrigY = out.y - originalToY;

  if (
    origMinusCurrentX * outMinusOrigX + origMinusCurrentY * outMinusOrigY >
    0
  ) {
    out.x = originalToX;
    out.y = originalToY;

    currentVelocityRef.x = (out.x - originalToX) / deltaTime;
    currentVelocityRef.y = (out.y - originalToY) / deltaTime;
  }

  return out;
}

export type EasingFunction = (amount: number) => number;

/**
 * The Ease class provides a collection of easing functions for use with tween.js.
 */
export const Easing = {
  Linear: {
    None: function (amount: number): number {
      return amount;
    },
  },
  Quadratic: {
    In: function (amount: number): number {
      return amount * amount;
    },
    Out: function (amount: number): number {
      return amount * (2 - amount);
    },
    InOut: function (amount: number): number {
      if ((amount *= 2) < 1) {
        return 0.5 * amount * amount;
      }

      return -0.5 * (--amount * (amount - 2) - 1);
    },
  },
  Cubic: {
    In: function (amount: number): number {
      return amount * amount * amount;
    },
    Out: function (amount: number): number {
      return --amount * amount * amount + 1;
    },
    InOut: function (amount: number): number {
      if ((amount *= 2) < 1) {
        return 0.5 * amount * amount * amount;
      }
      return 0.5 * ((amount -= 2) * amount * amount + 2);
    },
  },
  Quartic: {
    In: function (amount: number): number {
      return amount * amount * amount * amount;
    },
    Out: function (amount: number): number {
      return 1 - --amount * amount * amount * amount;
    },
    InOut: function (amount: number): number {
      if ((amount *= 2) < 1) {
        return 0.5 * amount * amount * amount * amount;
      }

      return -0.5 * ((amount -= 2) * amount * amount * amount - 2);
    },
  },
  Quintic: {
    In: function (amount: number): number {
      return amount * amount * amount * amount * amount;
    },
    Out: function (amount: number): number {
      return --amount * amount * amount * amount * amount + 1;
    },
    InOut: function (amount: number): number {
      if ((amount *= 2) < 1) {
        return 0.5 * amount * amount * amount * amount * amount;
      }

      return 0.5 * ((amount -= 2) * amount * amount * amount * amount + 2);
    },
  },
  Sinusoidal: {
    In: function (amount: number): number {
      return 1 - Math.sin(((1.0 - amount) * Math.PI) / 2);
    },
    Out: function (amount: number): number {
      return Math.sin((amount * Math.PI) / 2);
    },
    InOut: function (amount: number): number {
      return 0.5 * (1 - Math.sin(Math.PI * (0.5 - amount)));
    },
  },
  Exponential: {
    In: function (amount: number): number {
      return amount === 0 ? 0 : Math.pow(1024, amount - 1);
    },
    Out: function (amount: number): number {
      return amount === 1 ? 1 : 1 - Math.pow(2, -10 * amount);
    },
    InOut: function (amount: number): number {
      if (amount === 0) {
        return 0;
      }

      if (amount === 1) {
        return 1;
      }

      if ((amount *= 2) < 1) {
        return 0.5 * Math.pow(1024, amount - 1);
      }

      return 0.5 * (-Math.pow(2, -10 * (amount - 1)) + 2);
    },
  },
  Circular: {
    In: function (amount: number): number {
      return 1 - Math.sqrt(1 - amount * amount);
    },
    Out: function (amount: number): number {
      return Math.sqrt(1 - --amount * amount);
    },
    InOut: function (amount: number): number {
      if ((amount *= 2) < 1) {
        return -0.5 * (Math.sqrt(1 - amount * amount) - 1);
      }
      return 0.5 * (Math.sqrt(1 - (amount -= 2) * amount) + 1);
    },
  },
  Elastic: {
    In: function (amount: number): number {
      if (amount === 0) {
        return 0;
      }

      if (amount === 1) {
        return 1;
      }

      return (
        -Math.pow(2, 10 * (amount - 1)) * Math.sin((amount - 1.1) * 5 * Math.PI)
      );
    },
    Out: function (amount: number): number {
      if (amount === 0) {
        return 0;
      }

      if (amount === 1) {
        return 1;
      }
      return (
        Math.pow(2, -10 * amount) * Math.sin((amount - 0.1) * 5 * Math.PI) + 1
      );
    },
    InOut: function (amount: number): number {
      if (amount === 0) {
        return 0;
      }

      if (amount === 1) {
        return 1;
      }

      amount *= 2;

      if (amount < 1) {
        return (
          -0.5 *
          Math.pow(2, 10 * (amount - 1)) *
          Math.sin((amount - 1.1) * 5 * Math.PI)
        );
      }

      return (
        0.5 *
          Math.pow(2, -10 * (amount - 1)) *
          Math.sin((amount - 1.1) * 5 * Math.PI) +
        1
      );
    },
  },
  Back: {
    In: function (amount: number): number {
      const s = 1.70158;
      return amount === 1 ? 1 : amount * amount * ((s + 1) * amount - s);
    },
    Out: function (amount: number): number {
      const s = 1.70158;
      return amount === 0 ? 0 : --amount * amount * ((s + 1) * amount + s) + 1;
    },
    InOut: function (amount: number): number {
      const s = 1.70158 * 1.525;
      if ((amount *= 2) < 1) {
        return 0.5 * (amount * amount * ((s + 1) * amount - s));
      }
      return 0.5 * ((amount -= 2) * amount * ((s + 1) * amount + s) + 2);
    },
  },
  Bounce: {
    In: function (amount: number): number {
      return 1 - Easing.Bounce.Out(1 - amount);
    },
    Out: function (amount: number): number {
      if (amount < 1 / 2.75) {
        return 7.5625 * amount * amount;
      } else if (amount < 2 / 2.75) {
        return 7.5625 * (amount -= 1.5 / 2.75) * amount + 0.75;
      } else if (amount < 2.5 / 2.75) {
        return 7.5625 * (amount -= 2.25 / 2.75) * amount + 0.9375;
      } else {
        return 7.5625 * (amount -= 2.625 / 2.75) * amount + 0.984375;
      }
    },
    InOut: function (amount: number): number {
      if (amount < 0.5) {
        return Easing.Bounce.In(amount * 2) * 0.5;
      }
      return Easing.Bounce.Out(amount * 2 - 1) * 0.5 + 0.5;
    },
  },
  generatePow: function (
    power = 4
  ): {
    In(amount: number): number;
    Out(amount: number): number;
    InOut(amount: number): number;
  } {
    power = power < Number.EPSILON ? Number.EPSILON : power;
    power = power > 10000 ? 10000 : power;
    return {
      In: function (amount: number): number {
        return amount ** power;
      },
      Out: function (amount: number): number {
        return 1 - (1 - amount) ** power;
      },
      InOut: function (amount: number): number {
        if (amount < 0.5) {
          return (amount * 2) ** power / 2;
        }
        return (1 - (2 - amount * 2) ** power) / 2 + 0.5;
      },
    };
  },
};
