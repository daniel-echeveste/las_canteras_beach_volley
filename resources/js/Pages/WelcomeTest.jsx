import React from 'react';
import { Head } from '@inertiajs/react';

export default function WelcomeTest({ appName, version }) {
    return (
        <>
            <Head title="Página de Prueba" />
            <div style={{ padding: '20px', textAlign: 'center' }}>
                <h1>{appName} v{version}</h1>
                <p>¡Componente React cargado con éxito desde Laravel!</p>
                <button 
                    onClick={() => alert('¡Hiciste clic!')} 
                    style={{ padding: '10px 20px', backgroundColor: '#3490dc', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                >
                    Probar Interacción
                </button>
            </div>
        </>
    );
}