-- ---------------------------------------------------------------------------
-- Liga 2ª División (Leverade): tabla de datos sincronizados.
-- Ejecutar UNA vez en phpMyAdmin (pestaña SQL) sobre la base de datos de la web.
-- Equivale a la migración 2026_11_16_000001_create_league_snapshots_table.
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `league_snapshots` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `season` VARCHAR(16) NOT NULL,
  `category` VARCHAR(16) NOT NULL,
  `payload` LONGTEXT NOT NULL,
  `synced_at` TIMESTAMP NULL DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT NULL,
  `updated_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `league_snapshots_season_category_unique` (`season`, `category`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Marca la migración como ejecutada para que un futuro `php artisan migrate`
-- no intente crear la tabla otra vez.
INSERT INTO `migrations` (`migration`, `batch`)
SELECT `m`, `b` FROM (
  SELECT '2026_11_16_000001_create_league_snapshots_table' AS `m`, COALESCE(MAX(`batch`), 0) + 1 AS `b`
  FROM `migrations`
) AS `t`
WHERE NOT EXISTS (
  SELECT 1 FROM `migrations` WHERE `migration` = '2026_11_16_000001_create_league_snapshots_table'
);
