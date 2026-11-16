import React, { useState } from "react";
import { Link } from "@inertiajs/react";
import { PageShell, Icon } from "@/Components/ui";
import { POST_TYPES } from "@/Pages/Blog";

const getYouTubeVideoId = (url) => {
    if (!url) return null;
    try {
        if (url.includes("youtu.be/")) return url.split("youtu.be/")[1]?.split(/[?&#]/)[0];
        if (url.includes("/embed/")) return url.split("/embed/")[1]?.split(/[?&#]/)[0];
        if (url.includes("/shorts/")) return url.split("/shorts/")[1]?.split(/[?&#]/)[0];
        return new URL(url).searchParams.get("v");
    } catch {
        return null;
    }
};

const fmtLong = (d, withTime = false) =>
    new Date(d).toLocaleDateString("es-ES", {
        weekday: withTime ? "long" : undefined,
        year: "numeric",
        month: "long",
        day: "numeric",
        ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
    });

function DateCallout({ label, date, tone }) {
    const tones = {
        violet: "bg-violet-50 ring-violet-200 text-violet-900",
        amber: "bg-amber-50 ring-amber-200 text-amber-900",
    };
    return (
        <div className={`flex items-center gap-4 rounded-2xl ring-1 p-4 sm:p-5 ${tones[tone]}`}>
            <span className="w-12 h-12 rounded-xl bg-white/70 flex items-center justify-center shrink-0">
                <Icon name="calendar" className="w-6 h-6" />
            </span>
            <div>
                <div className="text-xs font-bold uppercase tracking-wider opacity-70">{label}</div>
                <div className="text-lg font-extrabold first-letter:uppercase">{fmtLong(date, true)}</div>
            </div>
        </div>
    );
}

export default function Post({ post }) {
    const [formData, setFormData] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState(null);

    const type = POST_TYPES[post.post_type] ?? POST_TYPES.noticia;
    const videoId = getYouTubeVideoId(post.youtube_url);
    const hasForm = post.post_type === "torneo" && post.has_form && post.form_fields?.length > 0;
    const isTournamentPast = post.tournament_date && new Date(post.tournament_date) < new Date();

    const handleChange = (name, value) => setFormData((prev) => ({ ...prev, [name]: value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        try {
            const response = await fetch(route("tournament.register", post.id), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').content,
                },
                body: JSON.stringify(formData),
            });
            const data = await response.json().catch(() => ({}));
            if (response.ok) {
                setSubmitted(true);
                setFormData({});
            } else {
                setError(data.message || "Error al enviar el formulario");
            }
        } catch {
            setError("Error al enviar el formulario. Por favor, inténtalo de nuevo.");
        } finally {
            setSubmitting(false);
        }
    };

    const field = (f) => {
        const cls = "mt-1.5 block w-full rounded-xl border-gray-200 bg-white shadow-sm focus:border-[#1CA9C9] focus:ring-[#1CA9C9]";
        const common = { value: formData[f.name] || "", onChange: (e) => handleChange(f.name, e.target.value), required: f.required, className: cls };
        if (f.type === "textarea") return <textarea rows="4" {...common} />;
        if (f.type === "select") {
            return (
                <select {...common}>
                    <option value="">Selecciona una opción</option>
                    {f.options?.map((o, i) => <option key={i} value={o}>{o}</option>)}
                </select>
            );
        }
        return <input type={f.type} {...common} />;
    };

    return (
        <PageShell title={`${post.title} - Las Canteras Beach Volley`}>
            {/* Cabecera */}
            <header className="relative pt-28 pb-16 sm:pb-20 overflow-hidden bg-[#0A2E37]">
                {post.image_path && (
                    <img onError={(e) => (e.currentTarget.style.display = "none")} src={`/storage/${post.image_path}`} alt="" className="absolute inset-0 w-full h-full object-cover opacity-40" />
                )}
                <div className="absolute inset-0 bg-gradient-to-br from-[#127F98]/80 via-[#0A2E37]/85 to-[#0A2E37]" />
                <div className="relative max-w-3xl mx-auto px-4 sm:px-6">
                    <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm font-bold text-white/70 hover:text-white mb-8">
                        <Icon name="arrowLeft" className="w-4 h-4" /> Volver al blog
                    </Link>
                    <div className="flex flex-wrap items-center gap-3 mb-5">
                        <span className={`badge ${type.cls}`}><Icon name={type.icon} className="w-3 h-3" /> {type.label}</span>
                        <time className="text-sm text-white/60">{fmtLong(post.created_at)}</time>
                    </div>
                    <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-[1.08]">{post.title}</h1>
                </div>
                <svg className="absolute bottom-0 left-0 w-full h-10 text-[#FFF8E8]" viewBox="0 0 1440 48" preserveAspectRatio="none" aria-hidden="true">
                    <path fill="currentColor" d="M0 32c120-18 240-27 360-27s240 9 360 18 240 13 360 9 240-14 360-27v43H0z" />
                </svg>
            </header>

            <main className="max-w-3xl mx-auto px-4 sm:px-6 pb-20">
                {/* Media */}
                {videoId ? (
                    <div className="-mt-6 mb-10 aspect-video rounded-3xl overflow-hidden bg-black shadow-xl">
                        <iframe
                            className="w-full h-full"
                            src={`https://www.youtube.com/embed/${videoId}`}
                            title={post.title}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    </div>
                ) : post.image_path ? (
                    <img onError={(e) => (e.currentTarget.style.display = "none")} src={`/storage/${post.image_path}`} alt={post.title} className="-mt-6 mb-10 w-full max-h-[480px] object-cover rounded-3xl shadow-xl" />
                ) : (
                    <div className="h-8" />
                )}

                <div className="space-y-4 mb-10">
                    {post.post_type === "evento" && post.event_date && <DateCallout label="Fecha del evento" date={post.event_date} tone="violet" />}
                    {post.post_type === "torneo" && post.tournament_date && <DateCallout label="Fecha del torneo" date={post.tournament_date} tone="amber" />}
                </div>

                <article className="post-content" dangerouslySetInnerHTML={{ __html: post.content }} />

                {/* Inscripción */}
                {hasForm && (
                    <section id="inscripcion" className="mt-14 bg-white rounded-3xl border border-black/5 shadow-sm p-6 sm:p-8">
                        <h2 className="text-2xl font-black tracking-tight">Inscripción al torneo</h2>

                        {isTournamentPast ? (
                            <div className="mt-5 flex items-center gap-4 rounded-2xl bg-gray-50 ring-1 ring-gray-200 p-5">
                                <Icon name="lock" className="w-7 h-7 text-gray-400 shrink-0" />
                                <div>
                                    <p className="font-bold text-gray-800">Inscripciones cerradas</p>
                                    <p className="text-gray-500 text-sm">El plazo para inscribirse a este torneo ha finalizado.</p>
                                </div>
                            </div>
                        ) : submitted ? (
                            <div className="mt-5 flex items-center gap-4 rounded-2xl bg-emerald-50 ring-1 ring-emerald-200 p-5">
                                <Icon name="check" className="w-7 h-7 text-emerald-600 shrink-0" />
                                <div>
                                    <p className="font-bold text-emerald-900">¡Inscripción enviada!</p>
                                    <p className="text-emerald-800 text-sm">Recibirás una confirmación en tu email.</p>
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="mt-6 grid gap-5">
                                {post.form_fields.map((f, i) => (
                                    <label key={i} className="block">
                                        <span className="text-sm font-semibold text-gray-700">
                                            {f.label}
                                            {f.required && <span className="text-rose-500 ml-0.5">*</span>}
                                        </span>
                                        {field(f)}
                                    </label>
                                ))}
                                {error && <div className="rounded-xl bg-rose-50 ring-1 ring-rose-200 text-rose-800 px-4 py-3 text-sm">{error}</div>}
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full py-3.5 rounded-full bg-[#0D5C6E] hover:bg-[#127F98] text-white font-bold shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {submitting ? "Enviando…" : "Enviar inscripción"}
                                </button>
                            </form>
                        )}
                    </section>
                )}

                <div className="mt-14 pt-8 border-t border-black/10 flex justify-between items-center gap-4">
                    <Link href="/blog" className="inline-flex items-center gap-1.5 font-bold text-[#0D5C6E] hover:text-[#1CA9C9]">
                        <Icon name="arrowLeft" className="w-4 h-4" /> Más noticias
                    </Link>
                    <Link href="/liga-autonomica" className="inline-flex items-center gap-1.5 font-bold text-[#0D5C6E] hover:text-[#1CA9C9]">
                        Ver la liga <Icon name="arrowRight" className="w-4 h-4" />
                    </Link>
                </div>
            </main>

            <style>{`
                .post-content { color:#374151; font-size:1.075rem; line-height:1.8; }
                .post-content > * + * { margin-top:1.1em; }
                .post-content h1, .post-content h2 { font-size:1.6rem; font-weight:900; color:#111827; line-height:1.25; margin-top:1.8em; letter-spacing:-0.01em; }
                .post-content h3 { font-size:1.25rem; font-weight:800; color:#111827; margin-top:1.6em; }
                .post-content a { color:#0D5C6E; font-weight:600; text-decoration:underline; text-decoration-color:#1CA9C9; text-underline-offset:3px; }
                .post-content a:hover { color:#1CA9C9; }
                .post-content strong { color:#111827; }
                .post-content ul { list-style:disc; padding-left:1.4em; }
                .post-content ol { list-style:decimal; padding-left:1.4em; }
                .post-content li + li { margin-top:.35em; }
                .post-content li::marker { color:#1CA9C9; }
                .post-content blockquote { border-left:4px solid #FFD369; background:#fff; padding:1em 1.25em; border-radius:0 1rem 1rem 0; font-style:italic; color:#4b5563; }
                .post-content img { border-radius:1.25rem; max-width:100%; height:auto; }
                .post-content iframe { width:100%; aspect-ratio:16/9; height:auto; border-radius:1.25rem; }
                .post-content table { width:100%; border-collapse:collapse; font-size:.95rem; }
                .post-content th, .post-content td { border-bottom:1px solid #e5e7eb; padding:.6em .75em; text-align:left; }
                .post-content .ql-align-center { text-align:center; } .post-content .ql-align-right { text-align:right; }
            `}</style>
        </PageShell>
    );
}
