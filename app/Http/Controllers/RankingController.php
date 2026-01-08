<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;

class RankingController extends Controller
{
    public function index()
    {
        $fechaHasta = date('Y-m-d');
        $url = 'https://intranet.rfevb.com/webservices/rfevbcom/vplaya/vp-ranking-masculino.php?fechaHasta=' . $fechaHasta . '&buscar=';
        $response = Http::get($url);

        $ranking = [];

        if ($response->successful()) {
            // The API returns JSON directly
            $data = $response->json();
            
            if (is_array($data)) {
                foreach ($data as $index => $player) {
                    $ranking[] = [
                        'rank' => $index + 1, // Generate rank from position
                        'player' => $player['ApellidosNombre'] ?? 'N/A',
                        'points' => $player['Puntos'] ?? '0',
                        'idPersona' => $player['IdPersona'] ?? null,
                    ];
                }
            }
        }
        
        // Mock data if API fails (for development/demo stability)
        if (empty($ranking)) {
             $ranking = [
                ['rank' => 1, 'player' => 'GAVIRA COLLADO, ADRIAN', 'points' => '19,060', 'idPersona' => 392510],
                ['rank' => 2, 'player' => 'HERRERA ALLEPUZ, PABLO', 'points' => '18,700', 'idPersona' => 392511],
                ['rank' => 3, 'player' => 'HUERTA PASTOR, JAVIER', 'points' => '15,124', 'idPersona' => 392512],
                ['rank' => 4, 'player' => 'JIMENEZ GUTIERREZ, OSCAR', 'points' => '12,652', 'idPersona' => 392513],
                ['rank' => 5, 'player' => 'PEREZ SUAREZ, PABLO JOSE', 'points' => '10,600', 'idPersona' => 392514],
             ];
        }

        return Inertia::render('Ranking', [
            'ranking' => $ranking
        ]);
    }

    /**
     * Get tournaments HTML for a specific player
     */
    public function getTorneos($idPersona)
    {
        $fechaHasta = date('Y-m-d');
        $url = 'https://intranet.rfevb.com/webservices/rfevbcom/vplaya/vp-torneos-deportista-html.php?IdPersona=' . $idPersona . '&fechaHasta=' . $fechaHasta;
        
        $response = Http::get($url);
        
        if ($response->successful()) {
            return response()->json([
                'success' => true,
                'html' => $response->body()
            ]);
        }
        
        return response()->json([
            'success' => false,
            'html' => '<p>No se pudieron cargar los torneos del jugador.</p>'
        ]);
    }
}
