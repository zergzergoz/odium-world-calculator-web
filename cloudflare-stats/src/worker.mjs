const ONLINE_WINDOW_MS = 150000;
const VISITOR_ID_RE = /^[a-f0-9]{32}$/i;

function utcDay(timestamp = Date.now()) {
  return new Date(timestamp).toISOString().slice(0, 10);
}

function allowedOrigins(env) {
  return new Set(String(env.ALLOWED_ORIGINS || '')
    .split(',')
    .map(value => value.trim())
    .filter(Boolean));
}

function corsHeaders(origin) {
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    'Cache-Control': 'no-store',
    'Vary': 'Origin'
  };
}

function empty(status, origin = '') {
  return new Response(null, {
    status,
    headers: origin ? corsHeaders(origin) : { 'Cache-Control': 'no-store' }
  });
}

async function recordHeartbeat(request, env, origin) {
  let body;
  try {
    body = await request.json();
  } catch {
    return empty(400, origin);
  }

  const visitorId = String(body?.id || '').trim().toLowerCase();
  if (!VISITOR_ID_RE.test(visitorId)) return empty(400, origin);

  const now = Date.now();
  const day = utcDay(now);
  const activeSince = now - ONLINE_WINDOW_MS;

  await env.DB.prepare(`
    INSERT INTO daily_visitors(day, visitor_id, first_seen, last_seen)
    VALUES (?1, ?2, ?3, ?3)
    ON CONFLICT(day, visitor_id) DO UPDATE SET last_seen = excluded.last_seen
  `).bind(day, visitorId, now).run();

  const [uniqueRow, onlineRow] = await Promise.all([
    env.DB.prepare('SELECT COUNT(*) AS count FROM daily_visitors WHERE day = ?1')
      .bind(day).first(),
    env.DB.prepare('SELECT COUNT(*) AS count FROM daily_visitors WHERE day = ?1 AND last_seen >= ?2')
      .bind(day, activeSince).first()
  ]);

  const uniqueVisitors = Math.max(0, Number(uniqueRow?.count || 0));
  const currentOnline = Math.max(0, Number(onlineRow?.count || 0));

  await env.DB.prepare(`
    INSERT INTO daily_stats(day, unique_visitors, max_online, peak_at, updated_at)
    VALUES (?1, ?2, ?3, ?4, ?4)
    ON CONFLICT(day) DO UPDATE SET
      unique_visitors = excluded.unique_visitors,
      max_online = CASE
        WHEN excluded.max_online > daily_stats.max_online THEN excluded.max_online
        ELSE daily_stats.max_online
      END,
      peak_at = CASE
        WHEN excluded.max_online > daily_stats.max_online THEN excluded.peak_at
        ELSE daily_stats.peak_at
      END,
      updated_at = excluded.updated_at
  `).bind(day, uniqueVisitors, currentOnline, now).run();

  return empty(204, origin);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = request.headers.get('Origin') || '';
    const allowed = allowedOrigins(env);

    if (request.method === 'OPTIONS') {
      return allowed.has(origin) ? empty(204, origin) : empty(403);
    }

    if (request.method !== 'POST' || url.pathname !== '/heartbeat') {
      return empty(404);
    }

    if (!allowed.has(origin)) return empty(403);
    if (!env.DB) return empty(503, origin);

    try {
      return await recordHeartbeat(request, env, origin);
    } catch {
      return empty(500, origin);
    }
  },

  async scheduled(_controller, env, ctx) {
    if (!env.DB) return;
    const cutoff = utcDay(Date.now() - 2 * 24 * 60 * 60 * 1000);
    ctx.waitUntil(
      env.DB.prepare('DELETE FROM daily_visitors WHERE day < ?1').bind(cutoff).run()
    );
  }
};
