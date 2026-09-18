CREATE TABLE IF NOT EXISTS daily_visitors (
  day TEXT NOT NULL,
  visitor_id TEXT NOT NULL,
  first_seen INTEGER NOT NULL,
  last_seen INTEGER NOT NULL,
  PRIMARY KEY (day, visitor_id)
);

CREATE INDEX IF NOT EXISTS idx_daily_visitors_active
  ON daily_visitors(day, last_seen);

CREATE TABLE IF NOT EXISTS daily_stats (
  day TEXT PRIMARY KEY,
  unique_visitors INTEGER NOT NULL DEFAULT 0,
  max_online INTEGER NOT NULL DEFAULT 0,
  peak_at INTEGER,
  updated_at INTEGER NOT NULL
);
