<?php

namespace App\Http\Controllers;

use App\Models\LeagueMatch;
use Inertia\Inertia;

class AutonomicLeagueController extends Controller
{
    public function index()
    {
        $maleSchedule = LeagueMatch::where('category', 'male')
            ->orderBy('jornada')
            ->orderBy('date')
            ->get()
            ->map(function ($match) {
                return [
                    'jornada' => $match->jornada,
                    'fecha' => $match->date ? $match->date->format('d/m/Y') : '',
                    'hora' => $match->time ?? '',
                    'local' => $match->local_team,
                    'visitante' => $match->visitor_team,
                    'cancha' => $match->court ?? '',
                    'resultado' => $match->result ?? '',
                ];
            });

        $femaleSchedule = LeagueMatch::where('category', 'female')
            ->orderBy('jornada')
            ->orderBy('date')
            ->get()
            ->map(function ($match) {
                return [
                    'jornada' => $match->jornada,
                    'fecha' => $match->date ? $match->date->format('d/m/Y') : '',
                    'hora' => $match->time ?? '',
                    'local' => $match->local_team,
                    'visitante' => $match->visitor_team,
                    'cancha' => $match->court ?? '',
                    'resultado' => $match->result ?? '',
                ];
            });

        return Inertia::render('AutonomicLeague', [
            'maleSchedule' => $maleSchedule,
            'femaleSchedule' => $femaleSchedule,
        ]);
    }
}
