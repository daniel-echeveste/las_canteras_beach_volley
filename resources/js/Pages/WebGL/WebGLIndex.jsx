import React from "react";
import { Link } from "@inertiajs/react";
import { PageShell, PageHero, Icon } from "@/Components/ui";

const EXPERIENCES = [
    {
        title: "Torneo en la playa",
        description: "8 canchas de vóley playa con partidos simultáneos, jugadores animados y un entorno realista con mar y arena.",
        href: "/webgl/exp6",
    },
];

export default function WebGLIndex() {
    return (
        <PageShell title="Experiencias 3D - Las Canteras Beach Volley">
            <PageHero
                compact
                eyebrow="Laboratorio"
                title="Experiencias 3D"
                subtitle="Explora el vóley playa desde otra perspectiva con nuestras demos interactivas en WebGL."
            />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {EXPERIENCES.map((exp, i) => (
                        <Link
                            key={exp.href}
                            href={exp.href}
                            className="group bg-white rounded-3xl border border-black/5 shadow-sm hover:shadow-xl overflow-hidden transition-all hover:-translate-y-1"
                        >
                            <div className="relative h-48 bg-gradient-to-br from-[#1CA9C9] via-[#127F98] to-[#0B3F4C] flex items-center justify-center overflow-hidden">
                                <Icon name="cube" className="w-20 h-20 text-white/30 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500" strokeWidth={1.25} />
                                <span className="absolute top-4 left-4 badge bg-white/15 text-white">Demo {i + 1}</span>
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-black group-hover:text-[#0D5C6E]">{exp.title}</h3>
                                <p className="mt-2 text-gray-600 leading-relaxed">{exp.description}</p>
                                <span className="mt-5 inline-flex items-center gap-1.5 font-bold text-[#0D5C6E]">
                                    Abrir experiencia <Icon name="arrowRight" className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </main>
        </PageShell>
    );
}
