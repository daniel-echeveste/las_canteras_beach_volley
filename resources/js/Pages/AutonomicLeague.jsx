import React from "react";
import { Head } from "@inertiajs/react";
import Navbar from "@/Components/Navbar";
import ScheduleTable from "@/Components/ScheduleTable";

export default function AutonomicLeague() {
    const schedule = [
        // Jornada 1
        { jornada: 1, fecha: "29/11/2025", hora: "", local: "ELITEFIT CANARIAS", visitante: "BRAVEHEART GC", cancha: "Canteras", resultado: "0-3" },
        { jornada: 1, fecha: "29/11/2025", hora: "", local: "NET 7 BLACKBOARD", visitante: "CANACANTE", cancha: "Alcaravaneras", resultado: "1-2" },
        { jornada: 1, fecha: "29/11/2025", hora: "", local: "DESCANSA", visitante: "VOLEY MAXORATA", cancha: "", resultado: "" },
        { jornada: 1, fecha: "29/11/2025", hora: "", local: "ICOREN", visitante: "OVERBLOCK MASPALOMAS", cancha: "tenerife", resultado: "3-0" },
        // Jornada 2
        { jornada: 2, fecha: "13/12/2025", hora: "", local: "BRAVEHEART GC", visitante: "OVERBLOCK MASPALOMAS", cancha: "", resultado: "" },
        { jornada: 2, fecha: "13/12/2025", hora: "", local: "VOLEY MAXORATA", visitante: "ICOREN", cancha: "", resultado: "" },
        { jornada: 2, fecha: "14/12/2025", hora: "10:00", local: "CANACANTE", visitante: "DESCANSA", cancha: "Canteras", resultado: "" },
        { jornada: 2, fecha: "13/12/2025", hora: "", local: "ELITEFIT CANARIAS", visitante: "NET 7 BLACKBOARD", cancha: "", resultado: "" },
        // Jornada 3
        { jornada: 3, fecha: "27/12/2025", hora: "", local: "NET 7 BLACKBOARD", visitante: "BRAVEHEART GC", cancha: "", resultado: "" },
        { jornada: 3, fecha: "27/12/2025", hora: "", local: "DESCANSA", visitante: "ELITEFIT CANARIAS", cancha: "", resultado: "" },
        { jornada: 3, fecha: "27/12/2025", hora: "", local: "ICOREN", visitante: "CANACANTE", cancha: "", resultado: "" },
        { jornada: 3, fecha: "27/12/2025", hora: "", local: "OVERBLOCK MASPALOMAS", visitante: "VOLEY MAXORATA", cancha: "", resultado: "" },
        // Jornada 4
        { jornada: 4, fecha: "03/01/2026", hora: "", local: "BRAVEHEART GC", visitante: "VOLEY MAXORATA", cancha: "", resultado: "" },
        { jornada: 4, fecha: "04/01/2026", hora: "10:00", local: "CANACANTE", visitante: "OVERBLOCK MASPALOMAS", cancha: "Canteras", resultado: "" },
        { jornada: 4, fecha: "03/01/2026", hora: "", local: "ELITEFIT CANARIAS", visitante: "ICOREN", cancha: "", resultado: "" },
        { jornada: 4, fecha: "03/01/2026", hora: "", local: "NET 7 BLACKBOARD", visitante: "DESCANSA", cancha: "", resultado: "" },
        // Jornada 5
        { jornada: 5, fecha: "10/01/2026", hora: "", local: "DESCANSA", visitante: "BRAVEHEART GC", cancha: "", resultado: "" },
        { jornada: 5, fecha: "10/01/2026", hora: "", local: "ICOREN", visitante: "NET 7 BLACKBOARD", cancha: "", resultado: "" },
        { jornada: 5, fecha: "10/01/2026", hora: "", local: "OVERBLOCK MASPALOMAS", visitante: "ELITEFIT CANARIAS", cancha: "", resultado: "" },
        { jornada: 5, fecha: "10/01/2026", hora: "", local: "VOLEY MAXORATA", visitante: "CANACANTE", cancha: "", resultado: "" },
        // Jornada 6
        { jornada: 6, fecha: "17/01/2026", hora: "", local: "BRAVEHEART GC", visitante: "CANACANTE", cancha: "", resultado: "" },
        { jornada: 6, fecha: "17/01/2026", hora: "", local: "ELITEFIT CANARIAS", visitante: "VOLEY MAXORATA", cancha: "", resultado: "" },
        { jornada: 6, fecha: "17/01/2026", hora: "", local: "NET 7 BLACKBOARD", visitante: "OVERBLOCK MASPALOMAS", cancha: "", resultado: "" },
        { jornada: 6, fecha: "17/01/2026", hora: "", local: "DESCANSA", visitante: "ICOREN", cancha: "", resultado: "" },
        // Jornada 7
        { jornada: 7, fecha: "24/01/2026", hora: "", local: "ICOREN", visitante: "BRAVEHEART GC", cancha: "", resultado: "" },
        { jornada: 7, fecha: "24/01/2026", hora: "", local: "OVERBLOCK MASPALOMAS", visitante: "DESCANSA", cancha: "", resultado: "" },
        { jornada: 7, fecha: "24/01/2026", hora: "", local: "VOLEY MAXORATA", visitante: "NET 7 BLACKBOARD", cancha: "", resultado: "" },
        { jornada: 7, fecha: "25/01/2026", hora: "10:00", local: "CANACANTE", visitante: "ELITEFIT CANARIAS", cancha: "Canteras", resultado: "" },
        // Jornada 8
        { jornada: 8, fecha: "07/02/2026", hora: "", local: "BRAVEHEART GC", visitante: "ELITEFIT CANARIAS", cancha: "", resultado: "" },
        { jornada: 8, fecha: "08/02/2026", hora: "10:00", local: "CANACANTE", visitante: "NET 7 BLACKBOARD", cancha: "Canteras", resultado: "" },
        { jornada: 8, fecha: "07/02/2026", hora: "", local: "VOLEY MAXORATA", visitante: "DESCANSA", cancha: "", resultado: "" },
        { jornada: 8, fecha: "07/02/2026", hora: "", local: "OVERBLOCK MASPALOMAS", visitante: "ICOREN", cancha: "", resultado: "" },
        // Jornada 9
        { jornada: 9, fecha: "14/02/2026", hora: "", local: "OVERBLOCK MASPALOMAS", visitante: "BRAVEHEART GC", cancha: "", resultado: "" },
        { jornada: 9, fecha: "14/02/2026", hora: "", local: "ICOREN", visitante: "VOLEY MAXORATA", cancha: "", resultado: "" },
        { jornada: 9, fecha: "14/02/2026", hora: "", local: "DESCANSA", visitante: "CANACANTE", cancha: "", resultado: "" },
        { jornada: 9, fecha: "14/02/2026", hora: "", local: "NET 7 BLACKBOARD", visitante: "ELITEFIT CANARIAS", cancha: "", resultado: "" },
        // Jornada 10
        { jornada: 10, fecha: "28/02/2026", hora: "", local: "BRAVEHEART GC", visitante: "NET 7 BLACKBOARD", cancha: "", resultado: "" },
        { jornada: 10, fecha: "28/02/2026", hora: "", local: "ELITEFIT CANARIAS", visitante: "DESCANSA", cancha: "", resultado: "" },
        { jornada: 10, fecha: "01/03/2026", hora: "10:00", local: "CANACANTE", visitante: "ICOREN", cancha: "Canteras", resultado: "" },
        { jornada: 10, fecha: "28/02/2026", hora: "", local: "VOLEY MAXORATA", visitante: "OVERBLOCK MASPALOMAS", cancha: "", resultado: "" },
        // Jornada 11
        { jornada: 11, fecha: "07/03/2026", hora: "", local: "VOLEY MAXORATA", visitante: "BRAVEHEART GC", cancha: "", resultado: "" },
        { jornada: 11, fecha: "07/03/2026", hora: "", local: "OVERBLOCK MASPALOMAS", visitante: "CANACANTE", cancha: "", resultado: "" },
        { jornada: 11, fecha: "07/03/2026", hora: "", local: "ICOREN", visitante: "ELITEFIT CANARIAS", cancha: "", resultado: "" },
        { jornada: 11, fecha: "07/03/2026", hora: "", local: "DESCANSA", visitante: "NET 7 BLACKBOARD", cancha: "", resultado: "" },
        // Jornada 12
        { jornada: 12, fecha: "21/03/2026", hora: "", local: "BRAVEHEART GC", visitante: "DESCANSA", cancha: "", resultado: "" },
        { jornada: 12, fecha: "21/03/2026", hora: "", local: "NET 7 BLACKBOARD", visitante: "ICOREN", cancha: "", resultado: "" },
        { jornada: 12, fecha: "21/03/2026", hora: "", local: "ELITEFIT CANARIAS", visitante: "OVERBLOCK MASPALOMAS", cancha: "", resultado: "" },
        { jornada: 12, fecha: "22/03/2026", hora: "10:00", local: "CANACANTE", visitante: "VOLEY MAXORATA", cancha: "Canteras", resultado: "" },
        // Jornada 13
        { jornada: 13, fecha: "29/03/2026", hora: "10:00", local: "CANACANTE", visitante: "BRAVEHEART GC", cancha: "Canteras", resultado: "" },
        { jornada: 13, fecha: "28/03/2026", hora: "", local: "VOLEY MAXORATA", visitante: "ELITEFIT CANARIAS", cancha: "", resultado: "" },
        { jornada: 13, fecha: "28/03/2026", hora: "", local: "OVERBLOCK MASPALOMAS", visitante: "NET 7 BLACKBOARD", cancha: "", resultado: "" },
        { jornada: 13, fecha: "28/03/2026", hora: "", local: "ICOREN", visitante: "DESCANSA", cancha: "", resultado: "" },
        // Jornada 14
        { jornada: 14, fecha: "11/04/2026", hora: "", local: "BRAVEHEART GC", visitante: "ICOREN", cancha: "", resultado: "" },
        { jornada: 14, fecha: "11/04/2026", hora: "", local: "DESCANSA", visitante: "OVERBLOCK MASPALOMAS", cancha: "", resultado: "" },
        { jornada: 14, fecha: "11/04/2026", hora: "", local: "NET 7 BLACKBOARD", visitante: "VOLEY MAXORATA", cancha: "", resultado: "" },
        { jornada: 14, fecha: "11/04/2026", hora: "", local: "ELITEFIT CANARIAS", visitante: "CANACANTE", cancha: "", resultado: "" },
    ];

    return (
        <>
            <Head title="Liga Autonómica - Las Canteras Vóley" />
            <div className="min-h-screen bg-[#FFF8E8] text-gray-900 font-sans">
                <Navbar />
                <div className="pt-24 max-w-6xl mx-auto px-6 pb-12">
                    <h1 className="text-4xl font-extrabold text-[#1CA9C9] mb-6">Liga Autonómica</h1>
                    <p className="text-lg text-gray-700 mb-8">
                        LIGA SEGUNDA DIVISIÓN NACIONAL VOLEY PLAYA MASCULINO 2025/2026
                    </p>

                    <ScheduleTable schedule={schedule} />
                </div>
            </div>
        </>
    );
}
