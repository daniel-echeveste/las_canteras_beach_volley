import React, { useRef, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Navbar from "@/Components/Navbar";
import { Head } from "@inertiajs/react";
import CaribbeanShoreline from "../BeachComponents/CaribbeanShoreline";
import Courts from "../BeachComponents/Courts";
import SkyEnvironment from "../BeachComponents/SkyEnvironment";
import Avenue from "../BeachComponents/Avenue";

// Camera controller for cinematic movement
function CameraController() {
    const { camera } = useThree();
    const initialPos = useRef({ x: 0, y: 15, z: 50 });

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        // Very subtle breathing motion on camera
        camera.position.y = initialPos.current.y + Math.sin(time * 0.3) * 0.5;
    });

    return null;
}

// Loading fallback
function LoadingFallback() {
    return (
        <mesh>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="gray" />
        </mesh>
    );
}

export default function Exp6() {
    return (
        <>
            <Head title="Torneo Playa - Las Canteras Vóley" />
            <div className="h-screen w-full bg-gradient-to-b from-sky-400 to-sky-200">
                <Navbar />
                <Canvas
                    shadows
                    camera={{ position: [0, 15, 50], fov: 50 }}
                    gl={{
                        antialias: true,
                        alpha: false,
                        powerPreference: "high-performance",
                        failIfMajorPerformanceCaveat: false
                    }}
                    dpr={[1, 1.5]}
                    onCreated={({ gl }) => {
                        gl.setClearColor('#87ceeb');
                    }}
                >
                    <Suspense fallback={<LoadingFallback />}>
                        <SkyEnvironment preset="real-time" />

                        {/* Camera controller */}
                        {/* <CameraController /> */}

                        {/* Caribbean Shoreline - Unified sand and ocean in one component */}
                        <CaribbeanShoreline
                            position={[0, 0, -150]}
                            size={[400, 400]}
                            shorelinePosition={0.5}
                            sandColor="#f0d79e"
                            shallowWaterColor="#48D1CC"
                            deepWaterColor="#005577"
                        />

                        <Avenue position={[0, 0.1, 58]} />

                        <Courts />

                        {/* Fog for atmosphere */}
                        <fog attach="fog" args={['#87ceeb', 100, 300]} />
                    </Suspense>

                    <OrbitControls
                        // maxPolarAngle={Math.PI / 2 - 0.05}
                        // minDistance={10}
                        // maxDistance={120}
                        // enableDamping
                        // dampingFactor={0.05}
                    />
                </Canvas>

                <div className="absolute bottom-10 left-0 w-full text-center pointer-events-none">
                    <h1 className="text-4xl font-extrabold text-white drop-shadow-lg shadow-black">
                        Torneo de Vóley Playa
                    </h1>
                    <p className="text-white/90 text-lg mt-2 drop-shadow-md">
                        8 canchas · 32 jugadores · Las Canteras
                    </p>
                </div>
            </div>
        </>
    );
}
