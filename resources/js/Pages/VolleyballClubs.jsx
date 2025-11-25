import React from "react";
import { Head } from "@inertiajs/react";
import Navbar from "@/Components/Navbar";

export default function VolleyballClubs() {
    return (
        <>
            <Head title="Clubes de Voleibol - Las Canteras Vóley" />
            <div className="min-h-screen bg-[#FFF8E8] text-gray-900 font-sans">
                <Navbar />
                <div className="pt-24 max-w-6xl mx-auto px-6">
                    <h1 className="text-4xl font-extrabold text-[#1CA9C9] mb-6">Clubes de Voleibol</h1>
                    <p className="text-lg text-gray-700">
                        Directorio de clubes de voleibol en Las Canteras y alrededores.
                    </p>
                    {/* Contenido futuro aquí */}
                </div>
            </div>
        </>
    );
}
