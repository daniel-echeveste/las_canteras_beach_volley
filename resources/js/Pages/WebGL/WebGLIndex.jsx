import React from "react";
import { Head, Link } from "@inertiajs/react";
import Navbar from "@/Components/Navbar";

export default function WebGLIndex() {
    const experiences = [
        {
            title: "Exp 1: El Balón",
            description: "Interactúa con un balón de vóley realista flotando sobre la playa.",
            href: "/webgl/exp1",
            color: "bg-blue-500",
        },
        {
            title: "Exp 2: Arenas Doradas",
            description: "Siente la textura de Las Canteras con un sistema de partículas.",
            href: "/webgl/exp2",
            color: "bg-yellow-500",
        },
        {
            title: "Exp 3: Océano",
            description: "Relájate con una simulación del mar al atardecer.",
            href: "/webgl/exp3",
            color: "bg-indigo-500",
        },
        {
            title: "Exp 4: La Cancha",
            description: "Explora las zonas de juego en una cancha 3D interactiva.",
            href: "/webgl/exp4",
            color: "bg-orange-500",
        },
        {
            title: "Exp 5: Energía",
            description: "Visualización abstracta de la energía del deporte.",
            href: "/webgl/exp5",
            color: "bg-pink-500",
        },
    ];

    return (
        <>
            <Head title="Experiencias 3D - Las Canteras Vóley" />
            <div className="min-h-screen bg-gray-50 font-sans">
                <Navbar />
                <div className="pt-24 max-w-7xl mx-auto px-6 pb-12">
                    <div className="text-center mb-12">
                        <h1 className="text-5xl font-extrabold text-[#1CA9C9] mb-4">
                            Experiencias WebGL
                        </h1>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Explora el vóley playa desde una nueva perspectiva con nuestras demos interactivas en 3D.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {experiences.map((exp, idx) => (
                            <Link
                                key={idx}
                                href={exp.href}
                                className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                            >
                                <div className={`h-48 ${exp.color} flex items-center justify-center`}>
                                    <span className="text-6xl text-white opacity-50 font-bold">
                                        {idx + 1}
                                    </span>
                                </div>
                                <div className="p-8">
                                    <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-[#1CA9C9] transition-colors">
                                        {exp.title}
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        {exp.description}
                                    </p>
                                    <div className="mt-6 font-semibold text-[#1CA9C9] flex items-center gap-2">
                                        Ver Experiencia
                                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
