import React, { useEffect, useRef } from "react";
import confetti from "canvas-confetti";

const Confetti = ({ options }) => {
  const canvasRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    const confettiInstance = confetti.create(canvas, { resize: true });

    const shoot = () => {
      confettiInstance(options);
    };

    shoot();
    setTimeout(shoot, 100);
    setTimeout(shoot, 200);
  }, [options]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
    />
  );
};

export default Confetti;
