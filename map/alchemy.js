(() => {
  'use strict';

  const $ = id => document.getElementById(id);
  const appApi = window.odiumApp;
  const state = {
    category: 'all',
    query: '',
    selected: new Map(),
    data: { categories: [], items: [] },
    status: null,
    updating: false,
    alchemyTalents: {
      wunschpunsch: false,
      experiencedAlchemist: false,
      bottomlessCauldron: false,
    },
  };

  $('menuButton').onclick = async () => {
    if (appApi?.goToMenu) await appApi.goToMenu();
    else location.href = 'index.html';
  };

  function escapeHtml(value) {
    return String(value ?? '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  function categoryById(id) {
    return state.data.categories.find(category => category.id === id) || { id, name: id, icon: '⚗' };
  }

  function pluralPosition(n) {
    const value = Math.abs(Number(n) || 0) % 100;
    const last = value % 10;
    if (value > 10 && value < 20) return 'позиций';
    if (last === 1) return 'позиция';
    if (last >= 2 && last <= 4) return 'позиции';
    return 'позиций';
  }

  function iconHtml(url, fallback = '⚗') {
    return url ? `<img src="${escapeHtml(url)}" alt="" loading="lazy">` : escapeHtml(fallback);
  }

  function formatNumber(value) {
    const n = Number(value || 0);
    return Number.isFinite(n) ? n.toLocaleString('ru-RU', { maximumFractionDigits: 2 }) : '0';
  }

  function formatDuration(seconds) {
    let total = Math.max(0, Math.round(Number(seconds) || 0));
    if (!total) return '—';
    const days = Math.floor(total / 86400); total %= 86400;
    const hours = Math.floor(total / 3600); total %= 3600;
    const minutes = Math.floor(total / 60);
    const secs = total % 60;
    const parts = [];
    if (days) parts.push(`${days} д`);
    if (hours) parts.push(`${hours} ч`);
    if (minutes) parts.push(`${minutes} мин`);
    if (secs || !parts.length) parts.push(`${secs} сек`);
    return parts.join(' ');
  }

  function itemLevelLabel(item) {
    const label = String(item?.levelLabel || '').trim();
    if (label) return label;
    const description = String(item?.description || '').replace(/<[^>]*>/g, ' ').replace(/\\n/g, ' ');
    const match = description.match(/(\d{1,3})\s*[-–—]\s*(\d{1,3})\s*(?:уровня|уровней|ур\.)/iu);
    return match ? `${match[1]}–${match[2]}` : '';
  }

  function selectedRecipe(item) {
    const recipes = Array.isArray(item?.recipes) ? item.recipes : [];
    return recipes.find(recipe => Number(recipe.successRate) === 100) || recipes[0] || null;
  }

  function recipeBatches(item, quantity) {
    const recipe = selectedRecipe(item);
    if (!recipe) return 0;
    const output = Math.max(1, Number(recipe.productionCount || 1));
    return Math.ceil(Math.max(1, Number(quantity || 1)) / output);
  }

  function normalizedResourceName(value) {
    return String(value || '').trim().toLocaleLowerCase('ru-RU').replace(/ё/g, 'е').replace(/\s+/g, ' ');
  }

  function isWaterBottle(ingredient) {
    return normalizedResourceName(ingredient?.name) === 'бутыль с водой';
  }

  function effectiveCraftTimeSeconds(item, recipe) {
    let seconds = Math.max(0, Number(recipe?.craftTimeSeconds || 0));
    if (state.alchemyTalents.wunschpunsch && item?.category === 'elixirs') seconds *= 0.5;
    return Math.ceil(seconds);
  }

  function effectiveIngredientAmount(item, ingredient, batches) {
    if (state.alchemyTalents.bottomlessCauldron && ['elixirs', 'potions'].includes(item?.category) && isWaterBottle(ingredient)) {
      return 0;
    }
    const base = Math.max(0, Number(ingredient?.amount || 0)) * Math.max(0, Number(batches || 0));
    if (state.alchemyTalents.experiencedAlchemist && item?.category === 'elixirs') return Math.ceil(base * 0.85);
    return base;
  }

  function hasActiveAlchemyTalents() {
    return Object.values(state.alchemyTalents).some(Boolean);
  }

  function renderCategories() {
    const host = $('alchemyCategories');
    host.innerHTML = '';
    const all = document.createElement('button');
    all.type = 'button';
    all.className = `alchemy-category-button ${state.category === 'all' ? 'is-active' : ''}`;
    all.innerHTML = `<span class="alchemy-category-icon">∞</span><span><strong>Все рецепты</strong><small>${state.data.items.length} ${pluralPosition(state.data.items.length)}</small></span>`;
    all.onclick = () => { state.category = 'all'; render(); };
    host.appendChild(all);

    for (const category of state.data.categories) {
      const count = state.data.items.filter(item => item.category === category.id).length;
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `alchemy-category-button ${state.category === category.id ? 'is-active' : ''}`;
      button.innerHTML = `<span class="alchemy-category-icon">${escapeHtml(category.icon || '⚗')}</span><span><strong>${escapeHtml(category.name)}</strong><small>${count} ${pluralPosition(count)}</small></span>`;
      button.onclick = () => { state.category = category.id; render(); };
      host.appendChild(button);
    }
  }

  function filteredItems() {
    const q = state.query.trim().toLocaleLowerCase('ru-RU');
    const categoryOrder = new Map(state.data.categories.map((category, index) => [category.id, index]));
    return state.data.items
      .filter(item => (state.category === 'all' || item.category === state.category) && (!q || `${item.name} ${categoryById(item.category).name}`.toLocaleLowerCase('ru-RU').includes(q)))
      .sort((a, b) => {
        const categoryDiff = (categoryOrder.get(a.category) ?? 999) - (categoryOrder.get(b.category) ?? 999);
        const nameDiff = a.name.localeCompare(b.name, 'ru');
        if (categoryDiff || nameDiff) return categoryDiff || nameDiff;
        const levelDiff = Number(a.levelMin || 0) - Number(b.levelMin || 0);
        return levelDiff || Number(a.id || 0) - Number(b.id || 0);
      });
  }

  function recipePreview(item) {
    const recipe = selectedRecipe(item);
    if (!recipe) {
      return `<div class="alchemy-missing-recipe"><strong>Данные рецепта не загружены</strong><span>Нажмите «Обновить из Odium World», чтобы попробовать получить актуальные требования.</span></div>`;
    }
    const ingredients = recipe.ingredients || [];
    const preview = ingredients.slice(0, 5).map(ingredient => `
      <span class="alchemy-mini-ingredient">
        <i>${iconHtml(ingredient.icon, '◇')}</i>
        <span>${escapeHtml(ingredient.name)}</span>
        <b>×${formatNumber(ingredient.amount)}</b>
      </span>`).join('');
    const more = ingredients.length > 5 ? `<small class="alchemy-more-ingredients">+ ещё ${ingredients.length - 5}</small>` : '';
    return `<div class="alchemy-recipe-preview">${preview}${more}</div>`;
  }

  function renderItems() {
    const host = $('alchemyGrid');
    const empty = $('alchemyEmpty');
    const list = filteredItems();
    host.innerHTML = '';
    empty.hidden = list.length > 0;

    if (!list.length) {
      const category = state.category === 'all' ? null : categoryById(state.category);
      empty.innerHTML = state.query
        ? '<strong>Ничего не найдено</strong><p>Измените строку поиска или выберите другой раздел.</p>'
        : `<strong>${category?.name === 'Эликсиры' ? 'Каталог эликсиров пока не загружен' : 'В этом разделе пока нет данных'}</strong><p>${category?.name === 'Эликсиры' ? 'Нажмите «Обновить из Odium World», чтобы получить позиции из Wiki.' : 'Данные можно добавить при следующем обновлении базы алхимии.'}</p>`;
      return;
    }

    for (const item of list) {
      const recipe = selectedRecipe(item);
      const category = categoryById(item.category);
      const quantity = state.selected.get(String(item.id)) || 1;
      const hasRecipe = Boolean(recipe);
      const time = Number(recipe?.craftTimeSeconds);
      const card = document.createElement('article');
      card.className = `alchemy-item-card ${state.selected.has(String(item.id)) ? 'is-selected' : ''} ${hasRecipe ? '' : 'is-incomplete'}`;
      card.innerHTML = `
        <div class="alchemy-item-top">
          <span class="alchemy-item-icon">${iconHtml(item.icon, category.icon || '⚗')}</span>
          <div class="alchemy-item-copy">
            <span class="alchemy-item-category">${escapeHtml(category.name)}${itemLevelLabel(item) ? ` <b class="alchemy-level-badge">Ур. ${escapeHtml(itemLevelLabel(item))}</b>` : ''}</span>
            <strong>${escapeHtml(item.name)}</strong>
            <small>${hasRecipe ? `${recipe.ingredients?.length || 0} ингредиентов · выход ×${recipe.productionCount || 1}` : 'Рецепт ожидает загрузки из Wiki'}</small>
          </div>
          <span class="alchemy-item-time ${Number.isFinite(time) && time > 0 ? 'has-time' : ''}">${Number.isFinite(time) && time > 0 ? formatDuration(time) : 'Время —'}</span>
        </div>
        ${recipePreview(item)}
        ${item.sourceNote ? `<p class="alchemy-source-caption">${escapeHtml(item.sourceNote)}</p>` : ''}
        <div class="alchemy-item-bottom">
          <span>${item.sourceKind === 'screenshot' ? 'Источник: скриншоты' : item.sourceKind === 'wiki' ? 'Источник: Odium World Wiki' : 'Источник: Odium World Wiki'}</span>
          <label>Количество<input class="alchemy-card-quantity" type="number" min="1" value="${quantity}" ${hasRecipe ? '' : 'disabled'} aria-label="Количество ${escapeHtml(item.name)}"></label>
        </div>`;

      if (hasRecipe) {
        card.onclick = event => {
          if (event.target.closest('input')) return;
          const id = String(item.id);
          if (state.selected.has(id)) state.selected.delete(id);
          else state.selected.set(id, 1);
          renderItems(); renderSelected(); renderSummary();
        };
        const input = card.querySelector('.alchemy-card-quantity');
        input.onchange = () => {
          const id = String(item.id);
          state.selected.set(id, Math.max(1, Number(input.value) || 1));
          renderSelected(); renderSummary(); renderItems();
        };
      }
      host.appendChild(card);
    }
  }

  function renderSelected() {
    const panel = $('alchemySelectedPanel');
    const host = $('alchemySelected');
    const items = [...state.selected.entries()].map(([id, quantity]) => ({
      item: state.data.items.find(candidate => String(candidate.id) === id),
      quantity,
    })).filter(entry => entry.item);
    panel.hidden = items.length === 0;
    $('alchemySelectedCount').textContent = `${items.length} ${pluralPosition(items.length)}`;
    host.innerHTML = items.map(({ item, quantity }) => {
      const category = categoryById(item.category);
      const recipe = selectedRecipe(item);
      const batches = recipeBatches(item, quantity);
      const seconds = effectiveCraftTimeSeconds(item, recipe);
      return `<div class="selected-item alchemy-selected-item">
        <span class="item-icon">${iconHtml(item.icon, category.icon || '⚗')}</span>
        <div class="selected-item-copy"><strong>${escapeHtml(item.name)}${itemLevelLabel(item) ? ` <span class="alchemy-selected-level">Ур. ${escapeHtml(itemLevelLabel(item))}</span>` : ''}</strong><small>${escapeHtml(category.name)} · партий: ${batches}${Number.isFinite(seconds) && seconds > 0 ? ` · ${formatDuration(seconds * batches)}` : ' · время не указано'}</small></div>
        <input class="selected-quantity" type="number" min="1" value="${quantity}" data-id="${escapeHtml(item.id)}" aria-label="Количество ${escapeHtml(item.name)}">
        <button type="button" class="selected-remove" data-id="${escapeHtml(item.id)}" title="Убрать">×</button>
      </div>`;
    }).join('');

    host.querySelectorAll('.selected-quantity').forEach(input => {
      input.onchange = () => {
        state.selected.set(String(input.dataset.id), Math.max(1, Number(input.value) || 1));
        renderSelected(); renderSummary(); renderItems();
      };
    });
    host.querySelectorAll('.selected-remove').forEach(button => {
      button.onclick = () => {
        state.selected.delete(String(button.dataset.id));
        renderSelected(); renderSummary(); renderItems();
      };
    });
  }

  function calculateSummary() {
    const totals = new Map();
    let totalTime = 0;
    let knownTimeEntries = 0;
    let unknownTimeEntries = 0;
    let productCount = 0;

    for (const [id, quantity] of state.selected) {
      const item = state.data.items.find(candidate => String(candidate.id) === id);
      const recipe = selectedRecipe(item);
      if (!item || !recipe) continue;
      productCount += Number(quantity || 0);
      const batches = recipeBatches(item, quantity);
      const seconds = effectiveCraftTimeSeconds(item, recipe);
      if (Number.isFinite(seconds) && seconds > 0) {
        totalTime += seconds * batches;
        knownTimeEntries += 1;
      } else {
        unknownTimeEntries += 1;
      }
      for (const ingredient of recipe.ingredients || []) {
        const amount = effectiveIngredientAmount(item, ingredient, batches);
        if (amount <= 0) continue;
        const key = `${ingredient.id ?? ''}|${normalizedResourceName(ingredient.name)}`;
        const existing = totals.get(key) || { ...ingredient, amount: 0 };
        existing.amount += amount;
        if (!existing.icon && ingredient.icon) existing.icon = ingredient.icon;
        totals.set(key, existing);
      }
    }

    return { totals: [...totals.values()], totalTime, knownTimeEntries, unknownTimeEntries, productCount };
  }

  function renderSummary() {
    const summary = calculateSummary();
    const selectedCount = state.selected.size;
    $('alchemySummaryCount').textContent = selectedCount ? `${selectedCount} ${pluralPosition(selectedCount)}` : '0';
    const totalTime = $('alchemyTotalTime');
    const hint = $('alchemyTimeHint');
    if (summary.knownTimeEntries > 0) {
      totalTime.textContent = formatDuration(summary.totalTime);
      if (summary.unknownTimeEntries) {
        hint.textContent = `Рассчитано для ${summary.knownTimeEntries} позиций; ещё ${summary.unknownTimeEntries} без времени в источнике.`;
      } else if (state.alchemyTalents.wunschpunsch && [...state.selected.keys()].some(id => state.data.items.find(item => String(item.id) === id)?.category === 'elixirs')) {
        hint.textContent = 'ВуншПунш учтён: время приготовления выбранных Эликсиров сокращено на 50%.';
      } else {
        hint.textContent = 'Сумма времени всех выбранных партий.';
      }
    } else {
      totalTime.textContent = '—';
      hint.textContent = selectedCount ? 'Для выбранных рецептов время создания пока не указано в доступных данных.' : 'Выберите рецепт с указанным временем создания.';
    }

    const host = $('alchemyRequirements');
    if (!summary.totals.length) {
      host.innerHTML = '<p class="muted">Выберите один или несколько рецептов.</p>';
    } else {
      summary.totals.sort((a, b) => a.name.localeCompare(b.name, 'ru'));
      host.innerHTML = summary.totals.map(resource => `<div class="alchemy-requirement">
        <span class="item-icon">${iconHtml(resource.icon, '◇')}</span>
        <div><strong>${escapeHtml(resource.name)}</strong><small>${hasActiveAlchemyTalents() ? 'Итого с учётом талантов' : 'Итого'}</small></div>
        <b>${formatNumber(resource.amount)}</b>
      </div>`).join('');
    }

    const warnings = [];
    if (summary.unknownTimeEntries) warnings.push(`Время создания отсутствует у ${summary.unknownTimeEntries} выбранных ${pluralPosition(summary.unknownTimeEntries)}.`);
    const incomplete = state.data.items.filter(item => !item.recipes?.length).length;
    if (incomplete) warnings.push(`${incomplete} позиций каталога ожидают загрузки рецептов из Wiki.`);
    $('alchemyWarnings').innerHTML = warnings.map(text => `<div class="alchemy-warning">${escapeHtml(text)}</div>`).join('');
  }

  function renderStatus() {
    const host = $('alchemyStatus');
    if (!state.status) { host.innerHTML = ''; return; }
    const checked = state.status.checkedAt ? new Date(state.status.checkedAt).toLocaleString('ru-RU') : 'ещё не выполнялась';
    const updated = state.status.updatedAt ? new Date(state.status.updatedAt).toLocaleString('ru-RU') : 'встроенная база';
    host.innerHTML = `<span class="status-dot ${state.status.readyCount ? 'is-ok' : ''}"></span><span><strong>${escapeHtml(state.status.message || 'База алхимии')}</strong><small>Готово рецептов: ${state.status.readyCount || 0} · Проверка: ${escapeHtml(checked)} · Обновление: ${escapeHtml(updated)}</small></span>`;
  }

  function render() {
    renderCategories();
    renderItems();
    renderSelected();
    renderSummary();
    renderStatus();
  }

  async function loadAlchemy() {
    try {
      const [data, status] = await Promise.all([
        appApi?.getAlchemyData?.(),
        appApi?.getAlchemyStatus?.(),
      ]);
      state.data = data || { categories: [], items: [] };
      state.status = status || null;
      // Remove selections whose recipe disappeared after an update.
      for (const id of [...state.selected.keys()]) {
        const item = state.data.items.find(candidate => String(candidate.id) === id);
        if (!item?.recipes?.length) state.selected.delete(id);
      }
      render();
    } catch (error) {
      $('alchemyEmpty').hidden = false;
      $('alchemyEmpty').innerHTML = `<strong>Не удалось загрузить базу алхимии</strong><p>${escapeHtml(error?.message || error)}</p>`;
    }
  }

  $('alchemySearch').oninput = event => { state.query = event.target.value || ''; renderItems(); };
  $('clearAlchemy').onclick = () => { state.selected.clear(); renderItems(); renderSelected(); renderSummary(); };

  $('alchemyTalentWunschpunsch').onchange = event => {
    state.alchemyTalents.wunschpunsch = event.target.checked;
    renderSelected();
    renderSummary();
  };
  $('alchemyTalentExperienced').onchange = event => {
    state.alchemyTalents.experiencedAlchemist = event.target.checked;
    renderSummary();
  };
  $('alchemyTalentBottomless').onchange = event => {
    state.alchemyTalents.bottomlessCauldron = event.target.checked;
    renderSummary();
  };

  const modal = $('alchemyUpdateModal');
  const updateButton = $('updateAlchemy');
  const result = $('alchemyUpdateResult');
  const tokenInput = $('alchemyUpdateToken');
  const confirm = $('confirmAlchemyUpdate');

  updateButton.onclick = () => {
    result.className = 'update-result';
    result.textContent = 'Можно сначала попробовать без токена.';
    tokenInput.value = '';
    modal.showModal();
  };
  $('cancelAlchemyUpdate').onclick = () => { if (!state.updating) modal.close(); };
  $('cancelAlchemyUpdateAction').onclick = () => { if (!state.updating) modal.close(); };

  $('alchemyUpdateForm').onsubmit = async event => {
    event.preventDefault();
    if (state.updating || !appApi?.updateAlchemyData) return;
    state.updating = true;
    confirm.disabled = true;
    $('cancelAlchemyUpdate').disabled = true;
    $('cancelAlchemyUpdateAction').disabled = true;
    result.className = 'update-result is-progress';
    result.textContent = 'Получаем данные Odium World…';
    try {
      const response = await appApi.updateAlchemyData(tokenInput.value.trim());
      if (response?.ok) {
        result.className = 'update-result is-success';
        result.textContent = response.changed
          ? 'Данные алхимии успешно обновлены и сохранены локально.'
          : 'Проверка завершена: новых изменений не обнаружено.';
        if (response.data) state.data = response.data;
        if (response.status) state.status = response.status;
        for (const id of [...state.selected.keys()]) {
          const item = state.data.items.find(candidate => String(candidate.id) === id);
          if (!item?.recipes?.length) state.selected.delete(id);
        }
        render();
      } else {
        result.className = 'update-result is-error';
        result.textContent = response?.error || response?.status?.message || 'Обновление не выполнено.';
        if (response?.status) { state.status = response.status; renderStatus(); }
      }
    } catch (error) {
      result.className = 'update-result is-error';
      result.textContent = error?.message || String(error);
    } finally {
      state.updating = false;
      confirm.disabled = false;
      $('cancelAlchemyUpdate').disabled = false;
      $('cancelAlchemyUpdateAction').disabled = false;
    }
  };

  appApi?.onAlchemyProgress?.(progress => {
    if (!state.updating) return;
    result.className = 'update-result is-progress';
    result.textContent = progress?.message || 'Обновляем данные алхимии…';
  });

  loadAlchemy();
})();
