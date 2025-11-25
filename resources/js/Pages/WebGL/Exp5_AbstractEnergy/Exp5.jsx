import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, TorusKnot, Float } from "@react-three/drei";
import Navbar from "@/Components/Navbar";
import { Head } from "@inertiajs/react";

function EnergyShape({ position, color, speed }) {
    const mesh = useRef();

    useFrame((state, delta) => {
        mesh.current.rotation.x += delta * speed;
        mesh.current.rotation.y += delta * speed * 0.5;
    });

    return (
        <Float speed={speed * 2} rotationIntensity={1} floatIntensity={2}>
            <TorusKnot ref={mesh} position={position} args={[1, 0.3, 100, 16]}>
                <meshStandardMaterial color={color} roughness={0.1} metalness={0.8} />
            </TorusKnot>
        </Float>
    );
}

export default function Exp5() {
    return (
        <>
            <Head title="Exp 5: Abstract Energy" />
            <div className="h-screen w-full bg-[#0f172a]">
                <Navbar />
                <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
                    <ambientLight intensity={0.5} />
                    <spotLight position={[10, 10, 10]} angle={0.3} penumbra={1} intensity={2} color="#ff0055" />
                    <pointLight position={[-10, -10, -10]} intensity={2} color="#00ffff" />

                    <EnergyShape position={[-3, 0, 0]} color="#1CA9C9" speed={1} />
                    <EnergyShape position={[0, 0, 0]} color="#FFD369" speed={0.5} />
                    <EnergyShape position={[3, 0, 0]} color="#ff6b6b" speed={0.8} />

                    <OrbitControls autoRotate />
                </Canvas>

                <div className="absolute bottom-10 left-0 w-full text-center pointer-events-none">
                    <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-yellow-500 drop-shadow-lg">
                        Experiencia 5: Energía Pura
                    </h1>
                    <p className="text-white/80 text-lg mt-2">
                        La vibra del deporte en movimiento.
                    </p>
                </div>
            </div>
        </>
    );
}
