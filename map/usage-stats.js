(() => {
  'use strict';

  const config = window.ODIUM_STATS_CONFIG || {};
  const endpoint = String(config.endpoint || '').trim();
  if (!config.enabled || !/^https:\/\/[^/]+\.workers\.dev\/heartbeat(?:\?.*)?$/i.test(endpoint)) return;
  if (!globalThis.crypto?.getRandomValues || !globalThis.crypto?.subtle) return;

  const heartbeatMs = Math.max(30000, Number(config.heartbeatMs) || 60000);
  const minSendIntervalMs = Math.max(10000, Number(config.minSendIntervalMs) || 15000);
  const seedKey = 'odium.stats.seed.v1';
  const lastSentKey = 'odium.stats.last-sent.v1';

  function bytesToHex(bytes) {
    return Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  function createSeed() {
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    return bytesToHex(bytes);
  }

  function getSeed() {
    try {
      let seed = localStorage.getItem(seedKey);
      if (!/^[a-f0-9]{32}$/i.test(seed || '')) {
        seed = createSeed();
        localStorage.setItem(seedKey, seed);
      }
      return seed;
    } catch {
      try {
        let seed = sessionStorage.getItem(seedKey);
        if (!/^[a-f0-9]{32}$/i.test(seed || '')) {
          seed = createSeed();
          sessionStorage.setItem(seedKey, seed);
        }
        return seed;
      } catch {
        return createSeed();
      }
    }
  }

  function utcDay() {
    return new Date().toISOString().slice(0, 10);
  }

  async function getDailyAnonymousId() {
    const source = new TextEncoder().encode(`${getSeed()}|${utcDay()}`);
    const digest = new Uint8Array(await crypto.subtle.digest('SHA-256', source));
    // Сервер получает только 128 бит хеша, меняющегося каждый UTC-день.
    // Исходный seed никогда не покидает браузер.
    return bytesToHex(digest.slice(0, 16));
  }

  function recentlySent() {
    try {
      const last = Number(sessionStorage.getItem(lastSentKey) || 0);
      return Date.now() - last < minSendIntervalMs;
    } catch {
      return false;
    }
  }

  function markSent() {
    try { sessionStorage.setItem(lastSentKey, String(Date.now())); } catch {}
  }

  async function heartbeat() {
    if (document.visibilityState === 'hidden' || recentlySent()) return;
    try {
      const id = await getDailyAnonymousId();
      markSent();
      await fetch(endpoint, {
        method: 'POST',
        mode: 'cors',
        credentials: 'omit',
        cache: 'no-store',
        referrerPolicy: 'no-referrer',
        keepalive: true,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
    } catch {
      // Статистика никогда не должна мешать работе калькулятора.
    }
  }

  const start = () => {
    heartbeat();
    const timer = setInterval(heartbeat, heartbeatMs);
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') heartbeat();
    });
    window.addEventListener('pagehide', () => clearInterval(timer), { once: true });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }
})();
