-- =========================================
-- SQL FOR PRODUCTION - POSTPONED FEATURE
-- =========================================
-- STEP 1: Add the 'postponed' column to matches table
ALTER TABLE matches
ADD COLUMN postponed TINYINT(1) DEFAULT 0
AFTER result;
-- STEP 2: Mark past matches without results as postponed
-- (Excludes matches where either team is DESCANSA)
UPDATE matches
SET postponed = 1
WHERE date < CURDATE()
    AND (
        result IS NULL
        OR result = ''
    )
    AND local_team != 'DESCANSA'
    AND visitor_team != 'DESCANSA';
-- To verify which matches were marked as postponed:
-- SELECT * FROM matches WHERE postponed = 1;