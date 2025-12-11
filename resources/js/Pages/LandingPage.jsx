import React from "react";
import { Head } from "@inertiajs/react";
import Navbar from "@/Components/Navbar";

export default function LandingPage({ appName, version }) {
    return (
        <>
            <Head title="Vóley Playa Las Canteras" />

            <div className="min-h-screen bg-[#FFF8E8] text-gray-900 font-sans">

                {/* NAVBAR */}
                <Navbar />

                {/* ----- HERO ----- */}
                <section
                    id="hero"
                    className="relative h-screen bg-[url('https://estaticos-cdn.prensaiberica.es/clip/bbc75e72-3f84-4133-afc1-c27ea269461a_16-9-discover-aspect-ratio_default_0.jpg')] bg-cover bg-center"
                >
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/20"></div>

                    <div className="relative z-10 flex flex-col justify-center items-center h-full text-center text-white px-6">
                        <h1 className="text-6xl font-extrabold drop-shadow-lg">
                            Vóley Playa Las Canteras
                        </h1>
                        <p className="text-xl mt-4 drop-shadow-md max-w-2xl">
                            Deporte, arena, comunidad y sol. Vive la experiencia del vóley playa en uno de los mejores rincones de Canarias.
                        </p>

                        <div className="flex gap-4 mt-8">
                            <a
                                href="/liga-autonomica"
                                className="mt-8 bg-[#FFD369] hover:bg-[#f0c45c] text-black font-semibold px-8 py-3 rounded-xl shadow-lg transition"
                            >
                                Liga Autonómica
                            </a>
                            <a
                                href="/ranking"
                                className="mt-8 bg-[#FFD369] hover:bg-[#f0c45c] text-black font-semibold px-8 py-3 rounded-xl shadow-lg transition"
                            >
                                Ranking Nacional
                            </a>
                        </div>

                    </div>
                </section>
            </div>
        </>
    );
}
