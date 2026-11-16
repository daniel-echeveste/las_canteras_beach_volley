<?php

namespace App\Support;

use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schema;

/**
 * Ejecuta las migraciones pendientes automáticamente tras un despliegue
 * (sin SSH). Se llama desde el middleware RunPendingMigrations.
 *
 * - Solo trabaja cuando cambia la lista de archivos de database/migrations,
 *   así que el resto de visitas cuestan un glob + una lectura de caché.
 * - La primera vez marca como aplicadas las migraciones antiguas (anteriores
 *   a `baseline_before`), porque la base de datos de producción se montó a
 *   mano y la tabla `migrations` no las tiene registradas.
 */
class AutoMigrator
{
    private const FINGERPRINT_KEY = 'auto-migrate.fingerprint';
    private const ATTEMPT_KEY = 'auto-migrate.attempt';

    public static function runIfNeeded(): void
    {
        if (! config('deploy.auto_migrate')) {
            return;
        }

        $files = glob(database_path('migrations/*.php')) ?: [];
        sort($files);
        $fingerprint = md5(implode('|', array_map('basename', $files)));

        if (Cache::get(self::FINGERPRINT_KEY) === $fingerprint) {
            return;
        }

        // Un intento cada 10 minutos como mucho si algo falla
        if (! Cache::add(self::ATTEMPT_KEY, true, now()->addMinutes(10))) {
            return;
        }

        Cache::lock('auto-migrate', 120)->get(function () use ($fingerprint) {
            try {
                self::baseline();

                $exit = Artisan::call('migrate', ['--force' => true]);
                $output = trim(Artisan::output());

                if ($exit !== 0) {
                    throw new \RuntimeException("migrate devolvió $exit: $output");
                }

                if ($output !== '' && ! str_contains($output, 'Nothing to migrate')) {
                    Log::info('[auto-migrate] ' . $output);
                }

                Cache::forever(self::FINGERPRINT_KEY, $fingerprint);
                Cache::forget(self::ATTEMPT_KEY);
            } catch (\Throwable $e) {
                report($e);
            }
        });
    }

    /**
     * Registra como ejecutadas las migraciones antiguas cuyas tablas ya
     * existen, para que `migrate` no intente volver a crearlas.
     */
    private static function baseline(): void
    {
        if (! Schema::hasTable('migrations')) {
            Artisan::call('migrate:install');
        }

        // Base de datos vacía (instalación nueva): que migrate lo cree todo.
        if (! Schema::hasTable('users')) {
            return;
        }

        $cutoff = config('deploy.baseline_before');
        $ran = DB::table('migrations')->pluck('migration')->all();

        $legacy = collect(glob(database_path('migrations/*.php')) ?: [])
            ->map(fn ($f) => basename($f, '.php'))
            ->filter(fn ($name) => strcmp($name, $cutoff) < 0 && ! in_array($name, $ran, true))
            ->sort()
            ->values();

        if ($legacy->isEmpty()) {
            return;
        }

        DB::table('migrations')->insert(
            $legacy->map(fn ($name) => ['migration' => $name, 'batch' => 0])->all()
        );

        Log::info('[auto-migrate] Migraciones antiguas marcadas como aplicadas: ' . $legacy->implode(', '));
    }
}
