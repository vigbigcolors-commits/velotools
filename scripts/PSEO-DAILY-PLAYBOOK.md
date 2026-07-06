# VeloTools — Stateful pSEO: ежедневный playbook

> **Как пользоваться:** в чате пишешь `День 2` (или `День 3`) — агент читает этот файл, выполняет блок дня, пишет «готово, деплой».
>
> Обновляй секцию **«Текущий статус»** после каждого дня (или агент обновит сам).

---

## Текущий статус (на 2026-07-06)

| Метрика | Значение |
|---------|----------|
| **Сегодняшний день плана** | День 1 завершён → следующий **День 2** |
| **Опубликовано в sitemap** | 2 / 15 слотов за сегодня |
| **published** | `compress-pdf-for-gmail`, `compress-pdf-for-canvas` |
| **built (ждут publish)** | `image-resizer-for-amazon`, `image-resizer-for-etsy`, `image-resizer-for-ozon` |
| **draft** | 0 |
| **Production** | Stateful-страницы **ещё не задеплоены** (только локально + sitemap в репо) |

---

## Принцип (коротко)

1. **Факты** → JSON (`platforms*.json`, `formats.json`), не ручные SEO-тексты.
2. **Интент** → JSON (`intents/*.json`) + `widget` (пресет UI) + `publishStatus`.
3. **Сборка** → `npm run pseo:build` (HTML + `#vt-page-config`).
4. **Публикация** → `npm run pseo:publish` (до 15 URL/день в `sitemap.xml`).
5. **Деплой** → git push на velotools.app.

**Zero-Doorway:** URL меняет **состояние виджета** (locked preset, размеры, лимит MB), не только текст.

---

## Команды (каждый день)

```bash
# Очередь
npm run pseo:status

# Проверка JSON перед сборкой
npm run pseo:validate

# Собрать HTML для draft → built
npm run pseo:build

# Добавить built-страницы в sitemap (лимит 15/день)
npm run pseo:publish
npm run pseo:publish -- --limit=3    # явный лимит

# Полный цикл
npm run pseo:daily

# Одна страница
node scripts/pseo-pipeline.mjs build --slug=image-resizer-for-amazon

# Тесты (виджет реально меняется)
npx playwright test tests/e2e/stateful-pseo.spec.mjs
npx playwright test tests/e2e/pdf-tools.spec.mjs

# JSON-LD
node scripts/validate-ldjson.mjs

# Аудит PDF-страниц (локально, нужен serve :3000)
node scripts/audit-pdf-tools.mjs
```

---

## Карта файлов

```
scripts/
  PSEO-DAILY-PLAYBOOK.md     ← этот файл
  pseo-pipeline.mjs          ← CLI: status | validate | build | publish | daily
  pseo/
    build.mjs                ← HTML из intent + fact-copy
    publish.mjs              ← sitemap + publish-state
    validate.mjs             ← проверка фактов
    intents.mjs              ← чтение/запись intents
  seo/
    fact-copy.mjs            ← текст из фактов (без «лучший/быстрый»)
  seo-data/
    formats.json             ← HEIC, JPG, PDF…
    platforms.json           ← Gmail, Canvas… (PDF)
    platforms-image.json     ← Amazon, Etsy, Ozon…
    publish-state.json       ← dailyLimit, publishedToday
    intents/
      compress-pdf.json
      image-resizer.json

pdf-tools/compress.js        ← читает #vt-page-config (PDF)
image-compress/js/page-config.js  ← читает #vt-page-config (image)

/{slug}/index.html           ← сгенерированные stateful-страницы
```

---

## Схема intent (шаблон)

### PDF (compress-pdf)

```json
{
  "slug": "compress-pdf-for-OUTLOOK",
  "tool": "compress-pdf",
  "toolMode": "compress",
  "platform": "outlook-web",
  "formatIn": "pdf",
  "formatOut": "pdf",
  "publishStatus": "draft",
  "title": "...",
  "h1": "...",
  "h1Em": "...",
  "widget": {
    "preset": "web",
    "quality": 65,
    "dpi": 96,
    "maxOutputBytes": 20971520,
    "lock": ["preset", "dpi"],
    "limitWarning": "..."
  },
  "intentBanner": "..."
}
```

### Image (marketplace)

```json
{
  "slug": "image-resizer-for-PLATFORM",
  "tool": "image-compress",
  "toolMode": "image-resize",
  "platform": "amazon-product-image",
  "formatIn": "jpg",
  "formatOut": "jpg",
  "publishStatus": "draft",
  "widget": {
    "aspectRatio": 1,
    "outputWidth": 2000,
    "outputHeight": 2000,
    "lockDimensions": true,
    "lockAspect": true,
    "quality": 85,
    "format": "jpeg",
    "maxOutputBytes": 10485760,
    "lock": ["aspect", "dimensions", "quality"],
    "limitWarning": "...",
    "activePanel": "compress"
  },
  "intentBanner": "..."
}
```

`title` / `description` / `heroLead` — опциональны; генератор соберёт из фактов.

---

## publishStatus — жизненный цикл

```
draft  →  build  →  built  →  publish  →  published
```

- **draft** — только JSON, HTML нет.
- **built** — `/{slug}/index.html` на диске, в sitemap ещё нет.
- **published** — URL в `sitemap.xml`, `publishedAt` в intent.

---

# ДЕНЬ 1 — выполнено ✅

**Дата:** 2026-07-06

### Архитектура и ядро PDF
- [x] `pdf-core/` — engine, utils, shared.css
- [x] Инструменты P0: compress, merge, split, unlock, pdf-to-jpg
- [x] compress-pdf SEO-шаблон (`#security`, `#how-it-works`, `#tech-specs`, `#deep-dive`, `#faq`)
- [x] Удалён legacy: `pdf-compress/app.js`, `pdf-compress/style.css`
- [x] E2E PDF: `tests/e2e/pdf-tools.spec.mjs` (7 тестов, incl. 105-page)

### Stateful pSEO (фундамент)
- [x] `scripts/seo-data/formats.json`
- [x] `scripts/seo-data/platforms.json` (Gmail, Canvas, Blackboard…)
- [x] `scripts/seo-data/platforms-image.json` (Amazon, Etsy, Ozon)
- [x] `scripts/seo/fact-copy.mjs` — контент из фактов
- [x] `scripts/pseo-pipeline.mjs` — validate / build / publish / daily
- [x] `compress.js` — `applyPageConfig`, limit warning
- [x] `image-compress/js/page-config.js` — размеры, aspect, quality lock
- [x] Пилоты PDF: `compress-pdf-for-gmail`, `compress-pdf-for-canvas`
- [x] Пилоты Image: `image-resizer-for-amazon`, `etsy`, `ozon`
- [x] E2E stateful: `tests/e2e/stateful-pseo.spec.mjs` (3 теста)

### Публикация (локально)
- [x] `pseo:publish` — 2 URL в sitemap (gmail, canvas)
- [x] Осталось 13 слотов на 2026-07-06 (если публикуешь в тот же день)
- [ ] **Деплой на velotools.app** — не сделан

### Что сказать агенту для Дня 2
```
День 2
```

---

# ДЕНЬ 2 — план (следующая сессия)

**Цель:** опубликовать image-страницы, прогнать проверки, **деплой**.

### Задачи агента
1. [ ] `npm run pseo:publish` — добавить в sitemap 3 image URL (amazon, etsy, ozon)
2. [ ] `npm run pseo:validate`
3. [ ] `npx playwright test tests/e2e/stateful-pseo.spec.mjs`
4. [ ] `node scripts/validate-ldjson.mjs` (новые страницы)
5. [ ] Обновить `scripts/PSEO-DAILY-PLAYBOOK.md` — статус День 2
6. [ ] Сообщить: **готово, деплой** + список URL + команды git

### Задачи тебя (после «готово, деплой»)
```bash
git add scripts/seo-data/ compress-pdf-for-* image-resizer-for-* sitemap.xml
git commit -m "pSEO Day 2: publish image marketplace pages"
git push
```

### Проверка после деплоя
```bash
# Локально или live
curl -sI https://velotools.app/image-resizer-for-amazon/ | head -1
AUDIT_BASE=https://velotools.app node scripts/audit-pdf-tools.mjs
```

Открыть в браузере:
- https://velotools.app/image-resizer-for-amazon/ — баннер Amazon, 2000×2000 locked
- https://velotools.app/compress-pdf-for-gmail/ — Web preset locked

### Опционально (если останется время в День 2)
- [ ] Добавить 1 платформу в `platforms.json`: `outlook-web` → intent `compress-pdf-for-outlook` (draft)
- [ ] Пометить `compress-jpg-online/` как `noindex` или редирект на stateful (дорвей-страница)

---

# ДЕНЬ 3 — план

**Цель:** расширить матрицу PDF + ещё 10–15 publish.

### Новые факты (добавить в JSON вручную или с агентом)
- [ ] `platforms.json`: outlook-web, blackboard (уже есть) → новые intents
- [ ] `compress-pdf-for-outlook` (20 MB, web preset)
- [ ] `compress-pdf-for-blackboard` (10 MB, screen preset)

### Pipeline
```bash
npm run pseo:validate
npm run pseo:build
npm run pseo:publish -- --limit=10
npm run pseo:daily   # если всё в draft
```

### Деплой + GSC
- [ ] Push
- [ ] Google Search Console → запрос индексации для 5–10 новых URL (не все 500 сразу)

---

# ДЕНЬ 4 — план

**Цель:** Image marketplace batch #2.

### Платформы (research → `platforms-image.json`)
- [ ] Shopify product image (2048×2048, 1:1, 20 MB)
- [ ] eBay listing photo
- [ ] Walmart Marketplace

### Intents
- [ ] `image-resizer-for-shopify` (draft)
- [ ] `image-resizer-for-ebay` (draft)

```bash
npm run pseo:build
npm run pseo:publish -- --limit=15
```

---

# ДЕНЬ 5 — план

**Цель:** Format conversion pSEO (HEIC→JPG) — data-driven.

- [ ] Intent type `convert` в `fact-copy.mjs` (уже есть логика transparency warning)
- [ ] `intents/convert-heic-to-jpg.json` + страница на базе image-compress
- [ ] Widget: `formatIn: heic`, `formatOut: jpg`, auto WebP off, quality 85

---

# ДЕНЬ 6–7 — план

- [ ] 10 PDF platform intents (email + LMS + government из `platforms.json`)
- [ ] E2E: limit warning при файле > maxOutputBytes
- [ ] CI: `pseo:validate` + playwright в GitHub Actions (опционально)

---

# ДЕНЬ 8–14 — план

- [ ] Не более **15 новых URL в sitemap в сутки**
- [ ] Каждую неделю: 2–3 **ручных** EEAT-страницы (не generated) для ссылочного веса
- [ ] Мониторинг GSC: Coverage, «Doorway» manual actions — не должно быть

---

## Чеклист деплоя (каждый день с публикацией)

- [ ] `npm run pseo:status` — published вырос
- [ ] `sitemap.xml` содержит новые `<loc>`
- [ ] Playwright stateful зелёный
- [ ] Нет секретов в коммите
- [ ] `git push`
- [ ] Проверить 1–2 URL на live после CDN

---

## Антипаттерны (не делать)

| ❌ | ✅ |
|----|-----|
| 500 страниц с одним виджетом | Уникальный `widget` per platform |
| Ручные SEO-простыни | Только `fact-copy.mjs` |
| Выложить все URL в sitemap за раз | `publish-state.json` max 15/день |
| `/compress-jpg-online/` → generic tool | Stateful URL или noindex |
| Менять только H1 | Менять `#vt-page-config` + lock UI |

---

## Базовые URL (P0 + stateful)

| URL | Тип |
|-----|-----|
| `/compress-pdf/` | Hand P0 |
| `/merge-pdf/` | Hand P0 |
| `/split-pdf/` | Hand P0 |
| `/unlock-pdf/` | Hand P0 |
| `/pdf-to-jpg/` | Hand P0 |
| `/compress-pdf-for-gmail/` | Stateful published |
| `/compress-pdf-for-canvas/` | Stateful published |
| `/image-resizer-for-amazon/` | Stateful built |
| `/image-resizer-for-etsy/` | Stateful built |
| `/image-resizer-for-ozon/` | Stateful built |

---

## История изменений playbook

| Дата | День | Что сделано |
|------|------|-------------|
| 2026-07-06 | 1 | Архитектура, pipeline, 5 intents, 2 published, 3 built |

---

*После каждого дня: обнови таблицу «Текущий статус» и строку в «История».*
