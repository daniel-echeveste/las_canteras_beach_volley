-- ---------------------------------------------------------------------------
-- Post: arranque de la temporada 2026/27 y nueva web.
-- Ejecutar UNA vez en phpMyAdmin (pestaña SQL). Si el slug ya existe, no hace nada.
-- ---------------------------------------------------------------------------

INSERT INTO `posts`
  (`title`, `slug`, `post_type`, `content`, `image_path`, `youtube_url`, `is_published`, `has_form`, `tournament_date`, `created_at`, `updated_at`)
SELECT * FROM (SELECT
  '🏐 Arranca la temporada 2026/27… ¡y estrenamos web!' AS `title`,
  'arranca-la-temporada-2026-27-y-estrenamos-web' AS `slug`,
  'noticia' AS `post_type`,
  '<p><strong>La arena vuelve a estar caliente.</strong> El fin de semana del 13 al 15 de noviembre echó a andar la <strong>Liga de 2ª División Nacional de Vóley Playa 2026/27</strong>, y para celebrarlo hemos renovado la web de arriba abajo.</p>
<h2>☀️ Así es la nueva temporada</h2>
<p>Este año la competición crece, con más equipos que la temporada pasada:</p>
<ul>
<li><strong>Masculino:</strong> 10 equipos y 18 jornadas.</li>
<li><strong>Femenino:</strong> 8 equipos y 14 jornadas.</li>
</ul>
<p>Tras el primer fin de semana, <strong>CV Playa Grande</strong> lidera la categoría masculina e <strong>Icoren</strong> manda en la femenina. Queda mucha temporada por delante: partidos en Las Canteras, Alcaravaneras, Corralejo, Tenerife y Lanzarote hasta abril.</p>
<h2>🚀 Una web nueva para seguirlo todo</h2>
<p>Hemos rediseñado todas las secciones para que encuentres lo que buscas más rápido, también desde el móvil:</p>
<ul>
<li><strong>Liga actualizada automáticamente:</strong> calendario, resultados y clasificación oficial se actualizan cada semana con los datos de la Federación Canaria de Voleibol. Se acabó esperar a que alguien los copie a mano.</li>
<li><strong>Filtra por tu equipo:</strong> elige un equipo y verás solo sus partidos, su posición y su racha de resultados.</li>
<li><strong>Próximos partidos y últimos resultados</strong> de un vistazo, con la playa de cada partido enlazada en el mapa.</li>
<li><strong>Ranking nacional</strong> con buscador y el historial de torneos de cada jugador o jugadora.</li>
<li><strong>Calendario de torneos</strong> puntuables en lista o en vista mensual.</li>
<li><strong>Previsión del tiempo</strong> con un indicador que te dice si hoy es buen día para jugar según el viento.</li>
</ul>
<blockquote>Antes de bajar a la playa, mira la previsión; antes del partido, mira la clasificación. 😉</blockquote>
<h2>👉 Échale un ojo</h2>
<p><a href="/liga-autonomica">Ver la liga: calendario, resultados y clasificación</a></p>
<p><a href="/ranking">Consultar el ranking nacional</a></p>
<p><a href="/forecast">¿Hace día de playa? Ver la previsión</a></p>
<p>Si ves algún error o echas algo en falta, escríbenos por <a href="https://www.instagram.com/lascanterasbeachvolley/" target="_blank">Instagram</a>. ¡Nos vemos en la arena! 🏖️</p>' AS `content`,
  NULL AS `image_path`,
  NULL AS `youtube_url`,
  1 AS `is_published`,
  0 AS `has_form`,
  NOW() AS `tournament_date`,
  NOW() AS `created_at`,
  NOW() AS `updated_at`
) AS `t`
WHERE NOT EXISTS (
  SELECT 1 FROM `posts` WHERE `slug` = 'arranca-la-temporada-2026-27-y-estrenamos-web'
);
