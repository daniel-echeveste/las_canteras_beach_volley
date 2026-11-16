import React from "react";
import ComingSoon from "@/Components/ComingSoon";

export default function WebCams() {
    return (
        <ComingSoon
            pageTitle="Webcams - Las Canteras Beach Volley"
            eyebrow="En directo"
            title="Webcams"
            subtitle="Mira el estado de la playa y las canchas en tiempo real antes de bajar."
            icon="video"
            bullets={["Imagen en directo de la zona de canchas", "Estado del mar y ocupación de la playa", "Combinado con la previsión del viento"]}
        />
    );
}
