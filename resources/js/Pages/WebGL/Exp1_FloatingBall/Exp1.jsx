import React, { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, ContactShadows, Environment, Float } from "@react-three/drei";
import Navbar from "@/Components/Navbar";
import { Head } from "@inertiajs/react";

function Volleyball(props) {
    const mesh = useRef();
    const [hovered, setHover] = useState(false);
    const [active, setActive] = useState(false);

    useFrame((state, delta) => {
        mesh.current.rotation.x += delta * 0.5;
        mesh.current.rotation.y += delta * 0.2;
    });

    return (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
            <mesh
                {...props}
                ref={mesh}
                scale={active ? 1.2 : 1}
                onClick={() => setActive(!active)}
                onPointerOver={() => setHover(true)}
                onPointerOut={() => setHover(false)}
            >
                <sphereGeometry args={[1, 32, 32]} />
                <meshStandardMaterial
                    color={hovered ? "#FFD369" : "white"}
                    roughness={0.3}
                    metalness={0.1}
                />
                {/* Stripes simulation */}
                <mesh rotation={[Math.PI / 2, 0, 0]}>
                    <torusGeometry args={[1.01, 0.05, 16, 100]} />
                    <meshBasicMaterial color="#1CA9C9" />
                </mesh>
                <mesh rotation={[0, Math.PI / 2, 0]}>
                    <torusGeometry args={[1.01, 0.05, 16, 100]} />
                    <meshBasicMaterial color="#1CA9C9" />
                </mesh>
            </mesh>
        </Float>
    );
}

export default function Exp1() {
    return (
        <>
            <Head title="Exp 1: Floating Ball" />
            <div className="h-screen w-full bg-gradient-to-b from-blue-400 to-blue-200">
                <Navbar />
                <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
                    <ambientLight intensity={0.5} />
                    <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
                    <pointLight position={[-10, -10, -10]} intensity={0.5} />

                    <Volleyball position={[0, 0, 0]} />

                    <ContactShadows position={[0, -2, 0]} opacity={0.5} scale={10} blur={2.5} far={4} />
                    <Environment preset="sunset" />
                    <OrbitControls enableZoom={false} />
                </Canvas>

                <div className="absolute bottom-10 left-0 w-full text-center pointer-events-none">
                    <h1 className="text-4xl font-extrabold text-white drop-shadow-lg">
                        Experiencia 1: El Balón
                    </h1>
                    <p className="text-white/90 text-lg mt-2">
                        Interactúa con el elemento central del juego.
                    </p>
                </div>
            </div>
        </>
    );
}
