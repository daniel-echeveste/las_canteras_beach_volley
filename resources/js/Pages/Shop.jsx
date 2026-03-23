import React, { useState } from "react";
import { Head } from "@inertiajs/react";
import Navbar from "@/Components/Navbar";

// ─── PRODUCTOS ──────────────────────────────────────────────────────────────
// Edita este array para añadir / quitar productos.
// Campos:
//   id        → identificador único
//   name      → nombre del producto
//   description → descripción corta (~2 líneas)
//   price     → precio orientativo (string). Pon null si no quieres mostrarlo.
//   image     → URL de la imagen del producto
//   link      → enlace de afiliado Amazon u otra tienda
//   category  → "balones" | "redes" | "ropa" | "gafas" | "accesorios"
//   badge     → "Amazon" | "Tienda Amiga" | null
//   rating    → 1–5 (número). Pon null para no mostrar estrellas.
// ────────────────────────────────────────────────────────────────────────────

const PRODUCTS = [
    {
        id: 1,
        name: "Mikasa Beach Pro BV550C",
        description: "Balón oficial de la Federación Mundial (FIVB) y el Voleibol World (VW)",
        price: "90,91 €",
        image: "https://m.media-amazon.com/images/I/61q-tMNXL8L._AC_SL1000_.jpg",
        link: "https://amzn.to/3PE4tLb",
        category: "balones",
        badge: "Amazon",
        rating: 5,
    },
    {
        id: 2,
        name: "Wilson WTH00020XB Balón de Voléibol",
        description: "Balón de vóley-playa de tamaño oficial de la AVP para que juegues como los profesionales",
        price: "78,71 €",
        image: "https://m.media-amazon.com/images/I/8111KcIjdIL._AC_SL1500_.jpg",
        link: "https://amzn.to/3Nl67AT",
        category: "balones",
        badge: "Amazon",
        rating: 4,
    },
    {
        id: 11,
        name: "Molten Volleybal V5M5000",
        description: "Uso y disfrute en pistas o canchas de interior.",
        price: "78,71 €",
        image: "https://m.media-amazon.com/images/I/81UhGb1hCGL._AC_SX425_.jpg",
        link: "https://amzn.to/4lN6AIM",
        category: "balones",
        badge: "Amazon",
        rating: 4,
    },
    {
        id: 3,
        name: "Navaris Red Voley Portatil ",
        description: "SET COMPLETO: Disfruta de una sesión de voleibol con este set completo de red de voley portatil",
        price: "95,99 €",
        image: "https://m.media-amazon.com/images/I/81DYeGEDsRL._AC_SL1500_.jpg",
        link: "https://amzn.to/3NXrwQL",
        category: "redes",
        badge: "Amazon",
        rating: 4,
    },
    // {
    //     id: 4,
    //     name: "Set Red + Postes Playa",
    //     description: "Kit completo de red y postes ajustables de aluminio para montar tu propia cancha en cualquier playa.",
    //     price: "149,00 €",
    //     image: "https://m.media-amazon.com/images/I/81U5VKvHb7L._AC_SL1500_.jpg",
    //     link: "https://www.amazon.es/dp/B00GMEWT7O?tag=TU_TAG_AQUI",
    //     category: "redes",
    //     badge: "Amazon",
    //     rating: 4,
    // },
    {
        id: 5,
        name: "Camiseta sin Mangas para Hombre",
        description: "Tejido ultraligero de secado rápido con protección UV50+. Perfecta para largas jornadas de sol y arena.",
        price: "13,99€ ",
        image: "https://m.media-amazon.com/images/I/51dcS8VKA8L._AC_SX569_.jpg",
        link: "https://amzn.to/4bYd18t",
        category: "ropa",
        badge: "Amazon",
        rating: 4,
    },
    {
        id: 6,
        name: "Short de Playa Pro",
        description: "Pantalones cortos de surf Diseño de cordón con cintura elástica",
        price: "26,59 €",
        image: "https://m.media-amazon.com/images/I/71Z8qJTc3bL._AC_SX569_.jpg",
        link: "https://amzn.to/4lMpDTB",
        category: "ropa",
        badge: "Amazon",
        rating: 3,
    },
    
    {
        id: 12,
        name: "Lamicall Polarizadas Gafas de Sol ",
        description: " Lentes polarizadas ideales para jugar en la playa sin deslumbramiento.",
        price: "25,64€",
        image: "https://m.media-amazon.com/images/I/512c2FxUdbL._AC_SX425_.jpg",
        link: "https://amzn.to/41kBMWi",
        category: "gafas",
        badge: "Amazon",
        rating: 5,
    },
    {
        id: 7,
        name: "Oakley Oo9463 Sutro Lite",
        description: " Lentes polarizadas ideales para jugar en la playa sin deslumbramiento.",
        price: "138,75 €",
        image: "https://m.media-amazon.com/images/I/51pJBnfMllL._AC_SX679_.jpg",
        link: "https://amzn.to/3NHOg75",
        category: "gafas",
        badge: "Amazon",
        rating: 5,
    },
    {
        id: 8,
        name: "Quiksilver Slash - Gafas de Sol para Hombre",
        description: "Montura ligera flexible con lentes de policarbonato. Diseñadas para el surf y la playa.",
        price: " 120,30€ ",
        image: "https://m.media-amazon.com/images/I/41CPfRnm9pL._AC_SX466_.jpg",
        link: "https://amzn.to/4sqK3Uv",
        category: "gafas",
        badge: "Amazon",
        rating: 4,
    },
    {
        id: 9,
        name: "Cinchas de Amarre, 4 Piezas",
        description: "Cada cinchas de amarretiene 2m de largo y 25mm de ancho y puede soportar hasta 250kg.",
        price: "8,99 €",
        image: "https://m.media-amazon.com/images/I/81S2AenfABL._AC_SL1500_.jpg",
        link: "https://amzn.to/3PnTntT",
        category: "accesorios",
        badge: "Amazon",
        rating: 4,
    },
    {
        id: 10,
        name: "Mobi Lock Herramientas Ball Pump",
        description: "Rápido y fiable:",
        price: "12,99 €",
        image: "https://m.media-amazon.com/images/I/71czaMkxzPL._AC_SX425_.jpg",
        link: "https://amzn.to/47g1qz4",
        category: "accesorios",
        badge: "Amazon",
        rating: 4,
    },
    // ── Ejemplos de "Tienda Amiga" ────────────────────────────────────────────
    // Descomenta y rellena con los datos reales cuando tengas los links:
    // {
    //     id: 11,
    //     name: "Nombre del producto amigo",
    //     description: "Descripción corta del producto de la tienda amiga.",
    //     price: "XX,XX €",
    //     image: "https://url-de-la-imagen.jpg",
    //     link: "https://tiendaamiga.com/producto",
    //     category: "ropa",
    //     badge: "Tienda Amiga",
    //     rating: 5,
    // },
];

// ─── CATEGORÍAS ──────────────────────────────────────────────────────────────
const CATEGORIES = [
    { key: "all",        label: "Todos",       emoji: "⚡" },
    { key: "balones",    label: "Balones",      emoji: "🏐" },
    { key: "redes",      label: "Redes",        emoji: "🕸️" },
    { key: "ropa",       label: "Ropa",         emoji: "👕" },
    { key: "gafas",      label: "Gafas",        emoji: "🕶️" },
    { key: "accesorios", label: "Accesorios",   emoji: "🎒" },
];

// ─── ESTRELLAS ───────────────────────────────────────────────────────────────
function StarRating({ rating }) {
    if (!rating) return null;
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
                <svg
                    key={star}
                    className={`w-4 h-4 ${star <= rating ? "text-amber-400" : "text-gray-200"}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            ))}
        </div>
    );
}

// ─── BADGE ───────────────────────────────────────────────────────────────────
function Badge({ type }) {
    if (!type) return null;
    const isAmazon = type === "Amazon";
    return (
        <span
            className={`absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full shadow-sm ${
                isAmazon
                    ? "bg-[#FF9900] text-white"
                    : "bg-[#1CA9C9] text-white"
            }`}
        >
            {isAmazon ? "🛒 Amazon" : "⭐ Tienda Amiga"}
        </span>
    );
}

// ─── PRODUCT CARD ─────────────────────────────────────────────────────────────
function ProductCard({ product }) {
    const [imgError, setImgError] = useState(false);

    return (
        <div className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col overflow-hidden border border-gray-100">
            {/* Image */}
            <div className="relative bg-gray-50 aspect-square overflow-hidden">
                {!imgError ? (
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                        onError={() => setImgError(true)}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl">
                        🏐
                    </div>
                )}
                <Badge type={product.badge} />
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col flex-1 gap-3">
                <h3 className="font-bold text-gray-900 text-base leading-snug line-clamp-2 group-hover:text-[#1CA9C9] transition-colors">
                    {product.name}
                </h3>

                <p className="text-sm text-gray-500 line-clamp-2 flex-1">
                    {product.description}
                </p>

                <div className="flex items-center justify-between mt-1">
                    <StarRating rating={product.rating} />
                    {product.price && (
                        <span className="text-lg font-extrabold text-gray-800">
                            {product.price}
                        </span>
                    )}
                </div>

                <a
                    href={product.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto w-full text-center bg-[#1CA9C9] hover:bg-[#158BA8] active:scale-95 text-white font-semibold py-2.5 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
                >
                    Ver producto
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                </a>
            </div>
        </div>
    );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────
export default function Shop() {
    const [activeCategory, setActiveCategory] = useState("all");
    const [activeBadge, setActiveBadge] = useState("all");

    const filtered = PRODUCTS.filter((p) => {
        const categoryMatch = activeCategory === "all" || p.category === activeCategory;
        const badgeMatch =
            activeBadge === "all" ||
            (activeBadge === "amazon" && p.badge === "Amazon") ||
            (activeBadge === "amiga" && p.badge === "Tienda Amiga");
        return categoryMatch && badgeMatch;
    });

    return (
        <>
            <Head title="Tienda - Las Canteras Beach Volley" />
            <div className="min-h-screen bg-[#FFF8E8] text-gray-900 font-sans">
                <Navbar />

                {/* Hero */}
                <div className="pt-24 pb-10 bg-gradient-to-br from-[#1CA9C9]/10 via-[#FFF8E8] to-[#FFF8E8]">
                    <div className="max-w-6xl mx-auto px-6">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-4xl">🏐</span>
                            <h1 className="text-4xl font-extrabold text-[#1CA9C9]">Tienda</h1>
                        </div>
                        <p className="text-gray-600 text-lg max-w-xl">
                            Material seleccionado para jugadores de vóley playa. Afiliados de Amazon y productos de tiendas amigas.
                        </p>
                    </div>
                </div>

                <div className="max-w-6xl mx-auto px-6 pb-20">

                    {/* Filters */}
                    <div className="py-6 flex flex-wrap gap-3 items-center">
                        {/* Category pills */}
                        <div className="flex flex-wrap gap-2">
                            {CATEGORIES.map((cat) => (
                                <button
                                    key={cat.key}
                                    onClick={() => setActiveCategory(cat.key)}
                                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                                        activeCategory === cat.key
                                            ? "bg-[#1CA9C9] text-white shadow-md shadow-[#1CA9C9]/30"
                                            : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                                    }`}
                                >
                                    <span>{cat.emoji}</span>
                                    {cat.label}
                                </button>
                            ))}
                        </div>

                        {/* Divider */}
                        <div className="hidden sm:block w-px h-6 bg-gray-300 mx-1" />

                        {/* Badge filters */}
                        <div className="flex gap-2">
                            {[
                                { key: "all",    label: "Todas las tiendas" },
                                { key: "amazon", label: "🛒 Amazon" },
                                { key: "amiga",  label: "⭐ Tiendas Amigas" },
                            ].map((b) => (
                                <button
                                    key={b.key}
                                    onClick={() => setActiveBadge(b.key)}
                                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                                        activeBadge === b.key
                                            ? "bg-gray-800 text-white"
                                            : "bg-white text-gray-500 hover:bg-gray-100 border border-gray-200"
                                    }`}
                                >
                                    {b.label}
                                </button>
                            ))}
                        </div>

                        {/* Count */}
                        <span className="ml-auto text-sm text-gray-400 font-medium hidden sm:block">
                            {filtered.length} producto{filtered.length !== 1 ? "s" : ""}
                        </span>
                    </div>

                    {/* Grid */}
                    {filtered.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                            {filtered.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <div className="text-6xl mb-4">🏖️</div>
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">
                                No hay productos en esta categoría
                            </h3>
                            <p className="text-gray-500 mb-6">
                                Prueba con otra categoría o quita los filtros.
                            </p>
                            <button
                                onClick={() => { setActiveCategory("all"); setActiveBadge("all"); }}
                                className="text-[#1CA9C9] font-semibold hover:underline"
                            >
                                Ver todos los productos
                            </button>
                        </div>
                    )}

                    {/* Disclaimer */}
                    <p className="mt-12 text-center text-xs text-gray-400">
                        Algunos enlaces son de afiliados de Amazon. Al comprar a través de ellos, apoyás a Las Canteras Beach Volley sin coste adicional para ti.
                    </p>
                </div>
            </div>
        </>
    );
}
