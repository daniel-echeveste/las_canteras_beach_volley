<?php

return [

    /*
    | Ejecutar `php artisan migrate` automáticamente en la primera visita
    | después de subir archivos de migración nuevos (para hosting sin SSH).
    | Se puede desactivar con AUTO_MIGRATE=false en el .env.
    */
    'auto_migrate' => env('AUTO_MIGRATE', true),

    /*
    | Las migraciones con nombre anterior a este prefijo se consideran ya
    | aplicadas en bases de datos existentes (se montaron a mano con SQL).
    | Las nuevas migraciones deben tener fecha posterior.
    */
    'baseline_before' => '2026_11_16',

];
