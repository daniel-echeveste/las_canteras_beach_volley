<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\LeagueMatch;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MatchController extends Controller
{
    public function index()
    {
        $matches = LeagueMatch::orderBy('category')
            ->orderBy('jornada')
            ->orderBy('date')
            ->get()
            ->map(function ($match) {
                return [
                    'id' => $match->id,
                    'jornada' => $match->jornada,
                    'fecha' => $match->date ? $match->date->format('d/m/Y') : '',
                    'hora' => $match->time ?? '',
                    'local' => $match->local_team,
                    'visitante' => $match->visitor_team,
                    'cancha' => $match->court ?? '',
                    'resultado' => $match->result ?? '',
                    'category' => $match->category,
                ];
            });

        return Inertia::render('Admin/Matches/Index', [
            'matches' => $matches,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Matches/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'category' => 'required|in:male,female',
            'jornada' => 'required|integer|min:1',
            'date' => 'required|date',
            'time' => 'nullable|string',
            'local_team' => 'required|string|max:255',
            'visitor_team' => 'required|string|max:255',
            'court' => 'nullable|string|max:255',
            'result' => 'nullable|string|max:255',
        ]);

        LeagueMatch::create($validated);

        return redirect()->route('admin.matches.index')->with('success', 'Partido creado correctamente.');
    }

    public function edit(LeagueMatch $match)
    {
        return Inertia::render('Admin/Matches/Edit', [
            'match' => [
                'id' => $match->id,
                'category' => $match->category,
                'jornada' => $match->jornada,
                'date' => $match->date ? $match->date->format('Y-m-d') : '',
                'time' => $match->time ?? '',
                'local_team' => $match->local_team,
                'visitor_team' => $match->visitor_team,
                'court' => $match->court ?? '',
                'result' => $match->result ?? '',
            ]
        ]);
    }

    public function update(Request $request, LeagueMatch $match)
    {
        $validated = $request->validate([
            'category' => 'required|in:male,female',
            'jornada' => 'required|integer|min:1',
            'date' => 'required|date',
            'time' => 'nullable|string',
            'local_team' => 'required|string|max:255',
            'visitor_team' => 'required|string|max:255',
            'court' => 'nullable|string|max:255',
            'result' => 'nullable|string|max:255',
        ]);

        $match->update($validated);

        return redirect()->route('admin.matches.index')->with('success', 'Partido actualizado correctamente.');
    }

    public function destroy(LeagueMatch $match)
    {
        $match->delete();
        return redirect()->route('admin.matches.index')->with('success', 'Partido eliminado correctamente.');
    }
}
