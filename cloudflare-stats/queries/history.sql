SELECT
  day,
  unique_visitors,
  max_online,
  CASE
    WHEN peak_at IS NULL THEN NULL
    ELSE datetime(peak_at / 1000, 'unixepoch') || ' UTC'
  END AS peak_utc
FROM daily_stats
ORDER BY day DESC
LIMIT 60;
