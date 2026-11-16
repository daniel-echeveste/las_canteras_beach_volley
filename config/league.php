<?php

/*
|--------------------------------------------------------------------------
| Liga 2ª División Nacional de Vóley Playa (FCANVB / Leverade)
|--------------------------------------------------------------------------
|
| Los datos se descargan de la API pública de Leverade una vez por semana
| (lunes 02:00, hora canaria) con `php artisan league:sync` y se guardan en
| la tabla `league_snapshots`. La web solo lee de la base de datos.
|
| Para una temporada nueva basta con cambiar `season` y los IDs de torneo
| y grupo (se ven en la URL de fcanvb.es: /tournament/{torneo}/calendar/{grupo}).
|
*/

return [

    'season' => '2026/27',

    'api_url' => 'https://api.leverade.com',

    'timezone' => 'Atlantic/Canary',

    'categories' => [
        'male' => [
            'label' => 'Masculino',
            'tournament_id' => 1342612,
            'group_id' => 3720093,
        ],
        'female' => [
            'label' => 'Femenino',
            'tournament_id' => 1342610,
            'group_id' => 3720130,
        ],
    ],

    'federation_url' => 'https://fcanvb.es/es/tournament',

];
