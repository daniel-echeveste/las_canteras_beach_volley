import React from "react";
import { Head } from "@inertiajs/react";
import Navbar from "@/Components/Navbar";

export default function TopPlayers() {
    return (
        <>
            <Head title="Top Players - Las Canteras Vóley" />
            <div className="min-h-screen bg-[#FFF8E8] text-gray-900 font-sans">
                <Navbar />
                <div className="pt-24 max-w-6xl mx-auto px-6">
                    <h1 className="text-4xl font-extrabold text-[#1CA9C9] mb-6">Top Players</h1>
                    <p className="text-lg text-gray-700">
                        Conoce a los jugadores más destacados de nuestra comunidad.
                    </p>
                    {/* Contenido futuro aquí */}
                </div>
            </div>
        </>
    );
}
