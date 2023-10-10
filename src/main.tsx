import {
  MultiTextureBatch,
  Texture,
  createGameLoop,
  createStage,
  createViewport,
} from "gdxts";
import { Easing, lerp } from "./util/mathUtil";

const WORLD_WIDTH = 500;
const WORLD_HEIGHT = 1000;

const init = () => {
  const stage = createStage();
  const canvas = stage.getCanvas();
  const viewport = createViewport(canvas, WORLD_WIDTH, WORLD_HEIGHT);

  const gl = viewport.getContext();
  const camera = viewport.getCamera();
  camera.setYDown(true);

  const white = Texture.createWhiteTexture(gl);

  const batch = new MultiTextureBatch(gl);
  batch.setYDown(true);

  const startY = 10;
  const groundY = 500;

  const alphaYSpeed = 2;
  let currentAlpha = 0;

  let hitTheGround = false;

  let growAlpha = 0;
  const growYSpeed = 2;

  const BUILDING_WIDTH = 100;
  const BUILDING_HEIGHT = 200;

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  createGameLoop((delta) => {
    gl.clear(gl.COLOR_BUFFER_BIT);

    if (currentAlpha >= 1) {
      hitTheGround = true;
    }

    batch.setProjection(camera.combined);
    batch.begin();
    if (!hitTheGround) {
      currentAlpha += alphaYSpeed * delta;
      currentAlpha = Math.min(currentAlpha, 1);
      const y = lerp(startY, groundY, Easing.Cubic.In(currentAlpha));
      batch.draw(white, WORLD_WIDTH / 2 - 5, y, 10, 10);
    } else {
      growAlpha += growYSpeed * delta;
      growAlpha = Math.min(growAlpha, 1);
      const scale = lerp(0, 1, Easing.Elastic.Out(growAlpha));
      batch.draw(
        white,
        WORLD_WIDTH / 2 - BUILDING_WIDTH / 2,
        groundY - BUILDING_HEIGHT,
        BUILDING_WIDTH,
        BUILDING_HEIGHT,
        BUILDING_WIDTH / 2,
        BUILDING_HEIGHT,
        0,
        scale,
        scale
      );
    }
    batch.end();
  });
};

init();
