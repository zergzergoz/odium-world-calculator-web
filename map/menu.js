(() => {
  'use strict';

  const versionEl = document.getElementById('appVersion');
  const button = document.getElementById('checkUpdatesButton');
  const statusEl = document.getElementById('updateStatus');
  const progressEl = document.getElementById('updateProgress');
  const progressBar = document.getElementById('updateProgressBar');

  function setStatus(text = '') {
    statusEl.textContent = text;
  }

  function setProgress(percent = null) {
    if (percent == null || !Number.isFinite(Number(percent))) {
      progressEl.hidden = true;
      progressBar.style.width = '0%';
      return;
    }
    const value = Math.max(0, Math.min(100, Number(percent)));
    progressEl.hidden = false;
    progressBar.style.width = `${value}%`;
  }

  async function initialize() {
    try {
      const info = await window.odiumApp?.getAppVersion?.();
      if (versionEl) versionEl.textContent = info?.version ? `v${info.version}` : '—';
    } catch {
      if (versionEl) versionEl.textContent = '—';
    }
  }

  button?.addEventListener('click', async () => {
    button.disabled = true;
    setStatus('Проверяем обновления…');
    setProgress(null);
    try {
      const result = await window.odiumApp?.checkForUpdates?.();
      if (!result?.ok && result?.reason === 'not-packaged') {
        setStatus('Доступно только в установленной версии');
      } else if (!result?.ok && result?.error) {
        setStatus('Не удалось проверить обновления');
      }
    } catch {
      setStatus('Не удалось проверить обновления');
    } finally {
      // Реальное состояние придёт через updater:state. Небольшая задержка
      // предотвращает мигание кнопки при быстром ответе GitHub.
      setTimeout(() => {
        if (!progressEl || progressEl.hidden) button.disabled = false;
      }, 800);
    }
  });

  window.odiumApp?.onUpdateState?.(state => {
    if (state?.version && versionEl) versionEl.textContent = `v${state.version}`;

    switch (state?.status) {
      case 'checking':
        button.disabled = true;
        setStatus('Проверяем обновления…');
        setProgress(null);
        break;
      case 'available':
        button.disabled = true;
        setStatus(`Доступна версия ${state.availableVersion || ''}`.trim());
        break;
      case 'available-declined':
        button.disabled = false;
        setStatus(`Доступна версия ${state.availableVersion || ''}`.trim());
        setProgress(null);
        break;
      case 'downloading':
        button.disabled = true;
        setStatus(`Скачивание обновления… ${Math.round(Number(state.percent || 0))}%`);
        setProgress(Number(state.percent || 0));
        break;
      case 'installing':
        button.disabled = true;
        setStatus('Устанавливаем обновление…');
        setProgress(100);
        break;
      case 'current':
        button.disabled = false;
        setStatus('Установлена актуальная версия');
        setProgress(null);
        setTimeout(() => {
          if (statusEl.textContent === 'Установлена актуальная версия') setStatus('');
        }, 3500);
        break;
      case 'error':
        button.disabled = false;
        setStatus('Не удалось проверить обновления');
        setProgress(null);
        break;
      case 'idle':
      default:
        if (!state?.checking && !state?.downloading) button.disabled = false;
        break;
    }
  });

  initialize();
})();