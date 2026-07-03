import{r as s,j as e,S as C}from"./app-CtYAKjJz.js";import{N as v}from"./Navbar-BT35z8ab.js";function M({rankingMasculino:g,rankingFemenino:b}){const[i,u]=s.useState(""),[n,d]=s.useState("masculino"),[f,c]=s.useState(!1),[y,o]=s.useState(""),[j,x]=s.useState(!1),[w,h]=s.useState(""),a=(n==="masculino"?g:b).filter(t=>t.player.toLowerCase().includes(i.toLowerCase())),p=async(t,r)=>{h(r),c(!0),x(!0),o("");try{const m=await(await fetch(`/ranking/torneos/${t}`)).json();m.success?o(m.html):o("<p>No se pudieron cargar los torneos.</p>")}catch{o("<p>Error al cargar los torneos.</p>")}finally{x(!1)}},l=()=>{c(!1),o(""),h("")};return e.jsxs(e.Fragment,{children:[e.jsx(C,{title:"Ranking Nacional - Las Canteras Vóley"}),e.jsxs("div",{className:"min-h-screen bg-[#FFF8E8] text-gray-900 font-sans",children:[e.jsx(v,{}),e.jsxs("div",{className:"pt-24 max-w-5xl mx-auto px-6 pb-12",children:[e.jsxs("h1",{className:"text-4xl font-extrabold text-[#1CA9C9] mb-6",children:["Ranking Nacional ",n==="masculino"?"Masculino":"Femenino"]}),e.jsx("p",{className:"text-lg text-gray-700 mb-8",children:"Clasificación actualizada de la Real Federación Española de Voleibol."}),e.jsxs("div",{className:"mb-6 inline-flex rounded-lg border border-gray-300 bg-white p-1 shadow-sm",children:[e.jsx("button",{onClick:()=>d("masculino"),className:`px-5 py-2 text-sm font-semibold rounded-md transition-colors duration-200 ${n==="masculino"?"bg-[#1CA9C9] text-white shadow":"text-gray-600 hover:text-gray-900"}`,children:"Masculino"}),e.jsx("button",{onClick:()=>d("femenino"),className:`px-5 py-2 text-sm font-semibold rounded-md transition-colors duration-200 ${n==="femenino"?"bg-[#1CA9C9] text-white shadow":"text-gray-600 hover:text-gray-900"}`,children:"Femenino"})]}),e.jsx("div",{className:"mb-6",children:e.jsx("input",{type:"text",placeholder:"Buscar por nombre...",value:i,onChange:t=>u(t.target.value),className:"w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1CA9C9] focus:border-transparent"})}),e.jsx("div",{className:"md:hidden space-y-3",children:a.length>0?a.map((t,r)=>e.jsx("div",{className:"bg-white rounded-lg shadow-md p-4 border-l-4 border-[#1CA9C9]",children:e.jsxs("div",{className:"flex items-start justify-between",children:[e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("span",{className:"flex items-center justify-center w-10 h-10 bg-[#1CA9C9] text-white font-bold rounded-full text-sm",children:t.rank}),e.jsxs("div",{children:[e.jsx("p",{className:"font-semibold text-gray-900 text-sm leading-tight",children:t.player}),e.jsxs("p",{className:"text-[#1CA9C9] font-bold text-lg mt-1",children:[t.points," pts"]})]})]}),t.idPersona&&e.jsx("button",{onClick:()=>p(t.idPersona,t.player),className:"px-3 py-2 bg-[#1CA9C9] text-white text-xs font-semibold rounded-lg hover:bg-[#168a9c] transition-colors duration-200 shadow-sm flex-shrink-0",children:"Torneos"})]})},r)):e.jsx("div",{className:"bg-white rounded-lg shadow-md p-6 text-center text-gray-500",children:"No se encontraron resultados."})}),e.jsx("div",{className:"hidden md:block overflow-x-auto shadow-md sm:rounded-lg bg-white",children:e.jsxs("table",{className:"w-full text-sm text-left text-gray-500",children:[e.jsx("thead",{className:"text-xs text-gray-700 uppercase bg-gray-50",children:e.jsxs("tr",{children:[e.jsx("th",{scope:"col",className:"px-6 py-3",children:"Posición"}),e.jsx("th",{scope:"col",className:"px-6 py-3",children:"Apellidos / Nombre"}),e.jsx("th",{scope:"col",className:"px-6 py-3",children:"Puntos"}),e.jsx("th",{scope:"col",className:"px-6 py-3 text-center"})]})}),e.jsx("tbody",{children:a.length>0?a.map((t,r)=>e.jsxs("tr",{className:"bg-white border-b hover:bg-gray-50",children:[e.jsx("td",{className:"px-6 py-4 font-bold text-gray-900 whitespace-nowrap",children:t.rank}),e.jsx("td",{className:"px-6 py-4 font-medium text-gray-900",children:t.player}),e.jsx("td",{className:"px-6 py-4 text-[#1CA9C9] font-bold",children:t.points}),e.jsx("td",{className:"px-6 py-4 text-center",children:t.idPersona&&e.jsx("button",{onClick:()=>p(t.idPersona,t.player),className:"px-4 py-2 bg-[#1CA9C9] text-white text-xs font-semibold rounded-lg hover:bg-[#168a9c] transition-colors duration-200 shadow-sm",children:"Torneos"})})]},r)):e.jsx("tr",{children:e.jsx("td",{colSpan:"4",className:"px-6 py-4 text-center",children:"No se encontraron resultados."})})})]})}),e.jsxs("div",{className:"mt-8 text-sm text-gray-500 text-center",children:["Fuente: ",e.jsx("a",{href:`https://www.rfevb.com/ranking-voley-playa-${n}`,target:"_blank",rel:"noopener noreferrer",className:"text-[#1CA9C9] hover:underline",children:"RFEVB"})]})]})]}),f&&e.jsxs("div",{className:"fixed inset-0 z-50 flex items-center justify-center p-4",children:[e.jsx("div",{className:"absolute inset-0 bg-black bg-opacity-50 transition-opacity",onClick:l}),e.jsxs("div",{className:"relative bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden",children:[e.jsx("div",{className:"px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-[#1CA9C9] to-[#168a9c]",children:e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsxs("h3",{className:"text-xl font-bold text-white",children:["Torneos - ",w]}),e.jsx("button",{onClick:l,className:"text-white hover:text-gray-200 transition-colors",children:e.jsx("svg",{className:"w-6 h-6",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"2",d:"M6 18L18 6M6 6l12 12"})})})]})}),e.jsx("div",{className:"p-6 overflow-y-auto max-h-[calc(90vh-120px)]",children:j?e.jsxs("div",{className:"flex items-center justify-center py-12",children:[e.jsx("div",{className:"animate-spin rounded-full h-12 w-12 border-b-2 border-[#1CA9C9]"}),e.jsx("span",{className:"ml-4 text-gray-600",children:"Cargando torneos..."})]}):e.jsx("div",{className:"torneos-content prose max-w-none",dangerouslySetInnerHTML:{__html:y}})}),e.jsx("div",{className:"px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end",children:e.jsx("button",{onClick:l,className:"px-6 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors duration-200",children:"Cerrar"})})]})]}),e.jsx("style",{children:`
                /* Desktop styles */
                .torneos-content table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 1rem 0;
                }
                .torneos-content th,
                .torneos-content td {
                    padding: 0.75rem;
                    border: 1px solid #e5e7eb;
                    text-align: left;
                }
                .torneos-content th {
                    background-color: #f9fafb;
                    font-weight: 600;
                }
                .torneos-content tr:hover {
                    background-color: #f3f4f6;
                }
                .torneos-content a {
                    color: #1CA9C9;
                    text-decoration: underline;
                }

                /* Mobile card styles for tournament table */
                @media (max-width: 767px) {
                    .torneos-content table {
                        border: none;
                    }
                    .torneos-content thead {
                        display: none;
                    }
                    .torneos-content tbody tr {
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
                    .torneos-content td {
                        border: none;
                        padding: 0;
                        font-size: 13px;
                    }
                    /* Hide all columns by default */
                    .torneos-content td {
                        display: none;
                    }
                    /* Show 1st column (tournament name) - full width as title */
                    .torneos-content td:nth-child(3) {
                        display: block;
                        width: 100%;
                        font-weight: 600;
                        font-size: 16px;
                        color: #1f2937;
                        line-height: 1.3;
                    }
                    /* Show 2nd column (date) - inline */
                    .torneos-content td:nth-child(2) {
                        display: inline-block;
                        color: #6b7280;
                        font-size: 12px;
                        margin-right: 12px;
                    }
                    .torneos-content td:nth-child(2):before {
                        content: "📅 ";
                    }
                    /* Show last column (points) - inline, highlighted */
                    .torneos-content td:last-child {
                        display: inline-block;
                        color: #1CA9C9;
                        font-weight: 700;
                        font-size: 13px;
                    }
                    .torneos-content td:nth-child(6) {
                        display: inline-block;
                        color: #1CA9C9;
                        font-weight: 700;
                        font-size: 13px;
                        margin-right: 12px;
                       
                    }
                     .torneos-content td:nth-child(6):before {
                        content: "Position: ";
                       
                    }

                    .torneos-content td:last-child:before {
                        content: "Pts: ";
                    }
                }
            `})]})}export{M as default};
