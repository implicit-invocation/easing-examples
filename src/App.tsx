import { motion } from "framer-motion";
import { useState } from "react";
import { Easing } from "./util/mathUtil";

export const App = () => {
  const [show, setShow] = useState(false);
  return (
    <div className="w-64 h-64 bg-red-300 relative">
      <motion.div
        className="absolute top-2 left-2 w-1/2 h-1/2 bg-black opacity-50"
        animate={{
          opacity: show ? 0.5 : 0,
          scale: show ? 1 : 0.8,
        }}
        initial={{
          opacity: 0,
          scale: 0.8,
        }}
        transition={{
          duration: 0.5,
          bounce: true,
          ease: Easing.Cubic.Out,
        }}
      ></motion.div>
      <button onClick={() => setShow(!show)} className="absolute bottom-2">
        Click
      </button>
    </div>
  );
};
