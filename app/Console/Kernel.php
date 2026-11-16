<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * Define the application's command schedule.
     */
    protected function schedule(Schedule $schedule): void
    {
        // Liga 2ª División: una sola sincronización semanal con la API de
        // Leverade, los lunes a las 02:00 (hora canaria).
        $schedule->command('league:sync')
            ->weeklyOn(1, '02:00')
            ->timezone(config('league.timezone'))
            ->withoutOverlapping();
    }

    /**
     * Register the commands for the application.
     */
    protected function commands(): void
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}
