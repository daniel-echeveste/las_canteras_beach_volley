<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;

class CalendarController extends Controller
{
    public function index()
    {
        $fechaInicio = date('Y-m-d');
        $fechaFin = date('Y-m-d', strtotime('+4 months'));
        $url = 'https://intranet.rfevb.com/webservices/rfevbcom/vplaya/vp-TorneosHomologados.php?FechaInicio=' . $fechaInicio . '&FechaFin=' . $fechaFin;
        
        $response = Http::get($url);

        $torneos = [];

        if ($response->successful()) {
            $data = $response->json();
            
            if (is_array($data)) {
                foreach ($data as $torneo) {
                    $torneos[] = [
                        'id' => $torneo['IdVPTorneo'] ?? null,
                        'torneo' => $torneo['Torneo'] ?? 'N/A',
                        'categoria' => $torneo['Categoria'] ?? 'N/A',
                        'federacion' => $torneo['Federacion'] ?? 'N/A',
                        'alias' => $torneo['Alias'] ?? '',
                        'factor' => $torneo['Factor'] ?? '0',
                        'provincia' => $torneo['Provincia'] ?? '',
                        'localidad' => $torneo['Localidad'] ?? '',
                        'sede' => $torneo['Sede'] ?? '',
                        'fechaInicio' => $torneo['FechaInicio'] ?? '',
                        'fechaFin' => $torneo['FechaFin'] ?? '',
                        'fechaOrdenacion' => $torneo['FechaOrdenacion'] ?? '',
                        'fechaTopeInscripcion' => $torneo['FechaTopeInscripcion'] ?? '',
                        'coordenadas' => $torneo['CoordenadasMapa'] ?? '',
                        'url' => $torneo['Url'] ?? '',
                    ];
                }
            }
        }

        return Inertia::render('Calendar', [
            'torneos' => $torneos
        ]);
    }

    /**
     * Get classification HTML for a specific tournament
     */
    public function getClasificacion($idTorneo)
    {
        $url = 'https://intranet.rfevb.com/webservices/rfevbcom/vplaya/vp-torneo-clasificacion-html.php?IdTorneo=' . $idTorneo;
        
        $response = Http::get($url);
        
        if ($response->successful()) {
            return response()->json([
                'success' => true,
                'html' => $response->body()
            ]);
        }
        
        return response()->json([
            'success' => false,
            'html' => '<p>No se pudo cargar la clasificación del torneo.</p>'
        ]);
    }
}
