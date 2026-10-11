import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

const mode = process.argv[2] === 'history' ? 'history' : 'today';
const db = 'odium-web-stats';

const todaySql = `
SELECT
  strftime('%Y-%m-%d', 'now') AS day,
  COALESCE((
    SELECT unique_visitors
    FROM daily_stats
    WHERE day = strftime('%Y-%m-%d', 'now')
  ), 0) AS unique_visitors,
  (
    SELECT COUNT(*)
    FROM daily_visitors
    WHERE day = strftime('%Y-%m-%d', 'now')
      AND last_seen >= (
        CAST(strftime('%s', 'now') AS INTEGER) * 1000 - 150000
      )
  ) AS online_now_estimate,
  COALESCE((
    SELECT max_online
    FROM daily_stats
    WHERE day = strftime('%Y-%m-%d', 'now')
  ), 0) AS max_online,
  COALESCE((
    SELECT CASE
      WHEN peak_at IS NULL THEN '-'
      ELSE datetime(peak_at / 1000, 'unixepoch') || ' UTC'
    END
    FROM daily_stats
    WHERE day = strftime('%Y-%m-%d', 'now')
  ), '-') AS peak_utc;
`;

const historySql = `
SELECT
  day,
  unique_visitors,
  max_online,
  CASE
    WHEN peak_at IS NULL THEN '-'
    ELSE datetime(peak_at / 1000, 'unixepoch') || ' UTC'
  END AS peak_utc
FROM daily_stats
ORDER BY day DESC
LIMIT 60;
`;

console.log(mode === 'history'
  ? '\nСтатистика Odium World Calculator — последние 60 дней\n'
  : '\nСтатистика Odium World Calculator — сегодня (UTC)\n');

const wranglerJs = resolve(
  process.cwd(),
  'node_modules',
  'wrangler',
  'bin',
  'wrangler.js'
);

if (!existsSync(wranglerJs)) {
  console.error('Не найден локальный Wrangler: ' + wranglerJs);
  console.error('Выполните в этой папке: npm install');
  process.exit(1);
}

const sql = mode === 'history' ? historySql : todaySql;

// Запускаем Wrangler через текущий node.exe.
// Это обходится без npx.cmd и работает на Windows, где spawnSync(npx.cmd)
// может завершаться ошибкой EINVAL.
const result = spawnSync(
  process.execPath,
  [
    wranglerJs,
    'd1',
    'execute',
    db,
    '--remote',
    '--command',
    sql
  ],
  {
    stdio: 'inherit',
    cwd: process.cwd(),
    windowsHide: true
  }
);

if (result.error) {
  console.error('Ошибка запуска Wrangler:', result.error.message);
  process.exit(1);
}

process.exit(result.status ?? 0);
