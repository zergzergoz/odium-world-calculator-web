(() => {
  const $ = id => document.getElementById(id);
  const state = {
    category: 'all', group: 'all', subGroup: 'all', rank: 'all', grade: 'all', query: '',
    selected: new Map(),
    expandedResources: new Set(),
    crafterTalents: { processing: false, materials: false, costReduction: false },
    expandedCategories: new Set(),
    expandedGroups: new Set(),
    data: { categories: [], items: [] }, status: null
  };
  const appApi = window.odiumApp;

  $('menuButton').onclick = async () => { if (window.odiumApp?.goToMenu) await window.odiumApp.goToMenu(); else location.href = 'index.html'; };

  function escapeHtml(value) {
    return String(value ?? '').replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;');
  }
  function pluralItems(n) { return n === 1 ? 'предмет' : 'предметов'; }
  function iconHtml(url) { return url ? `<img src="${escapeHtml(url)}" alt="" loading="lazy">` : '◇'; }
  function numberValue(v) { return v === null || v === undefined || v === '' ? null : Number(v); }
  function stat(label, value, suffix = '') {
    const n = numberValue(value);
    return Number.isFinite(n) ? `<span class="item-stat"><b>${escapeHtml(label)}</b><strong>${n.toLocaleString('ru-RU')}${escapeHtml(suffix)}</strong></span>` : '';
  }

  function cleanDescription(value) {
    return String(value ?? '')
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/?font\b[^>]*>/gi, '')
      .replace(/<[^>]+>/g, '')
      .replace(/\\n/g, '\n')
      .replace(/\r/g, '')
      .replace(/&nbsp;/gi, ' ')
      .replace(/&amp;/gi, '&')
      .replace(/&lt;/gi, '<')
      .replace(/&gt;/gi, '>')
      .replace(/&quot;/gi, '"')
      .replace(/&#039;/gi, "'")
      .replace(/[ \t]+\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  }

  function isMagicWeapon(item) {
    const text = `${item.wikiType || ''} ${item.wikiSubType || ''} ${item.group || ''} ${item.subGroup || ''}`.toLowerCase();
    return text.includes('магичес');
  }
  function isShield(item) {
    const text = `${item.wikiType || ''} ${item.wikiSubType || ''}`.toLowerCase();
    return text.includes('щит');
  }
  function isSigil(item) {
    const text = `${item.wikiType || ''} ${item.wikiSubType || ''}`.toLowerCase();
    return text.includes('сигил');
  }
  function statsFor(item) {
    const stats = [];
    if (item.category === 'weapons') {
      if (isMagicWeapon(item)) stats.push(stat('Маг. атака', item.matk));
      else {
        stats.push(stat('Физ. атака', item.patk));
        stats.push(stat('Скор. атаки', item.patkSpd));
      }
    } else if (item.category === 'equipment' || isShield(item) || isSigil(item)) {
      stats.push(stat('Физ. защита', item.pdef));
    }
    if (item.category === 'jewelry') {
      stats.push(stat('Мана', item.maxMp));
      stats.push(stat('Маг. защита', item.mdef));
    }
    if (String(item.wikiType || '').toLocaleLowerCase('ru-RU') === 'правые браслеты' && item.description) {
      const description = cleanDescription(item.description);
      if (description) stats.push(`<span class="item-description">${escapeHtml(description).replaceAll('\n', '<br>')}</span>`);
    }
    return stats.filter(Boolean).join('');
  }

  function renderStatus() {
    const el = $('craftStatus');
    if (!state.status) return;
    const checked = state.status.checkedAt ? new Date(state.status.checkedAt).toLocaleString('ru-RU') : 'ещё не выполнялась';
    const updated = state.status.updatedAt ? new Date(state.status.updatedAt).toLocaleString('ru-RU') : 'нет успешного обновления';
    const ok = Boolean(state.status.itemCount);
    el.innerHTML = `<span class="status-dot ${ok ? 'is-ok' : ''}"></span><span><strong>${escapeHtml(state.status.message || 'Локальная база')}</strong><small>Проверка: ${escapeHtml(checked)} · Последнее изменение: ${escapeHtml(updated)} · ${state.status.itemCount || 0} ${pluralItems(state.status.itemCount || 0)}</small></span>`;
  }

  function renderCategories() {
    const el = $('categoryList');
    el.innerHTML = '';

    const addButton = (id, name, level = 0, extra = '', expanded = false) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = `category-button category-level-${level} ${extra}`;
      b.innerHTML = `<span class="category-chevron">${expanded ? '▾' : '▸'}</span><span>${escapeHtml(name)}</span>`;
      b.onclick = () => {
        if (level === 0) {
          if (id === 'all') {
            state.category = 'all'; state.group = 'all'; state.subGroup = 'all';
          } else {
            state.category = id; state.group = 'all'; state.subGroup = 'all';
            if (state.expandedCategories.has(id)) state.expandedCategories.delete(id); else state.expandedCategories.add(id);
          }
        } else if (level === 1) {
          state.category = id.category; state.group = id.group; state.subGroup = 'all';
          const key = `${id.category}::${id.group}`;
          if (state.expandedGroups.has(key)) state.expandedGroups.delete(key); else state.expandedGroups.add(key);
          state.expandedCategories.add(id.category);
        } else {
          state.category = id.category; state.group = id.group; state.subGroup = id.subGroup;
          state.expandedCategories.add(id.category);
          state.expandedGroups.add(`${id.category}::${id.group}`);
        }
        render();
      };
      el.appendChild(b);
    };

    const allActive = state.category === 'all' && state.group === 'all' && state.subGroup === 'all';
    addButton('all', 'Все предметы', 0, allActive ? 'is-active no-chevron' : 'no-chevron', false);

    for (const category of state.data.categories) {
      const catActive = state.category === category.id;
      const catExpanded = state.expandedCategories.has(category.id);
      addButton(category.id, category.name, 0, catActive && state.group === 'all' ? 'is-active' : '', catExpanded);
      if (!catExpanded) continue;
      for (const group of (category.groups || [])) {
        const key = `${category.id}::${group.name}`;
        const groupExpanded = state.expandedGroups.has(key);
        addButton({category: category.id, group: group.name}, group.name, 1,
          catActive && state.group === group.name && state.subGroup === 'all' ? 'is-active' : '', groupExpanded);
        if (!groupExpanded) continue;
        for (const sub of (group.subGroups || [])) {
          addButton({category: category.id, group: group.name, subGroup: sub.name}, sub.name, 2,
            catActive && state.group === group.name && state.subGroup === sub.name ? 'is-active' : '', false);
        }
      }
    }
  }

  function rankLabel(rank) {
    const labels = { NONE: 'Без ранга', LOW: 'LOW', MID: 'MID', HIGHT: 'HIGHT', HIGH: 'HIGH', TOP: 'TOP', REL: 'REL' };
    return labels[String(rank || '').toUpperCase()] || String(rank || 'Без ранга');
  }
  function gradeLabel(grade) { return String(grade || '').toUpperCase() || '—'; }
  function rankClass(rank) { return `rank-${String(rank || 'NONE').toUpperCase().toLowerCase()}`; }

  function availableRanks() {
    const ranks = new Map();
    for (const item of state.data.items) {
      const rank = String(item.rank || 'NONE').toUpperCase();
      if (!ranks.has(rank)) ranks.set(rank, rankLabel(rank));
    }
    return [...ranks.entries()].sort((a, b) => a[1].localeCompare(b[1], 'ru', { numeric: true }));
  }
  function renderRankFilter() {
    const select = $('rankFilter');
    const current = state.rank;
    select.innerHTML = '<option value="all">Все ранги</option>';
    availableRanks().forEach(([value, label]) => {
      const option = document.createElement('option'); option.value = value; option.textContent = label; select.appendChild(option);
    });
    select.value = availableRanks().some(([value]) => value === current) ? current : 'all';
    state.rank = select.value;
  }

  function availableGrades() {
    const grades = new Set();
    for (const item of state.data.items) {
      const grade = String(item.crystalType || item.grade || '').trim().toUpperCase();
      if (grade) grades.add(grade);
    }
    return [...grades].sort((a, b) => a.localeCompare(b, 'ru', { numeric: true }));
  }
  function renderGradeFilter() {
    const select = $('gradeFilter');
    const current = state.grade;
    const grades = availableGrades();
    select.innerHTML = '<option value="all">Все грейды</option>';
    grades.forEach(value => {
      const option = document.createElement('option'); option.value = value; option.textContent = value; select.appendChild(option);
    });
    select.value = grades.includes(current) ? current : 'all';
    state.grade = select.value;
  }

  function filteredItems() {
    const q = state.query.trim().toLowerCase();
    return state.data.items.filter(i =>
      (state.category === 'all' || i.category === state.category) &&
      (state.group === 'all' || String(i.wikiType || i.group || '') === state.group) &&
      (state.subGroup === 'all' || String(i.wikiSubType || i.subGroup || '') === state.subGroup) &&
      (state.rank === 'all' || String(i.rank || 'NONE').toUpperCase() === state.rank) &&
      (state.grade === 'all' || String(i.crystalType || i.grade || '').toUpperCase() === state.grade) &&
      (!q || `${i.name} ${i.wikiType || i.group || ''} ${i.wikiSubType || i.subGroup || ''} ${i.rank || ''} ${i.grade || ''}`.toLowerCase().includes(q))
    ).sort((a, b) => a.name.localeCompare(b.name, 'ru'));
  }

  function renderSelected() {
    const el = $('selectedItems');
    const entries = [...state.selected.entries()].map(([id, quantity]) => state.data.items.find(i => i.id === id)).filter(Boolean);
    $('selectedItemsPanel').hidden = entries.length === 0;
    $('selectedItemsCount').textContent = `${entries.length} ${pluralItems(entries.length)}`;
    el.innerHTML = entries.length ? entries.map(item => `
      <div class="selected-item">
        <span class="item-icon">${iconHtml(item.icon)}</span>
        <div class="selected-item-copy"><strong>${escapeHtml(item.name)}</strong><small>${escapeHtml(item.wikiType || '')} · Грейд: ${escapeHtml(gradeLabel(item.grade))} · Ранг: ${escapeHtml(rankLabel(item.rank))}</small></div>
        <input class="selected-quantity" type="number" min="1" value="${state.selected.get(item.id) || 1}" data-id="${item.id}" aria-label="Количество ${escapeHtml(item.name)}">
        <button type="button" class="selected-remove" data-id="${item.id}" title="Убрать">×</button>
      </div>`).join('') : '';
    el.querySelectorAll('.selected-quantity').forEach(input => {
      input.onchange = () => { const id = Number(input.dataset.id); state.selected.set(id, Math.max(1, Number(input.value) || 1)); renderSelected(); renderRequirements(); renderItems(); };
    });
    el.querySelectorAll('.selected-remove').forEach(btn => {
      btn.onclick = () => { state.selected.delete(Number(btn.dataset.id)); renderSelected(); renderRequirements(); renderItems(); };
    });
  }

  function renderItems() {
    const el = $('itemGrid'); el.innerHTML = '';
    const list = filteredItems();
    $('emptyState').hidden = list.length > 0;
    if (!list.length) {
      $('emptyState').innerHTML = state.data.items.length
        ? '<strong>Ничего не найдено</strong><p>Измените поисковый запрос или выберите другую группу.</p>'
        : '<strong>Локальная база пока пуста</strong><p>Нажмите «Обновить из Odium World», чтобы загрузить каталог и рецепты.</p>';
      return;
    }
    list.forEach(item => {
      const card = document.createElement('article');
      card.className = `craft-item ${state.selected.has(item.id) ? 'is-selected' : ''}`;
      const recipeInfo = item.recipes?.length ? `${item.recipes.length} ${item.recipes.length === 1 ? 'рецепт' : 'рецепта'}` : 'крафт не указан';
      const grade = gradeLabel(item.grade || item.crystalType);
      const rank = rankLabel(item.rank);
      const stats = statsFor(item);
      card.innerHTML = `
        <span class="item-icon">${iconHtml(item.icon)}</span>
        <div class="craft-item-copy">
          <strong>${escapeHtml(item.name)}</strong>
          <small>${escapeHtml(item.wikiType || '')}${item.wikiSubType ? ` · ${escapeHtml(item.wikiSubType)}` : ''}</small>
          <span class="item-tags"><b class="item-tag grade-tag">Грейд: ${escapeHtml(grade)}</b><b class="item-tag item-tag-rank ${rankClass(item.rank)}">Ранг: ${escapeHtml(rank)}</b><em>${escapeHtml(recipeInfo)}</em></span>
          ${stats ? `<div class="item-stats">${stats}</div>` : ''}
        </div>
        <label class="item-quantity">Кол-во<input aria-label="Количество ${escapeHtml(item.name)}" type="number" min="1" value="${state.selected.get(item.id) || 1}"></label>`;
      card.onclick = e => {
        if (e.target.closest('input')) return;
        if (state.selected.has(item.id)) state.selected.delete(item.id); else state.selected.set(item.id, 1);
        renderItems(); renderSelected(); renderRequirements();
      };
      const input = card.querySelector('input');
      input.onchange = () => { state.selected.set(item.id, Math.max(1, Number(input.value) || 1)); renderSelected(); renderRequirements(); renderItems(); };
      el.appendChild(card);
    });
  }

  function buildIndex() {
    const index = new Map();
    for (const item of state.data.items) index.set(`${item.itemType || ''}:${item.id}`, item);
    return index;
  }
  function calculateRequirements() {
    const index = buildIndex(); const totals = new Map(); const visiting = new Set();
    function addTotal(ingredient, amount, depth = 0) {
      const key = `${ingredient.itemType || ''}:${ingredient.id}`;
      const existing = totals.get(key) || { ...ingredient, amount: 0, depth };
      existing.amount += amount; existing.depth = Math.min(existing.depth ?? depth, depth); totals.set(key, existing);
    }
    function expand(item, quantity, depth = 0) {
      const recipes = Array.isArray(item.recipes) ? item.recipes : []; if (!recipes.length) return;
      const recipe = recipes.find(r => Number(r.successRate) === 100) || recipes[0];
      const productionCount = Math.max(1, Number(recipe.productionCount || 1)); const batches = Math.ceil(quantity / productionCount);
      const visitKey = `${item.itemType || ''}:${item.id}`;
      if (visiting.has(visitKey)) { addTotal({ id: item.id, name: item.name, icon: item.icon, itemType: item.itemType }, quantity, depth); return; }
      visiting.add(visitKey);
      const isBroochCraft = String(item.wikiType || item.group || '').toLocaleLowerCase('ru-RU') === 'броши';
      for (const ingredient of recipe.ingredients || []) {
        const amount = Number(ingredient.amount || 0) * batches; if (!amount) continue;
        const child = index.get(`${ingredient.itemType || ''}:${ingredient.id}`) || index.get(`armors:${ingredient.id}`) || index.get(`weapons:${ingredient.id}`);
        const childIsBrooch = String(child?.wikiType || child?.group || '').toLocaleLowerCase('ru-RU') === 'броши';
        // A higher brooch requires the previous brooch itself, but its recipe
        // must not be recursively unfolded into every earlier brooch.
        if (isBroochCraft && childIsBrooch) addTotal(ingredient, amount, depth);
        else if (child?.recipes?.length) expand(child, amount, depth + 1);
        else addTotal(ingredient, amount, depth);
      }
      visiting.delete(visitKey);
    }
    for (const [id, quantity] of state.selected) { const item = state.data.items.find(i => i.id === id); if (item) expand(item, quantity); }
    if (state.crafterTalents.costReduction) {
      for (const resource of totals.values()) {
        resource.amount = Math.ceil(Number(resource.amount || 0) * 0.95);
      }
    }
    return totals;
  }
  const PROCESSING_RECIPES = new Map([
    ['слиток', { output: 1, ingredients: [['Сплав', 100], ['Уголь', 50]] }],
    ['сплав', { output: 1, ingredients: [['Железо', 100], ['Уголь', 20]] }],
    ['железо', { output: 20, ingredients: [['Железная Руда', 20], ['Уголь', 1]] }],
    ['брус', { output: 1, ingredients: [['Древесина', 100], ['Смола', 50]] }],
    ['древесина', { output: 1, ingredients: [['Бревно', 100], ['Смола', 20]] }],
    ['бревно', { output: 20, ingredients: [['Сруб', 20], ['Смола', 1]] }],
    ['россыпь', { output: 1, ingredients: [['Кристаллит', 100], ['Катализатор', 50]] }],
    ['кристаллит', { output: 1, ingredients: [['Кристалл', 100], ['Катализатор', 20]] }],
    ['кристалл', { output: 20, ingredients: [['Кристальная Жеода', 20], ['Катализатор', 1]] }],
  ]);
  const CUSTOM_RESOURCE_ICONS = new Map([
    ['железная руда', 'assets/crafting-resources/iron-ore.png'],
    ['сруб', 'assets/crafting-resources/logging.png'],
    ['кристальная жеода', 'assets/crafting-resources/crystal-geode.png'],
  ]);
  function resourceKey(name) { return String(name || '').trim().toLocaleLowerCase('ru-RU'); }
  function resourceCatalog() {
    const catalog = new Map();
    for (const item of state.data.items) {
      for (const recipe of item.recipes || []) {
        for (const ingredient of recipe.ingredients || []) {
          const key = resourceKey(ingredient.name);
          if (key && !catalog.has(key)) catalog.set(key, ingredient);
        }
      }
    }
    return catalog;
  }
  const PROCESSING_TALENT_RESOURCES = new Set(['кристалл', 'бревно', 'железо']);
  const MATERIALS_TALENT_RESOURCES = new Set(['сплав', 'кристаллит', 'древесина']);

  function effectiveProcessingOutput(name, recipe) {
    const key = resourceKey(name);
    let output = Math.max(0.000001, Number(recipe.output) || 1);
    if (state.crafterTalents.processing && PROCESSING_TALENT_RESOURCES.has(key)) output *= 1.10;
    if (state.crafterTalents.materials && MATERIALS_TALENT_RESOURCES.has(key)) output *= 1.10;
    return output;
  }

  function processingChildren(name, amount, catalog) {
    const recipe = PROCESSING_RECIPES.get(resourceKey(name));
    if (!recipe) return [];
    const output = effectiveProcessingOutput(name, recipe);
    const batches = Math.ceil(Math.max(0, Number(amount) || 0) / output);
    return recipe.ingredients.map(([childName, perBatch]) => {
      const key = resourceKey(childName);
      const known = catalog.get(key);
      return {
        id: known?.id ?? null,
        itemType: known?.itemType || 'items',
        name: childName,
        amount: Number(perBatch) * batches,
        icon: CUSTOM_RESOURCE_ICONS.get(key) || known?.icon || ''
      };
    });
  }
  function renderRequirementRow(resource, level, pathKey, catalog) {
    const key = resourceKey(resource.name);
    const recipe = PROCESSING_RECIPES.get(key);
    const expandable = Boolean(recipe);
    const expanded = expandable && state.expandedResources.has(pathKey);
    const children = expanded ? processingChildren(resource.name, resource.amount, catalog) : [];
    const indent = level * 16;
    const output = recipe ? effectiveProcessingOutput(resource.name, recipe) : 0;
    const baseOutput = recipe ? Math.max(0.000001, Number(recipe.output) || 1) : 0;
    const boosted = expandable && output > baseOutput + 0.000001;
    const row = `<button type="button" class="requirement requirement-tree-row ${expandable ? 'is-expandable' : ''} ${expanded ? 'is-expanded' : ''} ${boosted ? 'is-talent-boosted' : ''}" data-resource-path="${escapeHtml(pathKey)}" ${expandable ? '' : 'disabled'} style="--resource-indent:${indent}px">
      <span class="requirement-expander" aria-hidden="true">${expandable ? (expanded ? '▾' : '▸') : '·'}</span>
      <span class="item-icon">${iconHtml(resource.icon)}</span>
      <strong>${escapeHtml(resource.name)}${boosted ? '<small class="resource-talent-badge">+10%</small>' : ''}</strong>
      <b>${Number(resource.amount).toLocaleString('ru-RU')}</b>
    </button>`;
    const nested = children.map((child, index) => renderRequirementRow(child, level + 1, `${pathKey}/${resourceKey(child.name)}:${index}`, catalog)).join('');
    return row + nested;
  }
  function renderRequirements() {
    const out = calculateRequirements(); let selectedCount = 0; for (const q of state.selected.values()) selectedCount += q;
    $('selectedCount').textContent = `${selectedCount} ${pluralItems(selectedCount)}`;
    const catalog = resourceCatalog();
    const list = [...out.values()].sort((a, b) => a.name.localeCompare(b.name, 'ru'));
    $('requirements').innerHTML = list.length
      ? list.map((r, index) => renderRequirementRow(r, 0, `root:${resourceKey(r.name)}:${index}`, catalog)).join('')
      : '<p class="muted">Выберите один или несколько предметов.</p>';
    $('requirements').querySelectorAll('.requirement-tree-row.is-expandable').forEach(row => {
      row.onclick = () => {
        const path = row.dataset.resourcePath;
        if (state.expandedResources.has(path)) state.expandedResources.delete(path);
        else state.expandedResources.add(path);
        renderRequirements();
      };
    });
  }
  function render() { renderCategories(); renderRankFilter(); renderGradeFilter(); renderSelected(); renderItems(); renderRequirements(); renderStatus(); }

  async function load() {
    try { state.data = await appApi.getCraftingData(); state.status = await appApi.getCraftingStatus(); render(); }
    catch (error) { state.data = { categories: [], items: [] }; state.status = { itemCount: 0, message: `Не удалось открыть локальную базу: ${error.message}` }; render(); }
  }
  function showModal() { $('updateResult').textContent = ''; $('updateModal').showModal(); $('updateToken').focus(); }

  $('itemSearch').oninput = e => { state.query = e.target.value; renderItems(); };
  $('rankFilter').onchange = e => { state.rank = e.target.value; renderItems(); };
  $('gradeFilter').onchange = e => { state.grade = e.target.value; renderItems(); };
  $('talentProcessing').onchange = e => { state.crafterTalents.processing = e.target.checked; renderRequirements(); };
  $('talentMaterials').onchange = e => { state.crafterTalents.materials = e.target.checked; renderRequirements(); };
  $('talentCostReduction').onchange = e => { state.crafterTalents.costReduction = e.target.checked; renderRequirements(); };
  $('clearSelection').onclick = () => { state.selected.clear(); renderSelected(); renderItems(); renderRequirements(); };
  $('updateButton').onclick = showModal;
  $('cancelUpdate').onclick = () => $('updateModal').close();
  $('cancelUpdateAction').onclick = () => $('updateModal').close();

  const stopProgress = appApi.onCraftingProgress(progress => { if (progress?.message) $('updateResult').textContent = progress.message; });
  $('updateForm').onsubmit = async e => {
    e.preventDefault(); const token = $('updateToken').value.trim();
    $('confirmUpdate').disabled = true; $('cancelUpdateAction').disabled = true; $('cancelUpdate').disabled = true;
    $('updateResult').textContent = 'Получаем каталоги и карточки предметов…';
    try {
      const result = await appApi.updateCraftingData(token); state.status = result.status;
      if (result.ok && result.changed) { state.data = result.data; state.selected.clear(); $('updateResult').textContent = `Готово. Новая база сохранена локально: ${result.status.itemCount} предметов.`; render(); }
      else if (result.ok) { $('updateResult').textContent = 'Новых изменений нет. Существующая локальная база не изменена.'; renderStatus(); }
      else { $('updateResult').textContent = `Обновление не выполнено. Старая локальная база сохранена. ${result.error || ''}`; renderStatus(); }
    } catch (error) { $('updateResult').textContent = `Ошибка обновления. Локальные данные не изменены. ${error.message}`; }
    finally { $('confirmUpdate').disabled = false; $('cancelUpdateAction').disabled = false; $('cancelUpdate').disabled = false; }
  };

  load();
})();
