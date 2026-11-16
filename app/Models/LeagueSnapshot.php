<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LeagueSnapshot extends Model
{
    protected $fillable = ['season', 'category', 'payload', 'synced_at'];

    protected $casts = [
        'payload' => 'array',
        'synced_at' => 'datetime',
    ];

    /**
     * Resumen ligero para la portada: top 4 y próximo partido de cada
     * categoría. Solo lee la base de datos (nunca llama a la API).
     */
    public static function summary(): array
    {
        try {
            $snapshots = static::where('season', config('league.season'))->get();
        } catch (\Throwable $e) {
            return [];
        }

        $today = now(config('league.timezone'))->toDateString();
        $summary = [];

        foreach ($snapshots as $snapshot) {
            $p = $snapshot->payload;

            $next = collect($p['rounds'] ?? [])
                ->flatMap(fn ($r) => collect($r['matches'])->map(fn ($m) => $m + ['round' => $r['number']]))
                ->filter(fn ($m) => ! $m['finished'] && ! $m['canceled'] && $m['date'] && $m['date'] >= $today)
                ->sortBy(fn ($m) => $m['date'] . ' ' . ($m['time'] ?? '99:99'))
                ->first();

            $summary[$snapshot->category] = [
                'label' => $p['label'] ?? $snapshot->category,
                'top' => array_slice($p['standings'] ?? [], 0, 4),
                'next' => $next,
            ];
        }

        return $summary;
    }
}
