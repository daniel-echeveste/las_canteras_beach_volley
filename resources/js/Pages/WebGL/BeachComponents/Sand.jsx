import React, { useRef } from "react";
import { Plane } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import vertexShader from "./shaders/sand/vertex.glsl";
import fragmentShader from "./shaders/sand/fragment.glsl";

export default function Sand({ sunPosition = [50, 100, 50], ...props }) {
    const ref = useRef();

    useFrame((state, delta) => {
        if (ref.current) {
            ref.current.material.uniforms.uTime.value += delta;
        }
    });

    return (
        <Plane
            ref={ref}
            args={[200, 100, 128, 128]}
            rotation={[-Math.PI / 2, 0, 0]}
            receiveShadow
            {...props}
        >
            <shaderMaterial
                uniforms={{
                    uTime: { value: 0 },
                    uColor: { value: new THREE.Color("#f2d2a9") },
                    uSunPosition: { value: new THREE.Vector3(...sunPosition) }
                }}
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
            />
        </Plane>
    );
}
