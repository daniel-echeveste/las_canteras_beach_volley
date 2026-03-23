import{r as o,j as e,S as j}from"./app-DcOxBrG1.js";import{N as w}from"./Navbar-Dwxn0mjo.js";function v({ranking:p}){const[l,m]=o.useState(""),[b,d]=o.useState(!1),[g,s]=o.useState(""),[f,i]=o.useState(!1),[u,c]=o.useState(""),r=p.filter(t=>t.player.toLowerCase().includes(l.toLowerCase())),x=async(t,n)=>{c(n),d(!0),i(!0),s("");try{const h=await(await fetch(`/ranking/torneos/${t}`)).json();h.success?s(h.html):s("<p>No se pudieron cargar los torneos.</p>")}catch{s("<p>Error al cargar los torneos.</p>")}finally{i(!1)}},a=()=>{d(!1),s(""),c("")};return e.jsxs(e.Fragment,{children:[e.jsx(j,{title:"Ranking Nacional - Las Canteras Vóley"}),e.jsxs("div",{className:"min-h-screen bg-[#FFF8E8] text-gray-900 font-sans",children:[e.jsx(w,{}),e.jsxs("div",{className:"pt-24 max-w-5xl mx-auto px-6 pb-12",children:[e.jsx("h1",{className:"text-4xl font-extrabold text-[#1CA9C9] mb-6",children:"Ranking Nacional Masculino"}),e.jsx("p",{className:"text-lg text-gray-700 mb-8",children:"Clasificación actualizada de la Real Federación Española de Voleibol."}),e.jsx("div",{className:"mb-6",children:e.jsx("input",{type:"text",placeholder:"Buscar por nombre...",value:l,onChange:t=>m(t.target.value),className:"w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1CA9C9] focus:border-transparent"})}),e.jsx("div",{className:"md:hidden space-y-3",children:r.length>0?r.map((t,n)=>e.jsx("div",{className:"bg-white rounded-lg shadow-md p-4 border-l-4 border-[#1CA9C9]",children:e.jsxs("div",{className:"flex items-start justify-between",children:[e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("span",{className:"flex items-center justify-center w-10 h-10 bg-[#1CA9C9] text-white font-bold rounded-full text-sm",children:t.rank}),e.jsxs("div",{children:[e.jsx("p",{className:"font-semibold text-gray-900 text-sm leading-tight",children:t.player}),e.jsxs("p",{className:"text-[#1CA9C9] font-bold text-lg mt-1",children:[t.points," pts"]})]})]}),t.idPersona&&e.jsx("button",{onClick:()=>x(t.idPersona,t.player),className:"px-3 py-2 bg-[#1CA9C9] text-white text-xs font-semibold rounded-lg hover:bg-[#168a9c] transition-colors duration-200 shadow-sm flex-shrink-0",children:"Torneos"})]})},n)):e.jsx("div",{className:"bg-white rounded-lg shadow-md p-6 text-center text-gray-500",children:"No se encontraron resultados."})}),e.jsx("div",{className:"hidden md:block overflow-x-auto shadow-md sm:rounded-lg bg-white",children:e.jsxs("table",{className:"w-full text-sm text-left text-gray-500",children:[e.jsx("thead",{className:"text-xs text-gray-700 uppercase bg-gray-50",children:e.jsxs("tr",{children:[e.jsx("th",{scope:"col",className:"px-6 py-3",children:"Posición"}),e.jsx("th",{scope:"col",className:"px-6 py-3",children:"Apellidos / Nombre"}),e.jsx("th",{scope:"col",className:"px-6 py-3",children:"Puntos"}),e.jsx("th",{scope:"col",className:"px-6 py-3 text-center"})]})}),e.jsx("tbody",{children:r.length>0?r.map((t,n)=>e.jsxs("tr",{className:"bg-white border-b hover:bg-gray-50",children:[e.jsx("td",{className:"px-6 py-4 font-bold text-gray-900 whitespace-nowrap",children:t.rank}),e.jsx("td",{className:"px-6 py-4 font-medium text-gray-900",children:t.player}),e.jsx("td",{className:"px-6 py-4 text-[#1CA9C9] font-bold",children:t.points}),e.jsx("td",{className:"px-6 py-4 text-center",children:t.idPersona&&e.jsx("button",{onClick:()=>x(t.idPersona,t.player),className:"px-4 py-2 bg-[#1CA9C9] text-white text-xs font-semibold rounded-lg hover:bg-[#168a9c] transition-colors duration-200 shadow-sm",children:"Torneos"})})]},n)):e.jsx("tr",{children:e.jsx("td",{colSpan:"4",className:"px-6 py-4 text-center",children:"No se encontraron resultados."})})})]})}),e.jsxs("div",{className:"mt-8 text-sm text-gray-500 text-center",children:["Fuente: ",e.jsx("a",{href:"https://www.rfevb.com/ranking-voley-playa-masculino",target:"_blank",rel:"noopener noreferrer",className:"text-[#1CA9C9] hover:underline",children:"RFEVB"})]})]})]}),b&&e.jsxs("div",{className:"fixed inset-0 z-50 flex items-center justify-center p-4",children:[e.jsx("div",{className:"absolute inset-0 bg-black bg-opacity-50 transition-opacity",onClick:a}),e.jsxs("div",{className:"relative bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden",children:[e.jsx("div",{className:"px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-[#1CA9C9] to-[#168a9c]",children:e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsxs("h3",{className:"text-xl font-bold text-white",children:["Torneos - ",u]}),e.jsx("button",{onClick:a,className:"text-white hover:text-gray-200 transition-colors",children:e.jsx("svg",{className:"w-6 h-6",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"2",d:"M6 18L18 6M6 6l12 12"})})})]})}),e.jsx("div",{className:"p-6 overflow-y-auto max-h-[calc(90vh-120px)]",children:f?e.jsxs("div",{className:"flex items-center justify-center py-12",children:[e.jsx("div",{className:"animate-spin rounded-full h-12 w-12 border-b-2 border-[#1CA9C9]"}),e.jsx("span",{className:"ml-4 text-gray-600",children:"Cargando torneos..."})]}):e.jsx("div",{className:"torneos-content prose max-w-none",dangerouslySetInnerHTML:{__html:g}})}),e.jsx("div",{className:"px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end",children:e.jsx("button",{onClick:a,className:"px-6 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors duration-200",children:"Cerrar"})})]})]}),e.jsx("style",{children:`
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
            `})]})}export{v as default};
