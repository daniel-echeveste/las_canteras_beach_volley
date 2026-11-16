import React from "react";
import ComingSoon from "@/Components/ComingSoon";

export default function VolleyballClubs() {
    return (
        <ComingSoon
            pageTitle="Clubes de Voleibol - Las Canteras Beach Volley"
            eyebrow="Directorio"
            title="Clubes de voleibol"
            subtitle="Clubes de vóley y vóley playa en Las Canteras y alrededores."
            icon="users"
            bullets={["Ubicación, horarios y contacto de cada club", "Escuelas y entrenamientos para todos los niveles", "Equipos que compiten en la liga"]}
        />
    );
}
