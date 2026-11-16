<?php

namespace App\Http\Controllers;

use App\Models\LeagueSnapshot;
use App\Services\LeveradeLeagueService;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;

class AutonomicLeagueController extends Controller
{
    public function index(LeveradeLeagueService $service)
    {
        $season = config('league.season');

        // Si falta la tabla (no se ejecutó database/league_snapshots.sql) se
        // muestra la página vacía en lugar de un error 500.
        if (! Schema::hasTable('league_snapshots')) {
            report(new \RuntimeException('Falta la tabla league_snapshots: ejecuta database/league_snapshots.sql'));

            return Inertia::render('AutonomicLeague', ['season' => $season, 'leagues' => [], 'syncedAt' => null]);
        }

        $snapshots = LeagueSnapshot::where('season', $season)->get()->keyBy('category');

        // Respaldo por si el servidor no tiene cron: si no hay datos o son
        // anteriores al último lunes a las 02:00 (hora canaria), se sincroniza
        // en esta visita. Como mucho una vez por semana y con bloqueo para no
        // lanzar varias peticiones a la vez.
        // Cache::add solo devuelve true si no se ha intentado en la última hora,
        // así si Leverade falla no se reintenta en cada visita.
        if ($this->isStale($snapshots) && Cache::add('league-sync-attempt', true, now()->addHour())) {
            Cache::lock('league-sync', 120)->get(function () use ($service) {
                $service->syncAll();
            });

            $snapshots = LeagueSnapshot::where('season', $season)->get()->keyBy('category');
        }

        $leagues = [];
        $syncedAt = null;

        foreach (array_keys(config('league.categories')) as $category) {
            $snapshot = $snapshots->get($category);
            $leagues[$category] = $snapshot?->payload;

            if ($snapshot?->synced_at && (! $syncedAt || $snapshot->synced_at->gt($syncedAt))) {
                $syncedAt = $snapshot->synced_at;
            }
        }

        return Inertia::render('AutonomicLeague', [
            'season' => $season,
            'leagues' => $leagues,
            'syncedAt' => $syncedAt?->toIso8601String(),
        ]);
    }

    private function isStale($snapshots): bool
    {
        if ($snapshots->count() < count(config('league.categories'))) {
            return true;
        }

        $tz = config('league.timezone');
        $lastMonday = now($tz)->startOfWeek(Carbon::MONDAY)->setTime(2, 0);

        if ($lastMonday->isFuture()) {
            $lastMonday->subWeek();
        }

        $oldest = $snapshots->min(fn ($s) => $s->synced_at?->timestamp ?? 0);

        return $oldest < $lastMonday->timestamp;
    }
}
