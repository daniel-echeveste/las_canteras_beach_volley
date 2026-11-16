import React, { useMemo, useState } from "react";
import { PageShell, PageHero, Segmented, SearchInput, Modal, Spinner, EmptyState, Icon, RFEVB_TABLE_CSS } from "@/Components/ui";

const PAGE = 100;

// "PEREZ SUAREZ, PABLO JOSE" -> { surname: "Pérez Suárez"..., name: "Pablo José" } (solo capitalización)
const titleCase = (s) => s.toLowerCase().replace(/(^|[\s-])(\p{L})/gu, (m, p, c) => p + c.toUpperCase());
const splitName = (full = "") => {
    const [surname, name] = full.split(",").map((x) => x.trim());
    return { surname: titleCase(surname || full), name: name ? titleCase(name) : "" };
};
const initials = (full) => {
    const { surname, name } = splitName(full);
    return ((name[0] || "") + (surname[0] || "")).toUpperCase();
};

const normalize = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

export default function Ranking({ rankingMasculino = [], rankingFemenino = [] }) {
    const [gender, setGender] = useState("masculino");
    const [search, setSearch] = useState("");
    const [limit, setLimit] = useState(PAGE);
    const [modal, setModal] = useState(null); // { player, html, loading }

    const ranking = gender === "masculino" ? rankingMasculino : rankingFemenino;

    const filtered = useMemo(() => {
        if (!search) return ranking;
        const q = normalize(search);
        return ranking.filter((r) => normalize(r.player).includes(q));
    }, [ranking, search]);

    const changeGender = (g) => {
        setGender(g);
        setLimit(PAGE);
    };

    const openPlayer = async (p) => {
        setModal({ player: p, html: "", loading: true });
        try {
            const res = await fetch(`/ranking/torneos/${p.idPersona}`);
            const data = await res.json();
            setModal({ player: p, loading: false, html: data.success ? data.html : "<p>No se pudieron cargar los torneos.</p>" });
        } catch {
            setModal({ player: p, loading: false, html: "<p>Error al cargar los torneos.</p>" });
        }
    };

    const visible = filtered.slice(0, limit);

    return (
        <PageShell title="Ranking Nacional - Las Canteras Beach Volley">
            <PageHero
                compact
                eyebrow="RFEVB · Vóley playa"
                title="Ranking nacional"
                subtitle="Clasificación oficial de la Real Federación Española de Voleibol, actualizada a día de hoy."
                aside={
                    <Segmented
                        dark
                        value={gender}
                        onChange={changeGender}
                        options={[
                            { value: "masculino", label: "Masculino" },
                            { value: "femenino", label: "Femenino" },
                        ]}
                    />
                }
            />

            <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
                {ranking.length === 0 ? (
                    <EmptyState icon="chart" title="Ranking no disponible">
                        No hemos podido cargar el ranking de la RFEVB. Vuelve a intentarlo en un rato.
                    </EmptyState>
                ) : (
                    <>

                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
                            <SearchInput value={search} onChange={(v) => { setSearch(v); setLimit(PAGE); }} placeholder="Buscar jugador/a…" className="flex-1" />
                            <span className="text-sm text-gray-500 sm:text-right shrink-0">
                                {filtered.length.toLocaleString("es-ES")} {filtered.length === 1 ? "jugador/a" : "jugadores"}
                            </span>
                        </div>

                        {filtered.length === 0 ? (
                            <EmptyState icon="search" title="Sin resultados">No hay nadie que coincida con «{search}».</EmptyState>
                        ) : (
                            <div className="bg-white rounded-3xl border border-black/5 shadow-sm overflow-hidden">
                                <ol className="divide-y divide-gray-100">
                                    {visible.map((p) => {
                                        const { surname, name } = splitName(p.player);
                                        return (
                                            <li key={`${p.rank}-${p.idPersona}`}>
                                                <button
                                                    onClick={() => p.idPersona && openPlayer(p)}
                                                    disabled={!p.idPersona}
                                                    className="w-full flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-3.5 text-left hover:bg-[#1CA9C9]/[0.04] transition-colors group"
                                                >
                                                    <span className={`w-9 text-center tabular-nums font-extrabold ${p.rank <= 3 ? "text-[#0D5C6E]" : "text-gray-400"} text-sm`}>
                                                        {p.rank}
                                                    </span>
                                                    <span className="hidden sm:flex w-9 h-9 rounded-full bg-[#E6F6FA] text-[#0D5C6E] text-xs font-bold items-center justify-center shrink-0">
                                                        {initials(p.player)}
                                                    </span>
                                                    <span className="flex-1 min-w-0">
                                                        <span className="block font-bold text-gray-900 truncate group-hover:text-[#0D5C6E]">{name || surname}</span>
                                                        {name && <span className="block text-sm text-gray-500 truncate">{surname}</span>}
                                                    </span>
                                                    <span className="text-right">
                                                        <span className="block font-black tabular-nums text-gray-900">{p.points}</span>
                                                        <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">puntos</span>
                                                    </span>
                                                    {p.idPersona && <Icon name="arrow" className="w-4 h-4 text-gray-300 group-hover:text-[#1CA9C9] shrink-0" />}
                                                </button>
                                            </li>
                                        );
                                    })}
                                </ol>
                                {filtered.length > limit && (
                                    <button
                                        onClick={() => setLimit((l) => l + PAGE)}
                                        className="w-full py-4 border-t border-gray-100 text-sm font-bold text-[#0D5C6E] hover:bg-gray-50"
                                    >
                                        Mostrar más ({(filtered.length - limit).toLocaleString("es-ES")} restantes)
                                    </button>
                                )}
                            </div>
                        )}
                    </>
                )}

                <p className="mt-10 text-center text-xs text-gray-500">
                    Fuente:{" "}
                    <a href={`https://www.rfevb.com/ranking-voley-playa-${gender}`} target="_blank" rel="noopener noreferrer" className="font-semibold text-[#0D5C6E] hover:underline">
                        RFEVB
                    </a>{" "}
                    · Pulsa un jugador/a para ver sus torneos
                </p>
            </main>

            <Modal
                open={!!modal}
                onClose={() => setModal(null)}
                subtitle={modal ? `#${modal.player.rank} · ${modal.player.points} puntos` : ""}
                title={modal ? (() => { const { name, surname } = splitName(modal.player.player); return `${name} ${surname}`.trim(); })() : ""}
            >
                {modal?.loading ? <Spinner label="Cargando torneos…" /> : <div className="rfevb-html" dangerouslySetInnerHTML={{ __html: modal?.html || "" }} />}
            </Modal>

            <style>{RFEVB_TABLE_CSS("rfevb-html")}</style>
        </PageShell>
    );
}
