SELECT
  day,
  unique_visitors,
  max_online,
  CASE
    WHEN peak_at IS NULL THEN NULL
    ELSE datetime(peak_at / 1000, 'unixepoch') || ' UTC'
  END AS peak_utc
FROM daily_stats
WHERE day = strftime('%Y-%m-%d', 'now');

SELECT
  COUNT(*) AS online_now_estimate
FROM daily_visitors
WHERE day = strftime('%Y-%m-%d', 'now')
  AND last_seen >= (CAST(strftime('%s', 'now') AS INTEGER) * 1000 - 150000);
