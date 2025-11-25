import React, { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text, useCursor } from "@react-three/drei";
import Navbar from "@/Components/Navbar";
import { Head } from "@inertiajs/react";

function CourtZone({ position, color, label }) {
    const [hovered, setHover] = useState(false);
    useCursor(hovered);

    return (
        <group position={position}>
            <mesh
                rotation={[-Math.PI / 2, 0, 0]}
                onPointerOver={() => setHover(true)}
                onPointerOut={() => setHover(false)}
            >
                <planeGeometry args={[4, 4]} />
                <meshStandardMaterial color={hovered ? "#ff6b6b" : color} />
            </mesh>
            <Text
                position={[0, 0.1, 0]}
                rotation={[-Math.PI / 2, 0, 0]}
                fontSize={0.5}
                color="white"
                anchorX="center"
                anchorY="middle"
            >
                {label}
            </Text>
        </group>
    );
}

function Net() {
    return (
        <group position={[0, 1.2, 0]}>
            <mesh position={[0, 0, 0]}>
                <boxGeometry args={[8.5, 2.43, 0.1]} />
                <meshStandardMaterial color="black" wireframe />
            </mesh>
            <mesh position={[0, 1.2, 0]}>
                <boxGeometry args={[8.5, 0.1, 0.1]} />
                <meshStandardMaterial color="white" />
            </mesh>
        </group>
    );
}

export default function Exp4() {
    return (
        <>
            <Head title="Exp 4: Interactive Court" />
            <div className="h-screen w-full bg-gray-900">
                <Navbar />
                <Canvas camera={{ position: [0, 10, 10], fov: 50 }}>
                    <ambientLight intensity={0.8} />
                    <pointLight position={[10, 10, 10]} intensity={1} />

                    {/* Court Zones */}
                    <CourtZone position={[-2.1, 0, 2.1]} color="#1CA9C9" label="Zona 1" />
                    <CourtZone position={[2.1, 0, 2.1]} color="#1CA9C9" label="Zona 2" />
                    <CourtZone position={[-2.1, 0, -2.1]} color="#FFD369" label="Zona 3" />
                    <CourtZone position={[2.1, 0, -2.1]} color="#FFD369" label="Zona 4" />

                    <Net />

                    <gridHelper args={[20, 20, 0xffffff, 0x555555]} position={[0, -0.01, 0]} />

                    <OrbitControls />
                </Canvas>

                <div className="absolute bottom-10 left-0 w-full text-center pointer-events-none">
                    <h1 className="text-4xl font-extrabold text-white drop-shadow-lg">
                        Experiencia 4: La Cancha
                    </h1>
                    <p className="text-white/80 text-lg mt-2">
                        Conoce las zonas de juego.
                    </p>
                </div>
            </div>
        </>
    );
}
