Odium Stats Viewer — Windows FIX v2
===================================

Исправляет:
  spawnSync npx.cmd EINVAL

Причина:
  Windows не всегда позволяет Node.js spawnSync напрямую запускать .cmd-файл
  npx.cmd с shell:false.

Исправление:
  Wrangler запускается напрямую через установленный Node.js:
  node node_modules/wrangler/bin/wrangler.js ...

Установка:
1. Скопируйте package.json в папку cloudflare-stats с заменой.
2. Скопируйте папку scripts в cloudflare-stats с заменой.
3. wrangler.jsonc НЕ заменяйте.
4. Если node_modules уже есть, npm install повторно не нужен.

Проверка:
  npm run stats
  npm run stats:today
  npm run stats:history
