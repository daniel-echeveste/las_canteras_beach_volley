import React from "react";
import { Link } from "@inertiajs/react";
import { PageShell, Icon, TeamAvatar } from "@/Components/ui";

const HERO_IMAGE = "https://estaticos-cdn.prensaiberica.es/clip/bbc75e72-3f84-4133-afc1-c27ea269461a_16-9-discover-aspect-ratio_default_0.jpg";

const stripHtml = (html) => {
    if (!html || typeof window === "undefined") return "";
    return new DOMParser().parseFromString(html, "text/html").body.textContent || "";
};

const fmtMatchDay = (iso, time) => {
    if (!iso) return "Fecha por confirmar";
    const [y, m, d] = iso.split("-").map(Number);
    const s = new Intl.DateTimeFormat("es-ES", { weekday: "short", day: "numeric", month: "short" })
        .format(new Date(y, m - 1, d))
        .replace(/\./g, "");
    return `${s}${time ? ` · ${time}` : ""}`;
};

/* ------------------------------------------------------------------ */

function NextMatch({ label, match }) {
    if (!match) return null;
    return (
        <div className="rounded-2xl bg-white/[0.07] ring-1 ring-white/10 p-4">
            <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider mb-3">
                <span className="text-[#FFD369]">{label}</span>
                <span className="text-white/50 capitalize normal-case tracking-normal font-semibold">{fmtMatchDay(match.date, match.time)}</span>
            </div>
            <div className="space-y-2">
                {[match.home, match.away].map((t, i) => (
                    <div key={i} className="flex items-center gap-2.5 min-w-0">
                        <TeamAvatar team={t} size="w-7 h-7" />
                        <span className="text-white font-semibold text-sm truncate">{t?.name}</span>
                    </div>
                ))}
            </div>
            {match.facility?.name && (
                <div className="mt-3 text-xs text-white/50 flex items-center gap-1.5">
                    <Icon name="pin" className="w-3.5 h-3.5" /> {match.facility.name}
                </div>
            )}
        </div>
    );
}

function BentoCard({ href, title, text, icon, className = "", tone = "light", children }) {
    const tones = {
        light: "bg-white text-gray-900 border border-black/5",
        sea: "bg-gradient-to-br from-[#1CA9C9] to-[#0D5C6E] text-white",
        sun: "bg-gradient-to-br from-[#FFD369] to-[#FFA500] text-black",
        deep: "bg-[#0A2E37] text-white",
    };
    const sub = tone === "light" ? "text-gray-500" : tone === "sun" ? "text-black/70" : "text-white/70";
    const chip = tone === "light" ? "bg-[#1CA9C9]/10 text-[#1CA9C9]" : tone === "sun" ? "bg-black/10 text-black" : "bg-white/15 text-white";

    return (
        <Link
            href={href}
            className={`group relative overflow-hidden rounded-3xl p-6 sm:p-7 flex flex-col shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${tones[tone]} ${className}`}
        >
            <span className={`w-11 h-11 rounded-2xl flex items-center justify-center ${chip}`}>
                <Icon name={icon} className="w-5 h-5" />
            </span>
            <h3 className="mt-5 text-xl sm:text-2xl font-black tracking-tight">{title}</h3>
            <p className={`mt-2 text-sm sm:text-base leading-relaxed ${sub}`}>{text}</p>
            {children}
            <span className="mt-auto pt-6 inline-flex items-center gap-1.5 text-sm font-bold">
                Entrar
                <Icon name="arrowRight" className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </span>
        </Link>
    );
}

function MiniStandings({ data, category }) {
    return (
        <div className="bg-white rounded-3xl border border-black/5 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <h3 className="font-extrabold">{data.label}</h3>
                <Link href={`/liga-autonomica?cat=${category}`} className="text-sm font-semibold text-[#0D5C6E] hover:text-[#1CA9C9] inline-flex items-center gap-0.5">
                    Clasificación completa <Icon name="arrow" className="w-3.5 h-3.5" />
                </Link>
            </div>
            <ol className="divide-y divide-gray-100">
                {data.top.map((t) => (
                    <li key={t.teamId} className="flex items-center gap-3 px-5 py-3">
                        <span className={`w-7 h-7 rounded-full text-xs font-extrabold flex items-center justify-center ${t.position === 1 ? "bg-[#FFD369] text-[#5c3d00]" : "text-gray-400"}`}>
                            {t.position}
                        </span>
                        <TeamAvatar team={t} size="w-8 h-8" />
                        <span className="flex-1 min-w-0 truncate font-semibold">{t.name}</span>
                        <span className="text-xs text-gray-400 tabular-nums hidden sm:inline">{t.played} PJ</span>
                        <span className="w-12 text-right font-black tabular-nums">{t.points}<span className="text-[10px] text-gray-400 font-bold ml-0.5">PTS</span></span>
                    </li>
                ))}
            </ol>
        </div>
    );
}

function PostCard({ post }) {
    return (
        <Link href={`/blog/${post.slug}`} className="group flex flex-col bg-white rounded-3xl overflow-hidden border border-black/5 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-[#1CA9C9] to-[#0D5C6E]">
                {post.image_path ? (
                    <img src={`/storage/${post.image_path}`} alt="" loading="lazy" onError={(e) => (e.currentTarget.style.display = "none")} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                    <img src="/logo-nobg.png" alt="" className="absolute inset-0 m-auto w-20 h-20 opacity-40" />
                )}
            </div>
            <div className="p-6 flex-1 flex flex-col">
                <time className="text-xs font-bold uppercase tracking-wider text-[#1CA9C9]">
                    {new Date(post.created_at).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })}
                </time>
                <h3 className="mt-2 text-lg font-extrabold leading-snug line-clamp-2 group-hover:text-[#0D5C6E]">{post.title}</h3>
                <p className="mt-2 text-sm text-gray-500 line-clamp-2">{stripHtml(post.content)}</p>
            </div>
        </Link>
    );
}

/* ------------------------------------------------------------------ */

export default function LandingPage({ latestPosts = [], league = {}, season }) {
    const hasLeague = league && Object.keys(league).length > 0;
    const leader = league?.male?.top?.[0];

    return (
        <PageShell title="Vóley Playa Las Canteras">
            {/* ================= HERO ================= */}
            <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-[#0A2E37]">
                <img src={HERO_IMAGE} alt="" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0A2E37] via-[#0A2E37]/80 to-[#0A2E37]/20" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A2E37]/70 via-transparent to-transparent" />

                <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 pt-32 pb-28 grid lg:grid-cols-12 gap-10 items-center">
                    <div className="lg:col-span-7">
                        <span className="inline-flex items-center gap-2 text-[#FFD369] text-xs font-bold uppercase tracking-[0.22em] mb-5 animate-fade-in">
                            <span className="w-6 h-px bg-[#FFD369]" />
                            Las Palmas de Gran Canaria
                        </span>
                        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[0.95] animate-fade-in">
                            Vóley playa en
                            <span className="block bg-gradient-to-r from-[#5FD3EC] to-[#FFD369] bg-clip-text text-transparent pb-2">Las Canteras</span>
                        </h1>
                        <p className="mt-6 text-lg sm:text-xl text-white/80 max-w-xl leading-relaxed">
                            Arena, sol y comunidad. Sigue la liga, el ranking nacional y los torneos, y mira si hoy hace día de playa.
                        </p>
                        <div className="mt-9 flex flex-wrap gap-3">
                            <Link href="/liga-autonomica" className="inline-flex items-center gap-2 bg-[#FFD369] hover:bg-[#ffc94a] text-black font-bold px-7 py-4 rounded-full shadow-lg shadow-black/20 transition-all hover:scale-[1.03]">
                                Liga 2ª División <Icon name="arrowRight" />
                            </Link>
                            <Link href="/ranking" className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur text-white font-bold px-7 py-4 rounded-full ring-1 ring-white/25 transition-all">
                                Ranking nacional
                            </Link>
                        </div>
                    </div>

                    {hasLeague && (
                        <aside className="lg:col-span-5 lg:pl-6">
                            <div className="rounded-3xl bg-[#0A2E37]/60 backdrop-blur-xl ring-1 ring-white/15 p-5 sm:p-6 shadow-2xl">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/50">Próximos partidos</div>
                                        <div className="text-white font-extrabold text-lg">Liga 2ª División {season}</div>
                                    </div>
                                    <span className="relative flex w-2.5 h-2.5">
                                        <span className="absolute inline-flex w-full h-full rounded-full bg-[#FFD369] opacity-75 animate-ping" />
                                        <span className="relative inline-flex w-2.5 h-2.5 rounded-full bg-[#FFD369]" />
                                    </span>
                                </div>
                                <div className="grid gap-3">
                                    <NextMatch label="Masculino" match={league.male?.next} />
                                    <NextMatch label="Femenino" match={league.female?.next} />
                                </div>
                                <Link href="/liga-autonomica?tab=calendario" className="mt-4 flex items-center justify-center gap-1.5 text-sm font-bold text-white/80 hover:text-white">
                                    Ver calendario completo <Icon name="arrow" className="w-3.5 h-3.5" />
                                </Link>
                            </div>
                        </aside>
                    )}
                </div>

                <svg className="absolute bottom-0 left-0 w-full h-12 text-[#FFF8E8]" viewBox="0 0 1440 48" preserveAspectRatio="none" aria-hidden="true">
                    <path fill="currentColor" d="M0 32c120-18 240-27 360-27s240 9 360 18 240 13 360 9 240-14 360-27v43H0z" />
                </svg>
            </section>

            {/* ================= EXPLORA ================= */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
                <div className="max-w-2xl mb-10">
                    <h2 className="text-3xl sm:text-4xl font-black tracking-tight">Todo el vóley playa, en un sitio</h2>
                    <p className="mt-3 text-gray-600 text-lg">Competición, ranking, torneos y el tiempo en la playa.</p>
                </div>

                <div className="grid gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-4 lg:auto-rows-[minmax(220px,auto)]">
                    <BentoCard
                        href="/liga-autonomica"
                        tone="sea"
                        icon="trophy"
                        title="Liga 2ª División"
                        text="Calendario, resultados y clasificación oficial de la temporada, masculina y femenina."
                        className="lg:col-span-2 lg:row-span-2"
                    >
                        {leader && (
                            <div className="mt-6 rounded-2xl bg-white/10 ring-1 ring-white/15 p-4 flex items-center gap-3 max-w-sm">
                                <TeamAvatar team={leader} size="w-10 h-10" />
                                <div className="min-w-0">
                                    <div className="text-[11px] font-bold uppercase tracking-wider text-white/60">Líder masculino</div>
                                    <div className="font-extrabold truncate">{leader.name}</div>
                                </div>
                                <div className="ml-auto text-2xl font-black">{leader.points}<span className="text-xs font-bold text-white/60 ml-1">PTS</span></div>
                            </div>
                        )}
                    </BentoCard>
                    <BentoCard href="/ranking" tone="sun" icon="chart" title="Ranking nacional" text="El ranking oficial de la RFEVB y el historial de torneos de cada jugador." className="lg:col-span-2" />
                    <BentoCard href="/calendario" icon="calendar" title="Torneos" text="Pruebas puntuables homologadas para el ranking." />
                    <BentoCard href="/forecast" tone="deep" icon="sun" title="Previsión" text="Viento, UV y sol en Las Canteras, hora a hora." />
                </div>
            </section>

            {/* ================= LIGA ================= */}
            {hasLeague && (
                <section className="bg-white/60 border-y border-black/5">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
                        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
                            <div>
                                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#1CA9C9]">Temporada {season}</span>
                                <h2 className="mt-2 text-3xl sm:text-4xl font-black tracking-tight">Así va la liga</h2>
                            </div>
                            <Link href="/liga-autonomica" className="inline-flex items-center gap-1.5 font-bold text-[#0D5C6E] hover:text-[#1CA9C9]">
                                Ir a la liga <Icon name="arrowRight" />
                            </Link>
                        </div>
                        <div className="grid md:grid-cols-2 gap-5">
                            {league.male && <MiniStandings data={league.male} category="male" />}
                            {league.female && <MiniStandings data={league.female} category="female" />}
                        </div>
                    </div>
                </section>
            )}

            {/* ================= NOTICIAS ================= */}
            {latestPosts.length > 0 && (
                <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
                        <div>
                            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#1CA9C9]">Blog</span>
                            <h2 className="mt-2 text-3xl sm:text-4xl font-black tracking-tight">Últimas noticias</h2>
                        </div>
                        <Link href="/blog" className="inline-flex items-center gap-1.5 font-bold text-[#0D5C6E] hover:text-[#1CA9C9]">
                            Todas las noticias <Icon name="arrowRight" />
                        </Link>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {latestPosts.map((post) => <PostCard key={post.id} post={post} />)}
                    </div>
                </section>
            )}

            {/* ================= LA PLAYA ================= */}
            <section className="px-4 sm:px-6 pb-20">
                <div className="relative max-w-7xl mx-auto rounded-[2rem] overflow-hidden bg-gradient-to-br from-[#1CA9C9] via-[#127F98] to-[#0B3F4C] text-white">
                    <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#FFD369]/20 blur-3xl" aria-hidden="true" />
                    <div className="relative grid lg:grid-cols-2 gap-12 p-8 sm:p-12 lg:p-16 items-center">
                        <div>
                            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">La Playa de Las Canteras</h2>
                            <p className="mt-5 text-lg text-white/85 leading-relaxed">
                                Más de tres kilómetros de arena dorada y aguas tranquilas: el escenario perfecto para el vóley playa.
                                Aquí juegan desde quienes empiezan hasta quienes compiten en el circuito nacional.
                            </p>
                            <p className="mt-4 text-white/70 leading-relaxed">
                                Torneos, liga y quedadas todo el año gracias al clima de Gran Canaria.
                            </p>
                        </div>
                        <div className="grid grid-cols-3 gap-3 sm:gap-4">
                            {[
                                { v: "8", l: "Canchas" },
                                { v: "3 km", l: "De playa" },
                                { v: "365", l: "Días de sol" },
                            ].map((s) => (
                                <div key={s.l} className="rounded-2xl bg-white/10 ring-1 ring-white/15 backdrop-blur p-4 sm:p-6 text-center">
                                    <div className="text-3xl sm:text-5xl font-black tracking-tight">{s.v}</div>
                                    <div className="mt-1 text-xs sm:text-sm text-white/70 font-semibold">{s.l}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ================= CTA ================= */}
            <section className="px-4 sm:px-6 pb-20">
                <div className="max-w-7xl mx-auto rounded-[2rem] bg-gradient-to-r from-[#FFD369] to-[#FFA500] p-8 sm:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-lg">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-black text-black">¿Hace día de playa?</h2>
                        <p className="text-black/70 mt-2 text-lg">Mira el viento, el índice UV y las horas de sol antes de bajar a jugar.</p>
                    </div>
                    <Link href="/forecast" className="shrink-0 inline-flex items-center gap-2 bg-black text-white font-bold px-8 py-4 rounded-full hover:bg-gray-800 transition-all hover:scale-105 shadow-lg">
                        Ver previsión <Icon name="arrowRight" />
                    </Link>
                </div>
            </section>
        </PageShell>
    );
}
