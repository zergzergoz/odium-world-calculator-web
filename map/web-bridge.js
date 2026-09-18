(() => {
  'use strict';

  const VERSION = '1.6.9';
  const WEB_VERSION = '0.1';
  const db = window.__ODIUM_WEB_DATA || {};

  const clone = value => {
    if (value == null) return value;
    if (typeof structuredClone === 'function') {
      try { return structuredClone(value); } catch {}
    }
    return JSON.parse(JSON.stringify(value));
  };

  const nowIso = () => new Date().toISOString();

  function fileSizeUtf8(text) {
    try { return new Blob([text]).size; } catch { return text.length; }
  }

  function safeName(value, fallback) {
    return String(value || fallback || 'Odium World')
      .trim()
      .replace(/[<>:"/\\|?*\x00-\x1F]/g, '_')
      .slice(0, 80) || fallback || 'Odium World';
  }

  function downloadText(filename, content, mime = 'application/json;charset=utf-8') {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
    return { ok: true, filePath: filename };
  }

  function chooseTextFile(accept, maxBytes) {
    return new Promise(resolve => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = accept || '.json,application/json';
      input.style.display = 'none';
      document.body.appendChild(input);
      let settled = false;
      const finish = result => {
        if (settled) return;
        settled = true;
        input.remove();
        resolve(result);
      };
      input.addEventListener('change', async () => {
        const file = input.files?.[0];
        if (!file) return finish({ ok: false, canceled: true });
        if (maxBytes && file.size > maxBytes) return finish({ ok: false, error: 'Файл слишком большой.' });
        try {
          finish({ ok: true, content: await file.text(), fileName: file.name });
        } catch (error) {
          finish({ ok: false, error: String(error?.message || error) });
        }
      }, { once: true });
      window.addEventListener('focus', () => setTimeout(() => {
        if (!settled && !input.files?.length) finish({ ok: false, canceled: true });
      }, 400), { once: true });
      input.click();
    });
  }

  function staticUpdateResult(label) {
    return {
      ok: false,
      reason: 'web-static',
      error: `Веб-прототип использует встроенную базу ${label}. Обновление из Wiki будет добавлено через серверный API на следующем этапе.`,
      message: `В веб-прототипе база ${label} обновляется вместе с публикацией сайта.`
    };
  }

  function craftingStatus() {
    const data = db.crafting || { items: [] };
    return {
      hasLocalUpdate: false,
      updatedAt: null,
      checkedAt: null,
      itemCount: Array.isArray(data.items) ? data.items.length : 0,
      source: data.source || '',
      message: 'Встроенная веб-база каталога крафта.'
    };
  }

  function alchemyStatus() {
    const data = db.alchemy || { items: [] };
    const items = Array.isArray(data.items) ? data.items : [];
    const readyCount = items.filter(item => Array.isArray(item.recipes) && item.recipes.length).length;
    return {
      hasLocalUpdate: false,
      updatedAt: null,
      checkedAt: null,
      itemCount: items.length,
      readyCount,
      source: data.source || '',
      message: `Встроенная веб-база алхимии: ${readyCount} рецептов готовы к расчёту.`
    };
  }

  function npcStatus(key, label) {
    const data = db[key] || { items: [] };
    const items = Array.isArray(data.items) ? data.items : [];
    const detailedCount = items.filter(item => Array.isArray(item.drops) && item.drops.length).length;
    return {
      hasLocalUpdate: false,
      updatedAt: null,
      checkedAt: null,
      itemCount: items.length,
      detailedCount,
      source: data.source || '',
      message: `Встроенная веб-база ${label}: ${detailedCount} из ${items.length}.`
    };
  }

  const noopSubscription = () => () => {};

  window.odiumApp = {
    platform: 'web',
    webStatic: true,
    webVersion: WEB_VERSION,

    getCraftingData: async () => clone(db.crafting || { categories: [], items: [] }),
    getCraftingStatus: async () => craftingStatus(),
    updateCraftingData: async () => staticUpdateResult('крафта'),

    getAlchemyData: async () => clone(db.alchemy || { categories: [], items: [] }),
    getAlchemyStatus: async () => alchemyStatus(),
    updateAlchemyData: async () => staticUpdateResult('алхимии'),

    getSquadData: async () => clone(db.squads || { items: [] }),
    getSquadStatus: async () => npcStatus('squads', 'сквадов'),
    updateSquadData: async () => staticUpdateResult('сквадов'),

    getRaidBossData: async () => clone(db['raid-bosses'] || { items: [] }),
    getRaidBossStatus: async () => npcStatus('raid-bosses', 'рейдовых боссов'),
    updateRaidBossData: async () => staticUpdateResult('рейдовых боссов'),

    goToMenu: async () => {
      location.href = 'index.html';
      return true;
    },

    saveTalentBuild: async payload => {
      try {
        const content = JSON.stringify(payload, null, 2);
        if (fileSizeUtf8(content) > 1024 * 1024) return { ok: false, error: 'Файл билда слишком большой.' };
        const name = safeName(payload?.name, 'Мой билд');
        return downloadText(`${name}.odium-build.json`, content);
      } catch (error) {
        return { ok: false, error: String(error?.message || error) };
      }
    },
    importTalentBuild: async () => chooseTextFile('.json,.odium-build.json,application/json', 1024 * 1024),

    saveMapRoutes: async payload => {
      try {
        const content = JSON.stringify(payload, null, 2);
        if (fileSizeUtf8(content) > 2 * 1024 * 1024) return { ok: false, error: 'Файл маршрутов слишком большой.' };
        const names = Array.isArray(payload?.routes) ? payload.routes.map(route => String(route?.name || '').trim()).filter(Boolean) : [];
        const name = safeName(names.length === 1 ? names[0] : 'Маршруты Odium World', 'Маршруты Odium World');
        return downloadText(`${name}.odium-routes.json`, content);
      } catch (error) {
        return { ok: false, error: String(error?.message || error) };
      }
    },
    importMapRoutes: async () => chooseTextFile('.json,.odium-routes.json,application/json', 2 * 1024 * 1024),

    getAppVersion: async () => ({ version: VERSION, webVersion: WEB_VERSION, packaged: false, platform: 'web' }),
    checkForUpdates: async () => ({ ok: false, reason: 'web-static' }),

    onUpdateState: noopSubscription,
    onSquadProgress: noopSubscription,
    onRaidBossProgress: noopSubscription,
    onAlchemyProgress: noopSubscription,
    onCraftingProgress: noopSubscription,
  };

  function markWebMode() {
    document.documentElement.dataset.platform = 'web';
    document.body?.classList.add('web-version');

    const disable = (id, title) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.disabled = true;
      el.setAttribute('aria-disabled', 'true');
      el.title = title;
    };

    const staticNote = 'Веб-прототип использует встроенную базу. Обновление из Wiki будет подключено через серверный API.';
    disable('updateButton', staticNote);
    disable('updateAlchemy', staticNote);
    disable('squadUpdateButton', staticNote);
    disable('raidBossUpdateButton', staticNote);

    const check = document.getElementById('checkUpdatesButton');
    if (check) {
      check.disabled = true;
      check.textContent = 'Веб-версия';
      check.title = 'Веб-версия обновляется автоматически при публикации сайта.';
    }
    const status = document.getElementById('updateStatus');
    if (status && !status.textContent) status.textContent = 'Обновляется вместе с сайтом';

    const footer = document.querySelector('.menu-footer');
    if (footer) footer.textContent = `Odium World · веб-версия ${WEB_VERSION}`;

    document.querySelectorAll('.craft-source-note').forEach(node => {
      node.textContent = 'Каталог крафта встроен в веб-версию. Актуализация из Wiki будет подключена через серверный API.';
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', markWebMode, { once: true });
  else markWebMode();

  if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('../service-worker.js', { scope: '../' }).catch(() => {});
    }, { once: true });
  }
})();
