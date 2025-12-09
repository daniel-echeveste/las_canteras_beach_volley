import React, { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import vertexShader from "./shaders/ocean/vertex.glsl";
import fragmentShader from "./shaders/ocean/fragment.glsl";

export default function Ocean({
  position = [0, -2, 0],
  rotation = [-Math.PI / 2, 0, 0],
  args = [100, 100, 64, 64],
  color1 = "#0080cc", // Default blue
  color2 = "#003380", // Default darker blue
  sunPosition = [50, 100, 50],
  ...props
}) {
  const ref = useRef();

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.material.uniforms.uTime.value += delta;
    }
  });

  // Helper to convert hex to THREE.Color
  const c1 = new THREE.Color(color1);
  const c2 = new THREE.Color(color2);
  const sunPos = new THREE.Vector3(...sunPosition);

  return (
    <mesh ref={ref} rotation={rotation} position={position} {...props}>
      <planeGeometry args={args} />
      <shaderMaterial
        uniforms={{
          uTime: { value: 0 },
          uColor1: { value: c1 },
          uColor2: { value: c2 },
          uSunPosition: { value: sunPos }
        }}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        wireframe={false}
      />
    </mesh>
  );
}

