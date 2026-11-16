<?php

namespace App\Services;

use App\Models\LeagueSnapshot;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Http;
use RuntimeException;

/**
 * Descarga calendario, resultados y clasificación de la liga desde la API
 * pública de Leverade (la que usa fcanvb.es) y lo guarda normalizado en
 * la tabla league_snapshots.
 */
class LeveradeLeagueService
{
    /**
     * Sincroniza todas las categorías configuradas.
     *
     * @return array<string, array{ok: bool, message: string}>
     */
    public function syncAll(): array
    {
        $report = [];

        foreach (array_keys(config('league.categories')) as $category) {
            try {
                $payload = $this->sync($category);
                $report[$category] = [
                    'ok' => true,
                    'message' => sprintf(
                        '%d partidos, %d equipos',
                        collect($payload['rounds'])->sum(fn ($r) => count($r['matches'])),
                        count($payload['standings'])
                    ),
                ];
            } catch (\Throwable $e) {
                report($e);
                $report[$category] = ['ok' => false, 'message' => $e->getMessage()];
            }
        }

        return $report;
    }

    public function sync(string $category): array
    {
        $config = config("league.categories.$category");

        if (! $config) {
            throw new RuntimeException("Categoría desconocida: $category");
        }

        $payload = $this->build($category, $config);

        LeagueSnapshot::updateOrCreate(
            ['season' => config('league.season'), 'category' => $category],
            ['payload' => $payload, 'synced_at' => now()]
        );

        return $payload;
    }

    private function build(string $category, array $config): array
    {
        $groupId = $config['group_id'];

        [$matches, $included] = $this->fetchMatches($groupId);
        $rounds = $this->fetchRounds($groupId);
        $standingsRows = $this->get("/groups/$groupId/standings")['meta']['standingsrows'] ?? [];

        // Índices de entidades incluidas
        $teams = [];
        $facilities = [];
        $results = [];

        foreach ($included as $item) {
            $attrs = $item['attributes'] ?? [];

            switch ($item['type']) {
                case 'team':
                    $teams[$item['id']] = [
                        'id' => (int) $item['id'],
                        'name' => trim($attrs['name'] ?? ''),
                        'avatar' => $this->avatar(Arr::get($item, 'meta.avatar.large')),
                    ];
                    break;

                case 'facility':
                    $facilities[$item['id']] = [
                        'name' => $attrs['name'] ?? null,
                        'city' => $attrs['city'] ?? null,
                        'lat' => $attrs['latitude'] ?? null,
                        'lng' => $attrs['longitude'] ?? null,
                    ];
                    break;

                case 'result':
                    $matchId = Arr::get($item, 'relationships.match.data.id');
                    $teamId = Arr::get($item, 'relationships.team.data.id');
                    if ($matchId && $teamId) {
                        $results[$matchId][$teamId] = $attrs['value'];
                    }
                    break;
            }
        }

        // Partidos agrupados por jornada
        $byRound = [];

        foreach ($matches as $match) {
            $a = $match['attributes'];
            $homeId = Arr::get($match, 'meta.home_team');
            $awayId = Arr::get($match, 'meta.away_team');
            $roundId = Arr::get($match, 'relationships.round.data.id');
            $facilityId = Arr::get($match, 'relationships.facility.data.id');

            $homeSets = $results[$match['id']][$homeId] ?? null;
            $awaySets = $results[$match['id']][$awayId] ?? null;

            [$date, $time] = $this->splitDate($a['date'] ?? null);

            $byRound[$roundId][] = [
                'id' => (int) $match['id'],
                'date' => $date,
                'time' => $time,
                'home' => $teams[$homeId] ?? null,
                'away' => $teams[$awayId] ?? null,
                'homeSets' => $homeSets !== null ? (int) $homeSets : null,
                'awaySets' => $awaySets !== null ? (int) $awaySets : null,
                'finished' => (bool) ($a['finished'] ?? false),
                'postponed' => (bool) ($a['postponed'] ?? false),
                'canceled' => (bool) ($a['canceled'] ?? false),
                'rest' => (bool) ($a['rest'] ?? false),
                'facility' => $facilities[$facilityId] ?? null,
            ];
        }

        $roundList = collect($rounds)
            ->sortBy('order')
            ->map(function ($round) use ($byRound) {
                $matches = collect($byRound[$round['id']] ?? [])
                    // Partidos sin fecha al final
                    ->sortBy(fn ($m) => ($m['date'] ?? '9999-99-99') . ' ' . ($m['time'] ?? '99:99'))
                    ->values()
                    ->all();

                return [
                    'number' => (int) $round['order'],
                    'name' => $round['name'],
                    'matches' => $matches,
                ];
            })
            ->values()
            ->all();

        $standings = collect($standingsRows)
            ->map(function ($row) use ($teams) {
                $s = collect($row['standingsstats'] ?? [])->pluck('value', 'type');

                return [
                    'position' => (int) $row['position'],
                    'teamId' => (int) $row['id'],
                    'name' => trim($row['name']),
                    'avatar' => $teams[$row['id']]['avatar'] ?? null,
                    'points' => (int) $s->get('score', 0),
                    'played' => (int) $s->get('played_matches', 0),
                    'won' => (int) $s->get('won_matches', 0),
                    'lost' => (int) $s->get('lost_matches', 0),
                    'won3' => (int) $s->get('3_points_won_matches', 0),
                    'won2' => (int) $s->get('2_points_won_matches', 0),
                    'lost1' => (int) $s->get('1_point_lost_matches', 0),
                    'lost0' => (int) $s->get('0_point_lost_matches', 0),
                    'setsWon' => (int) $s->get('value', 0),
                    'setsLost' => (int) $s->get('value_against', 0),
                    'setsDiff' => (int) $s->get('value_difference', 0),
                    'pointsWon' => (int) $s->get('periods_value', 0),
                    'pointsLost' => (int) $s->get('periods_value_against', 0),
                    'pointsDiff' => (int) $s->get('periods_value_difference', 0),
                ];
            })
            ->sortBy('position')
            ->values()
            ->all();

        $base = config('league.federation_url') . '/' . $config['tournament_id'];

        return [
            'category' => $category,
            'label' => $config['label'],
            'season' => config('league.season'),
            'links' => [
                'calendar' => "$base/calendar/{$config['group_id']}/all",
                'standings' => "$base/ranking/{$config['group_id']}",
            ],
            'teams' => array_values($teams),
            'rounds' => $roundList,
            'standings' => $standings,
        ];
    }

    /**
     * Recorre todas las páginas de partidos del grupo.
     */
    private function fetchMatches(int $groupId): array
    {
        $matches = [];
        $included = [];
        $page = 1;

        do {
            $json = $this->get('/matches', [
                'filter' => "round.group.id:$groupId",
                'include' => 'teams,facility,results',
                'sort' => 'date',
                'page[size]' => 100,
                'page[number]' => $page,
            ]);

            $matches = array_merge($matches, $json['data'] ?? []);
            $included = array_merge($included, $json['included'] ?? []);
            $hasNext = ! empty($json['links']['next']);
            $page++;
        } while ($hasNext && $page <= 10);

        return [$matches, $included];
    }

    private function fetchRounds(int $groupId): array
    {
        $json = $this->get('/rounds', [
            'filter' => "group.id:$groupId",
            'page[size]' => 100,
        ]);

        return collect($json['data'] ?? [])
            ->map(fn ($r) => [
                'id' => $r['id'],
                'name' => $r['attributes']['name'] ?? '',
                'order' => $r['attributes']['order'] ?? 0,
            ])
            ->all();
    }

    private function get(string $path, array $query = []): array
    {
        $response = Http::acceptJson()
            ->withHeaders(['User-Agent' => 'LasCanterasBeachVolley/1.0 (weekly sync)'])
            ->timeout(30)
            ->retry(3, 2000)
            ->get(config('league.api_url') . $path, $query);

        $response->throw();

        $json = $response->json();

        if (! is_array($json)) {
            throw new RuntimeException("Respuesta no válida de Leverade en $path");
        }

        return $json;
    }

    /**
     * "2026-11-14 10:00:00" -> ["2026-11-14", "10:00"]. Las 00:00 se tratan
     * como hora sin definir.
     */
    private function splitDate(?string $value): array
    {
        if (! $value) {
            return [null, null];
        }

        $date = substr($value, 0, 10);
        $time = substr($value, 11, 5);

        return [$date, ($time && $time !== '00:00') ? $time : null];
    }

    private function avatar(?string $url): ?string
    {
        return $url ? str_replace('.500x500.', '.200x200.', $url) : null;
    }
}
