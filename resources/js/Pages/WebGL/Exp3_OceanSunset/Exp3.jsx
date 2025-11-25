import React, { useRef } from "react";
import { Canvas, useFrame, extend } from "@react-three/fiber";
import { OrbitControls, Sky, Stars } from "@react-three/drei";
import Navbar from "@/Components/Navbar";
import { Head } from "@inertiajs/react";
import * as THREE from "three";

function Ocean() {
    const ref = useRef();

    useFrame((state, delta) => {
        ref.current.material.uniforms.uTime.value += delta;
    });

    const vertexShader = `
    varying vec2 vUv;
    uniform float uTime;
    void main() {
      vUv = uv;
      vec3 pos = position;
      pos.z += sin(pos.x * 2.0 + uTime) * 0.5;
      pos.z += cos(pos.y * 2.0 + uTime) * 0.5;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `;

    const fragmentShader = `
    varying vec2 vUv;
    uniform float uTime;
    void main() {
      vec3 color1 = vec3(0.0, 0.5, 0.8);
      vec3 color2 = vec3(0.0, 0.2, 0.5);
      float mixValue = sin(vUv.x * 10.0 + uTime) * 0.5 + 0.5;
      gl_FragColor = vec4(mix(color1, color2, mixValue), 0.8);
    }
  `;

    return (
        <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
            <planeGeometry args={[100, 100, 64, 64]} />
            <shaderMaterial
                uniforms={{ uTime: { value: 0 } }}
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                transparent
                wireframe={false}
            />
        </mesh>
    );
}

export default function Exp3() {
    return (
        <>
            <Head title="Exp 3: Ocean Sunset" />
            <div className="h-screen w-full bg-black">
                <Navbar />
                <Canvas camera={{ position: [0, 5, 10], fov: 45 }}>
                    <ambientLight intensity={0.2} />

                    <Ocean />

                    <Sky sunPosition={[100, 10, 100]} turbidity={0.1} rayleigh={0.5} mieCoefficient={0.005} mieDirectionalG={0.8} />
                    <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

                    <OrbitControls maxPolarAngle={Math.PI / 2 - 0.1} />
                </Canvas>

                <div className="absolute bottom-10 left-0 w-full text-center pointer-events-none">
                    <h1 className="text-4xl font-extrabold text-white drop-shadow-lg">
                        Experiencia 3: Atardecer en el Mar
                    </h1>
                    <p className="text-white/80 text-lg mt-2">
                        La calma después del partido.
                    </p>
                </div>
            </div>
        </>
    );
}
