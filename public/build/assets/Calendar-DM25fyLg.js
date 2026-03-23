import{r as i,j as e,S as M}from"./app-nvgp1cJ0.js";import{N as F}from"./Navbar-DB-8OyLC.js";const S=["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];function A(r){if(!r)return null;const s=r.split("/");return s.length!==3?null:new Date(s[2],s[1]-1,s[0])}function L(r){const s=parseFloat(r);return s>=30?{bg:"bg-gradient-to-r from-amber-500 to-yellow-400",border:"border-amber-500",badge:"bg-amber-500",text:"text-amber-700",label:"Elite"}:s>=15?{bg:"bg-gradient-to-r from-purple-500 to-indigo-500",border:"border-purple-500",badge:"bg-purple-500",text:"text-purple-700",label:"CNVP"}:s>=4?{bg:"bg-gradient-to-r from-blue-500 to-cyan-500",border:"border-blue-500",badge:"bg-blue-500",text:"text-blue-700",label:"Nacional"}:s>=2?{bg:"bg-gradient-to-r from-teal-500 to-emerald-500",border:"border-teal-500",badge:"bg-teal-500",text:"text-teal-700",label:"Regional"}:{bg:"bg-gradient-to-r from-gray-400 to-gray-500",border:"border-gray-400",badge:"bg-gray-400",text:"text-gray-600",label:"Local"}}function $(r){return r==="Senior-M"?"♂":r==="Senior-F"?"♀":"⚡"}function T(r){return r==="Senior-M"?"bg-blue-100 text-blue-700":r==="Senior-F"?"bg-pink-100 text-pink-700":"bg-gray-100 text-gray-700"}function P({torneos:r}){const[s,u]=i.useState(""),[l,j]=i.useState("Todos"),[y,h]=i.useState(!1),[N,c]=i.useState(""),[w,f]=i.useState(!1),[v,b]=i.useState(""),x=i.useMemo(()=>r.filter(a=>{const n=a.torneo.toLowerCase().includes(s.toLowerCase())||a.localidad.toLowerCase().includes(s.toLowerCase())||a.sede.toLowerCase().includes(s.toLowerCase()),t=l==="Todos"||l==="Masculino"&&a.categoria==="Senior-M"||l==="Femenino"&&a.categoria==="Senior-F";return n&&t}),[r,s,l]),p=i.useMemo(()=>{const a={};return x.forEach(n=>{const t=A(n.fechaInicio);if(!t)return;const o=`${t.getFullYear()}-${String(t.getMonth()).padStart(2,"0")}`,d=`${S[t.getMonth()]} ${t.getFullYear()}`;a[o]||(a[o]={label:d,torneos:[]}),a[o].torneos.push(n)}),Object.entries(a).sort(([n],[t])=>n.localeCompare(t))},[x]),C=async(a,n)=>{b(n),h(!0),f(!0),c("");try{const o=await(await fetch(`/calendario/clasificacion/${a}`)).json();o.success?c(o.html):c("<p>No se pudo cargar la clasificación.</p>")}catch{c("<p>Error al cargar la clasificación.</p>")}finally{f(!1)}},m=()=>{h(!1),c(""),b("")},g=x.length;return e.jsxs(e.Fragment,{children:[e.jsx(M,{title:"Calendario Pruebas Puntuables - Las Canteras Vóley"}),e.jsxs("div",{className:"min-h-screen bg-[#FFF8E8] text-gray-900 font-sans",children:[e.jsx(F,{}),e.jsxs("div",{className:"pt-24 max-w-6xl mx-auto px-4 sm:px-6 pb-12",children:[e.jsxs("div",{className:"mb-8",children:[e.jsx("h1",{className:"text-3xl sm:text-4xl font-extrabold text-[#1CA9C9] mb-2",children:"📅 Calendario de Pruebas Puntuables"}),e.jsx("p",{className:"text-base sm:text-lg text-gray-600",children:"Torneos homologados por la RFEVB válidos para el ranking nacional."})]}),e.jsxs("div",{className:"bg-white rounded-xl shadow-md p-4 sm:p-6 mb-8",children:[e.jsxs("div",{className:"flex flex-col sm:flex-row gap-4",children:[e.jsxs("div",{className:"flex-1",children:[e.jsx("label",{className:"block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2",children:"Buscar torneo"}),e.jsxs("div",{className:"relative",children:[e.jsx("svg",{className:"absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"2",d:"M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"})}),e.jsx("input",{type:"text",placeholder:"Nombre, localidad o sede...",value:s,onChange:a=>u(a.target.value),className:"w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1CA9C9] focus:border-transparent text-sm"})]})]}),e.jsxs("div",{className:"sm:w-56",children:[e.jsx("label",{className:"block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2",children:"Categoría"}),e.jsx("div",{className:"flex rounded-lg border border-gray-300 overflow-hidden",children:["Todos","Masculino","Femenino"].map(a=>e.jsx("button",{onClick:()=>j(a),className:`flex-1 py-2.5 text-xs font-semibold transition-colors duration-200 ${l===a?"bg-[#1CA9C9] text-white":"bg-white text-gray-600 hover:bg-gray-50"}`,children:a==="Masculino"?"♂ Masc":a==="Femenino"?"♀ Fem":"Todos"},a))})]})]}),e.jsxs("div",{className:"mt-3 text-xs text-gray-500",children:[g," torneo",g!==1?"s":""," encontrado",g!==1?"s":""]})]}),p.length===0?e.jsx("div",{className:"bg-white rounded-xl shadow-md p-12 text-center",children:e.jsx("p",{className:"text-gray-500 text-lg",children:"No se encontraron torneos."})}):p.map(([a,n])=>e.jsxs("div",{className:"mb-10",children:[e.jsxs("div",{className:"flex items-center gap-3 mb-4",children:[e.jsx("div",{className:"bg-[#1CA9C9] text-white px-4 py-2 rounded-lg font-bold text-sm sm:text-base shadow-sm",children:n.label}),e.jsx("div",{className:"flex-1 h-px bg-gradient-to-r from-[#1CA9C9]/30 to-transparent"}),e.jsxs("span",{className:"text-xs text-gray-400 font-medium",children:[n.torneos.length," torneo",n.torneos.length!==1?"s":""]})]}),e.jsx("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:n.torneos.map((t,o)=>{const d=L(t.factor),k=t.fechaOrdenacion&&new Date(t.fechaOrdenacion)<new Date;return e.jsxs("div",{className:`bg-white rounded-xl shadow-sm border-l-4 ${d.border} hover:shadow-md transition-all duration-200 overflow-hidden ${k?"opacity-70":""}`,children:[e.jsxs("div",{className:"p-4 pb-3",children:[e.jsxs("div",{className:"flex items-start justify-between gap-2 mb-2",children:[e.jsx("h3",{className:"font-bold text-gray-900 text-sm leading-tight flex-1",children:t.torneo}),e.jsxs("span",{className:`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold text-white ${d.badge} flex-shrink-0`,children:["x",t.factor]})]}),e.jsxs("span",{className:`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${T(t.categoria)}`,children:[$(t.categoria)," ",t.categoria]})]}),e.jsxs("div",{className:"px-4 pb-2 space-y-1.5",children:[e.jsxs("div",{className:"flex items-center gap-2 text-xs text-gray-600",children:[e.jsx("span",{className:"flex-shrink-0",children:"📅"}),e.jsx("span",{className:"font-medium",children:t.fechaInicio===t.fechaFin?t.fechaInicio:`${t.fechaInicio} → ${t.fechaFin}`})]}),e.jsxs("div",{className:"flex items-center gap-2 text-xs text-gray-600",children:[e.jsx("span",{className:"flex-shrink-0",children:"📍"}),e.jsx("span",{children:t.sede&&t.sede!==t.localidad?`${t.sede}, ${t.localidad}`:t.localidad})]}),e.jsxs("div",{className:"flex items-center gap-2 text-xs text-gray-500",children:[e.jsx("span",{className:"flex-shrink-0",children:"🏐"}),e.jsxs("span",{children:[t.federacion," (",t.alias,")"]})]}),t.fechaTopeInscripcion&&e.jsxs("div",{className:"flex items-center gap-2 text-xs text-orange-600",children:[e.jsx("span",{className:"flex-shrink-0",children:"⏰"}),e.jsxs("span",{children:["Inscripción hasta: ",t.fechaTopeInscripcion]})]})]}),e.jsxs("div",{className:"px-4 py-3 bg-gray-50 flex items-center justify-between gap-2",children:[t.coordenadas&&t.coordenadas.startsWith("http")?e.jsx("a",{href:t.coordenadas,target:"_blank",rel:"noopener noreferrer",className:"text-xs text-gray-500 hover:text-[#1CA9C9] transition-colors",children:"📍 Ver mapa"}):e.jsx("span",{}),e.jsx("button",{onClick:()=>C(t.id,t.torneo),className:"px-3 py-1.5 bg-[#1CA9C9] text-white text-xs font-semibold rounded-lg hover:bg-[#168a9c] transition-colors duration-200 shadow-sm",children:"Ver Clasificación"})]})]},`${t.id}-${o}`)})})]},a)),e.jsxs("div",{className:"mt-8 text-sm text-gray-500 text-center",children:["Fuente: ",e.jsx("a",{href:"https://www.rfevb.com",target:"_blank",rel:"noopener noreferrer",className:"text-[#1CA9C9] hover:underline",children:"RFEVB"})]})]})]}),y&&e.jsxs("div",{className:"fixed inset-0 z-50 flex items-center justify-center p-4",children:[e.jsx("div",{className:"absolute inset-0 bg-black bg-opacity-50 transition-opacity",onClick:m}),e.jsxs("div",{className:"relative bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden",children:[e.jsx("div",{className:"px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-[#1CA9C9] to-[#168a9c]",children:e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx("h3",{className:"text-lg sm:text-xl font-bold text-white pr-4 leading-tight",children:v}),e.jsx("button",{onClick:m,className:"text-white hover:text-gray-200 transition-colors flex-shrink-0",children:e.jsx("svg",{className:"w-6 h-6",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"2",d:"M6 18L18 6M6 6l12 12"})})})]})}),e.jsx("div",{className:"p-6 overflow-y-auto max-h-[calc(90vh-120px)]",children:w?e.jsxs("div",{className:"flex items-center justify-center py-12",children:[e.jsx("div",{className:"animate-spin rounded-full h-12 w-12 border-b-2 border-[#1CA9C9]"}),e.jsx("span",{className:"ml-4 text-gray-600",children:"Cargando clasificación..."})]}):e.jsx("div",{className:"clasificacion-content prose max-w-none",dangerouslySetInnerHTML:{__html:N}})}),e.jsx("div",{className:"px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end",children:e.jsx("button",{onClick:m,className:"px-6 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors duration-200",children:"Cerrar"})})]})]}),e.jsx("style",{children:`
                .clasificacion-content table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 1rem 0;
                }
                .clasificacion-content th,
                .clasificacion-content td {
                    padding: 0.75rem;
                    border: 1px solid #e5e7eb;
                    text-align: left;
                }
                .clasificacion-content th {
                    background-color: #f9fafb;
                    font-weight: 600;
                }
                .clasificacion-content tr:hover {
                    background-color: #f3f4f6;
                }
                .clasificacion-content h4 {
                    color: #1CA9C9;
                    font-weight: 700;
                    font-size: 1.1rem;
                    margin-bottom: 0.5rem;
                }
                .clasificacion-content .titulo2 {
                    color: #374151;
                    font-weight: 600;
                    font-size: 0.9rem;
                    margin-bottom: 0.75rem;
                }

                @media (max-width: 767px) {
                    .clasificacion-content table {
                        border: none;
                    }
                    .clasificacion-content thead {
                        display: none;
                    }
                    .clasificacion-content tbody tr {
                        display: flex;
                        flex-wrap: wrap;
                        align-items: center;
                        background: white;
                        border: 1px solid #e5e7eb;
                        border-left: 3px solid #1CA9C9;
                        border-radius: 6px;
                        margin-bottom: 8px;
                        padding: 10px 12px;
                        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
                    }
                    .clasificacion-content td {
                        border: none;
                        padding: 2px 0;
                        font-size: 13px;
                        display: block;
                        width: 100%;
                    }
                    .clasificacion-content td:first-child {
                        font-weight: 700;
                        color: #1CA9C9;
                        font-size: 14px;
                    }
                    .clasificacion-content td:first-child:before {
                        content: "Puesto: ";
                        color: #6b7280;
                        font-weight: 400;
                    }
                    .clasificacion-content td:last-child {
                        color: #1CA9C9;
                        font-weight: 700;
                    }
                    .clasificacion-content td:last-child:before {
                        content: "Puntos: ";
                        color: #6b7280;
                        font-weight: 400;
                    }
                }
            `})]})}export{P as default};
