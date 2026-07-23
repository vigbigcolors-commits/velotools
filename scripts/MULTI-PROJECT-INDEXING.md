# Multi-Project PSEO + Indexing Playbook

> **Фундамент: безопасность на первом месте.**  
> Этот файл — инструкция «что делать на каждом сайте».  
> Пиши простым языком. Ключи (`sa-key.json`, `.env`) сюда **не вставлять**.

---

## Цель (зачем всё это)

1. **Long-tail SEO** — доминировать по узким запросам утилит/продуктивности (много конкретных фраз с малым конкурентом).
2. **Быстрее в индекс Google** — через **Indexing API** (запрос Google: «проверь эти URL», не покупка позиций).
3. **Без дыр в безопасности** — XSS (вредоносный JS из URL), утечка ключей, утечка данных пользователя.

---

## Жёсткие правила (на ВСЕ проекты)

Копируй эти правила в `.cursorrules` / чат агента **до** любой генерации кода.

### 1) Zero-Backend Privacy
Утилиты (таймеры, генераторы, калькуляторы) работают **только в браузере**.  
Введённые данные пользователя **не отправлять** на сервер.

### 2) SSR-Shell (серверная оболочка)
Сервер/сборка отдаёт только:
- meta / title / canonical  
- JSON-LD (микроразметка для Google)  
- **зашитый** безопасный пресет  

Логика инструмента «оживает» на клиенте (**hydration** = подключение JS к готовому HTML).

> На VeloTools это сделано статической сборкой (`/tools/.../index.html`), не обязательно Next.js.  
> На других проектах можно Next.js **или** тот же static-shell подход — правило одно: клиент **не читает сырой URL**.

### 3) Strict Sanitization (жёсткая очистка)
Любые параметры из URL / роута → только через **Zod** (схема-валидатор).  
`.strict()` — отклонять лишние поля (защита от XSS и prototype pollution).

### 4) Anti-doorway — КАЖДАЯ страница уникальна (HARD)

**Правило на любой масштаб: 30, 2 000 или 10 000 URL.**

Каждая страница = уникальный продукт, не копия с другим словом в title.

Обязательно уникальны (сборка падает при дубле):
- `title`, `h1`, `description`, `intentBanner`
- `editorial.lead`, `h2`, `whyPreset`, `workflowTip`
- каждый `faq.question`
- состояние виджета внутри одной профессии×инструмента (таймеры + тема + звук)

Запрещено:
- один длинный SEO-текст на много URL  
- «почти те же» абзацы с заменой DevOps → Designer  
- страницы только ради индекса без реального различия инструмента  

Иначе Google видит **scaled/doorway content** (массовый мусор) → фильтр / просадка.

Как масштабировать до тысяч без мусора:
1. Больше осей фактов (ниша × задача × пресет × язык × ограничение инструмента)  
2. Текст собирать из **уникальных фактов**, не из одного шаблона-абзаца  
3. Каждый новый URL обязан пройти `parseMatrix` + audit  
4. Публиковать дозированно (sitemap limit), не вываливать 10k за день  

### 5) Секреты
- `.cursorignore` + `.gitignore`: `.env*`, `*-key.json`, `secrets/`, `sa-key.json`  
- Ключ сервисного аккаунта **никогда** в git и в чат ИИ  
- Indexing Worker — отдельная папка, лог в SQLite, лимит **2000 URL/день**

### 6) Monetization-trick с AdBlock
**Не применять.** Обход блокировщиков скрытой «нативной» ссылкой бьёт по доверию и нарушает дух Zero-Backend Privacy / «без обмана».

---

## Что общее, что своё

| Компонент | Общее на все проекты? | Пояснение |
|-----------|------------------------|-----------|
| Google Cloud проект `velotools-indexing` | ✅ да | Один проект |
| Web Search Indexing API (включён) | ✅ да | Один API |
| Service Account `velotools-indexer@...` | ✅ да | Один робот-ключ |
| Файл `sa-key.json` локально | ✅ тот же ключ | Не коммитить |
| Search Console свойство | ❌ **на каждый домен** | Owner = этот SA |
| Sitemap сайта | ❌ свой | Свои URL |
| PSEO-матрица / страницы | ❌ своя | Свои профессии×инструменты |
| Репозиторий / деплой | ❌ свой | Отдельный код сайта |

**Ответ на вопрос «нужен ли новый Indexing API на каждый проект?» → НЕТ.**  
Нужно: Search Console Owner + sitemap + (опционально) дописать воркер под второй sitemap.

---

## Эталон: что уже сделано на VeloTools

Используй как образец, не копируй слепо текст страниц.

| Шаг | Статус VeloTools | Где смотреть |
|-----|------------------|--------------|
| 1. State Matrix + Zod | ✅ 30 записей | `scripts/seo-data/matrix/` |
| 2. SSR-shell + hydrate | ✅ `/tools/[profession]/[tool]/` | `tools/`, `focus/js/pseo-hydrate.js` |
| 3. Indexing Worker | ✅ 36 URL отправлено | `scripts/indexing-worker/` |
| Anti-doorway unique copy | ✅ | `scripts/seo-data/matrix/editorials.mjs` |
| `.cursorignore` | ✅ | корень репо |

Примеры живых URL:
- https://velotools.app/tools/backend-developer/focus-room/
- https://velotools.app/tools/devops-engineer/focus-room/
- https://velotools.app/tools/copywriter/focus-room/

---

## Чеклист на КАЖДЫЙ новый проект

Делай по порядку. Не перескакивай.

### A. Подготовка безопасности (день 0)
- [ ] В корне проекта: `.cursorignore` с `.env*`, `*-key.json`, `secrets/`
- [ ] В `.gitignore`: то же + `sa-key.json` / `*.sqlite` воркера
- [ ] Правило: утилиты = client-only, без отправки пользовательского ввода

### B. Шаг 1 — State Matrix (матрица состояний)
- [ ] Определить оси: **Профессия/ниша × Инструмент × Пресет**
- [ ] Zod-схема `.strict()` + reject HTML в текстах
- [ ] 15–30 реалистичных записей (не фейковые «lorem»)
- [ ] Уникальные `title`, `h1`, `lead`, FAQ на каждую запись
- [ ] Пресет реально меняет UI (не только текст)

### C. Шаг 2 — SSR-Shell + Hydration
- [ ] Страницы вида `/tools/...` или аналог под архитектуру проекта
- [ ] Meta + canonical + JSON-LD `SoftwareApplication` (+ FAQPage если есть FAQ)
- [ ] Клиент читает **только** серверно проверенный конфиг (`#vt-page-config` / props), **не** `location.search`
- [ ] Цифры в UI = пресет (запрет «таймер 50, подпись 25 min»)
- [ ] Audit-скрипт: все страницы собраны, уникальность lead/h2/title

### D. Шаг 3 — Indexing (подключение к уже готовому API)
- [ ] Домен добавлен в [Google Search Console](https://search.google.com/search-console)
- [ ] Пользователь/права → добавить Owner:
  ```
  velotools-indexer@velotools-indexing.iam.gserviceaccount.com
  ```
- [ ] Sitemap на проде отдаёт 200 и содержит новые URL
- [ ] Воркер: указать sitemap этого домена (или multi-sitemap список)
- [ ] Сначала `--dry-run`, потом боевой прогон
- [ ] Проверить sqlite-лог: `ok` / ошибки `403` (часто = нет Owner в GSC)

### E. Деплой и контроль
- [ ] Commit **без** ключей
- [ ] Live URL = 200 (не 404)
- [ ] GSC → проверка 2–3 URL (Инспекция URL)
- [ ] Не раздувать сотни почти одинаковых страниц за один день

---

## Реестр проектов (заполнять по факту)

| id | Домен (прод) | GSC | SA = Owner | Sitemap | Matrix/PSEO | Indexing run | Статус |
|----|--------------|-----|------------|---------|-------------|--------------|--------|
| **velotools** | https://velotools.app | ✅ | ✅ | ✅ | ✅ | ✅ 2026-07-23 | **live** |
| **herminox** | _вписать URL_ | ❌ | ❌ | ❌ | ❌ | ❌ | backlog |
| **oneirox** | _вписать URL_ | ❌ | ❌ | ❌ | ❌ | ❌ | backlog |
| **patientbillguide** | _вписать URL_ | ❌ | ❌ | ❌ | ❌ | ❌ | backlog |

### Как заполнять строку проекта
1. Впиши точный прод-домен.  
2. Отметь галочки только после реальной проверки (не «кажется»).  
3. В «Статус» пиши: `backlog` → `in_progress` → `live`.

---

## Промпты для Cursor (копировать в чат на новом репо)

### Шаг 1 — Matrix + Zod
```
Generate a strictly typed dataset for this project's PSEO matrix. Use Zod with .strict().
Axes: Niche_or_Profession x Tool_Name x Default_Config.
Generate realistic entries (start with 15–30). Reject unexpected keys (XSS / prototype pollution).
Every entry must include unique title, h1, lead, whyPreset, and FAQ (anti-doorway).
Zero-Backend Privacy: configs only for client-side tools; no user data collection.
```

### Шаг 2 — SSR shell + hydrate
```
Create SSR-shell pages for PSEO routes (Next.js App Router OR static HTML build — match this repo).
1) Strict SSR meta + canonical
2) JSON-LD SoftwareApplication
3) Client hydrate from server-validated config only — never read raw URL params on the client
4) UI labels must match preset numbers exactly
```

### Шаг 3 — Indexing worker
```
Use/extend the standalone Google Indexing worker (googleapis).
Read sitemap.xml (or list of sitemaps). Max 2000 URLs/day. Exponential backoff on HTTP 429.
Credentials ONLY from env or local sa-key.json (gitignored). Log to sqlite, not secrets to console.
```

---

## Порядок работ «завтра / следующие дни»

### Сначала добить VeloTools
1. `matrix:publish` — оставшиеся 15 URL в sitemap (дневной лимит)  
2. Повторный indexing-run  
3. GSC: инспекция 3 `/tools/...` URL  

### Потом следующий проект (один за раз)
Рекомендуемый порядок: **herminox → oneirox → patientbillguide**  
(или тот, у кого уже есть живой домен + Search Console)

На выбранном проекте:
1. Секция **A** (ignore/секреты)  
2. **B → C** (матрица + страницы)  
3. **D** (GSC Owner + indexing)  
4. Обновить таблицу реестра в этом файле  

---

## Типичные ошибки (не повторять)

| Ошибка | Почему плохо | Как правильно |
|--------|--------------|---------------|
| Один SEO-текст на 30 URL | Doorway / фильтр | Уникальный editorial + разный state |
| Клиент читает `?focus=50` из URL | XSS / подмена | Только Zod → props/config |
| Ключ в репозитории | Угон API | Только local `sa-key.json` + gitignore |
| Indexing без Owner в GSC | 403 | SA = Owner на КАЖДОМ домене |
| Новый Cloud API «на каждый сайт» | Лишняя сложность | Один API, много GSC-свойств |
| AdBlock-обход аффилиатом | Обман / риск | Не делать |

---

## Команды VeloTools (шпаргалка)

```bash
npm run matrix:validate
npm run matrix:build
node scripts/pseo/audit-matrix.mjs
npm run matrix:publish -- --limit=15

cd scripts/indexing-worker
npm run dry-run
npm start
node ../indexing-worker/report.mjs
```

---

**Владелец файла:** обновляй реестр и галочки после каждого реального шага.  
**Правило агента:** не давать пользователю ручные задачи, которые агент может проверить сам — только отчёт.
