import React from "react";
import { Canvas } from "@react-three/fiber";
import { Sphere } from "@react-three/drei";
import { useSpring, animated } from "@react-spring/three";

function StarSimulation({ state, temperature, mass }) {
  // Map temperature to color and size based on the classification table
  const { scale, color } = useSpring({
    scale: mass >= 16
      ? 5 // O-type, largest
      : mass >= 2.1
      ? 4 // B-type
      : mass >= 1.4
      ? 3 // A-type
      : mass >= 1.04
      ? 2 // F-type
      : mass >= 0.8
      ? 1.5 // G-type
      : mass >= 0.45
      ? 1.2 // K-type
      : 1, // M-type, smallest
      color:
      temperature >= 33000
        ? "#0000FF" // O-type: Blue
        : temperature >= 10000
        ? "#5F9EA0" // B-type: Bluish white
        : temperature >= 7300
        ? "#FFFFFF" // A-type: White
        : temperature >= 6000
        ? "#FFFF00" // F-type: Yellowish white
        : temperature >= 5300
        ? "#FFD700" // G-type: Yellow
        : temperature >= 3900
        ? "#FFA500" // K-type: Light orange
        : "#FF4500", // M-type: Light orangish red
  });

  return (
    <div>
      <h2>Star Visualization</h2>
      <Canvas>
        <ambientLight />
        <animated.mesh scale={scale}>
          <Sphere args={[1, 32, 32]}>
            <animated.meshStandardMaterial color={color} />
          </Sphere>
        </animated.mesh>
      </Canvas>
    </div>
  );
}

export default StarSimulation;
