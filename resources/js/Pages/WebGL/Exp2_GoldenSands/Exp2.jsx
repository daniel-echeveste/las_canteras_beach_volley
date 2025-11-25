import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Navbar from "@/Components/Navbar";
import { Head } from "@inertiajs/react";
import * as THREE from "three";

function SandParticles({ count = 2000 }) {
    const mesh = useRef();
    const light = useRef();

    const particles = useMemo(() => {
        const temp = [];
        for (let i = 0; i < count; i++) {
            const t = Math.random() * 100;
            const factor = 20 + Math.random() * 100;
            const speed = 0.01 + Math.random() / 200;
            const xFactor = -50 + Math.random() * 100;
            const yFactor = -50 + Math.random() * 100;
            const zFactor = -50 + Math.random() * 100;
            temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 });
        }
        return temp;
    }, [count]);

    const dummy = useMemo(() => new THREE.Object3D(), []);

    useFrame((state) => {
        particles.forEach((particle, i) => {
            let { t, factor, speed, xFactor, yFactor, zFactor } = particle;
            t = particle.t += speed / 2;
            const a = Math.cos(t) + Math.sin(t * 1) / 10;
            const b = Math.sin(t) + Math.cos(t * 2) / 10;
            const s = Math.cos(t);

            dummy.position.set(
                (particle.mx / 10) * a + xFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 1) * factor) / 10,
                (particle.my / 10) * b + yFactor + Math.sin((t / 10) * factor) + (Math.cos(t * 2) * factor) / 10,
                (particle.my / 10) * b + zFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 3) * factor) / 10
            );
            dummy.scale.set(s, s, s);
            dummy.rotation.set(s * 5, s * 5, s * 5);
            dummy.updateMatrix();
            mesh.current.setMatrixAt(i, dummy.matrix);
        });
        mesh.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <>
            <instancedMesh ref={mesh} args={[null, null, count]}>
                <dodecahedronGeometry args={[0.2, 0]} />
                <meshStandardMaterial color="#FFD369" roughness={0.5} metalness={0.5} />
            </instancedMesh>
        </>
    );
}

export default function Exp2() {
    return (
        <>
            <Head title="Exp 2: Golden Sands" />
            <div className="h-screen w-full bg-[#1a1a1a]">
                <Navbar />
                <Canvas camera={{ position: [0, 0, 40], fov: 60 }}>
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} intensity={2} color="#ffaa00" />
                    <pointLight position={[-10, -10, -10]} intensity={1} color="#00aaff" />

                    <SandParticles />

                    <OrbitControls autoRotate autoRotateSpeed={0.5} enableZoom={false} />
                </Canvas>

                <div className="absolute bottom-10 left-0 w-full text-center pointer-events-none">
                    <h1 className="text-4xl font-extrabold text-[#FFD369] drop-shadow-lg">
                        Experiencia 2: Arenas Doradas
                    </h1>
                    <p className="text-white/80 text-lg mt-2">
                        Siente cada grano de arena de Las Canteras.
                    </p>
                </div>
            </div>
        </>
    );
}
