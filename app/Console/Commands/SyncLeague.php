<?php

namespace App\Console\Commands;

use App\Services\LeveradeLeagueService;
use Illuminate\Console\Command;

class SyncLeague extends Command
{
    protected $signature = 'league:sync {category? : male o female (por defecto, ambas)}';

    protected $description = 'Descarga calendario, resultados y clasificación de la liga desde Leverade (FCANVB)';

    public function handle(LeveradeLeagueService $service): int
    {
        $category = $this->argument('category');

        $report = $category
            ? $this->single($service, $category)
            : $service->syncAll();

        $failed = false;

        foreach ($report as $cat => $row) {
            if ($row['ok']) {
                $this->info("✔ $cat: {$row['message']}");
            } else {
                $failed = true;
                $this->error("✘ $cat: {$row['message']}");
            }
        }

        return $failed ? self::FAILURE : self::SUCCESS;
    }

    private function single(LeveradeLeagueService $service, string $category): array
    {
        try {
            $payload = $service->sync($category);

            return [$category => [
                'ok' => true,
                'message' => count($payload['standings']) . ' equipos',
            ]];
        } catch (\Throwable $e) {
            return [$category => ['ok' => false, 'message' => $e->getMessage()]];
        }
    }
}
