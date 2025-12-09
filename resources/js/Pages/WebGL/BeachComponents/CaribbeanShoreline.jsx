import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Plane } from "@react-three/drei";
import * as THREE from "three";
import vertexShader from "./shaders/shoreline/vertex.glsl";
import fragmentShader from "./shaders/shoreline/fragment.glsl";

/**
 * CaribbeanShoreline - A unified beach component that renders both
 * the ocean and sand in a single mesh with smooth blending.
 * 
 * Features:
 * - Waves moving toward shore
 * - Caribbean turquoise/crystal clear water colors
 * - Smooth wet sand transition zone
 * - Wave foam and breakers
 * - Caustics effect on water
 * - Sand sparkle and grain texture
 */
export default function CaribbeanShoreline({
    position = [0, 0, 0],
    size = [200, 150],
    shorelinePosition = 0.5, // Where water meets sand (0-1, higher = more sand)
    sandColor = "#f5deb3",    // Warm wheat/sand color
    shallowWaterColor = "#40E0D0", // Turquoise
    deepWaterColor = "#006994",    // Deep ocean blue
    ...props
}) {
    const ref = useRef();

    useFrame((state, delta) => {
        if (ref.current) {
            ref.current.material.uniforms.uTime.value += delta;
        }
    });

    return (
        <Plane
            ref={ref}
            args={[size[0], size[1], 128, 128]}
            rotation={[-Math.PI / 2, 0, Math.PI]}
            position={position}
            receiveShadow
            {...props}
        >
            <shaderMaterial
                uniforms={{
                    uTime: { value: 0 },
                    uShorelinePosition: { value: shorelinePosition },
                    uSandColor: { value: new THREE.Color(sandColor) },
                    uShallowWaterColor: { value: new THREE.Color(shallowWaterColor) },
                    uDeepWaterColor: { value: new THREE.Color(deepWaterColor) }
                }}
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                transparent
            />
        </Plane>
    );
}
