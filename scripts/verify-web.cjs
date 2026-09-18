const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const read = p => fs.readFileSync(path.join(root, p), 'utf8');
const json = p => JSON.parse(read(p));
const need = p => {
  const full = path.join(root, p);
  if (!fs.existsSync(full)) throw new Error(`Нет обязательного файла: ${p}`);
};
[
  'index.html', 'manifest.webmanifest', 'service-worker.js',
  'map/index.html', 'map/resource-map.html', 'map/craft.html', 'map/talents.html', 'map/alchemy.html',
  'map/web-bridge.js', 'map/styles.css', 'map/app.js', 'map/craft.js', 'map/talents.js', 'map/alchemy.js',
  'data/web-bundle.js', 'data/crafting.json', 'data/alchemy.json', 'data/squads.json', 'data/raid-bosses.json',
  'map/assets/world-map.png', 'map/assets/odium-world-icon.png'
].forEach(need);

const crafting = json('data/crafting.json');
const alchemy = json('data/alchemy.json');
const squads = json('data/squads.json');
const raids = json('data/raid-bosses.json');
if (crafting.items?.length !== 1131) throw new Error(`Крафт: ожидалось 1131, получено ${crafting.items?.length}`);
if (alchemy.items?.length !== 53) throw new Error(`Алхимия: ожидалось 53, получено ${alchemy.items?.length}`);
if (squads.items?.length !== 18) throw new Error(`Сквады: ожидалось 18, получено ${squads.items?.length}`);
if (raids.items?.length !== 52) throw new Error(`Рейдовые боссы: ожидалось 52, получено ${raids.items?.length}`);
const drev = raids.items.find(x => x.name === 'Древобород');
if (!drev || Number(drev.id) !== 1101) throw new Error('Древобород должен иметь Wiki ID 1101');

for (const page of ['map/index.html','map/resource-map.html','map/craft.html','map/talents.html','map/alchemy.html']) {
  const html = read(page);
  if (!html.includes('../data/web-bundle.js') || !html.includes('web-bridge.js')) throw new Error(`${page}: нет web bridge`);
  if (!html.includes('../manifest.webmanifest')) throw new Error(`${page}: нет manifest`);
}
const menu = read('map/index.html');
if (!menu.includes('Полезные функции') || !menu.includes('disabled')) throw new Error('Нет неактивной кнопки «Полезные функции»');
const bridge = read('map/web-bridge.js');
if (!bridge.includes("const VERSION = '1.6.9'")) throw new Error('Web bridge: неверная desktop-версия');
if (!bridge.includes("const WEB_VERSION = '0.1'")) throw new Error('Web bridge: неверная web-версия');

console.log('Web prototype verify: OK');
console.log('Desktop base: 1.6.9');
console.log('Web prototype: 0.1');
console.log(`Crafting: ${crafting.items.length}`);
console.log(`Alchemy: ${alchemy.items.length}`);
console.log(`Squads: ${squads.items.length}`);
console.log(`Raid bosses: ${raids.items.length}`);
