# Show HN: VeloTools.app — Launch Kit

> Домен: **https://velotools.app** (не velotoolx).  
> Цель: грамотный релиз на Hacker News без фильтров и без противоречия бренду Zero-Backend Privacy.

---

## Вердикт инженера (сначала правда)

| Тема | Статус | Комментарий |
|------|--------|-------------|
| Hug of Death (скачок трафика) | ✅ сильная позиция | Статика на **Cloudflare CDN** — нет своей БД у утилит, файлы не грузятся на сервер |
| Show HN формат | ✅ готов | Ниже готовые title + first comment |
| Email CTA на главной | ⚠️ **не ставить «как у SaaS»** | Сайт кричит *No signup / we don't ask for email*. HN это заметит и сожжёт |
| Lifetime Deal $50–100 | ⚠️ позже, не в день Show HN | Сначала доказать продукт; иначе «bait-and-switch» |
| Hidden B2B API paywall | ❌ ещё нет API | Не обещать в посте то, чего нет |
| Ring-voting | 🚫 запрещено | Только organic через `/newest` |

**Вывод:** Show HN делаем как **privacy-first browser tools** (клиентские утилиты). Монетизацию — отдельным честным этапом после интереса, не в первом комментарии как «купите lifetime».

---

## Конфликт с Product Hunt (Oneirox)

Oneirox.com → Product Hunt **вторник**.  
**Не публикуй Show HN в тот же вторник.**

Оптимум для VeloTools Show HN:
- **Среда или четверг**, **15:00–17:00 UTC**  
  (= 19:00–21:00 по Еревану / UTC+4)
- Лучше **среда после PH-вторника**, когда внимание не размазано на два запуска

---

## 1) Заголовок (Show HN)

Правила: сухо, без кликбейта, конкретная боль + как решено.

### Вариант A (рекомендую)
```
Show HN: VeloTools – browser tools that never upload your files
```

### Вариант B (техничнее)
```
Show HN: VeloTools – client-side PDF/image tools + Focus Room (Wasm/Canvas)
```

### Вариант C (короче)
```
Show HN: Privacy-first utility suite that runs entirely in the browser
```

URL сабмита: `https://velotools.app/`  
(Можно вторым постом/в тексте дать deep-link на один сильный tool, напр. `/focus/` или `/compress-pdf/` — но **главная ссылка поста = homepage**.)

---

## 2) Submission statement (первый комментарий — сразу после поста)

Скопируй целиком. Тон HN: прозрачность + самокритика.

```text
Author here. Happy to answer questions.

What it is
VeloTools is a small suite of browser utilities (image compress, PDF compress/merge/split/unlock, invoice PDF, QR, background remover, Focus Room timer). Processing runs in the browser (Canvas / WebAssembly / pdf-lib). Files are not uploaded to our servers — by design, not by marketing claim.

Why we built it
Most “free” tools are upload-to-server wrappers. That fails for confidential docs, offline-ish workflows, and people who simply don’t want another account. We wanted the opposite architecture: ship UI + client engines, keep user bytes on-device.

How it’s built
Static site on Cloudflare. Tools are mostly vanilla JS + Wasm where needed. Focus Room and some SEO landing variants were built/iterated heavily in Cursor. For long-tail pages we use a locked preset matrix (profession × tool × config) validated with Zod so URL segments can’t inject arbitrary state (XSS / parameter tampering). Indexing is handled by a separate worker talking to Google Indexing API with credentials kept out of the repo.

What we’re unsure about / tradeoffs
- “No signup” is a feature and a constraint: we don’t have accounts, sync, or a hosted API yet.
- Ads exist on some pages; core tools stay free. We haven’t shipped a paid tier because we don’t want to break the privacy story with fake walls.
- Background remover’s first run downloads a model (~tens of MB) — subsequent runs are fast from cache; cold start still feels heavy.
- Mobile Safari audio / large PDF batches still have sharp edges.

Happy to hear what you’d change first, or which tool you’d trust (or not trust) with real client files.
```

---

## 3) Правила площадки (чеклист перед постом)

- [ ] Заголовок начинается с **`Show HN:`**
- [ ] Нет CAPS, нет «revolutionary», нет «destroy Dropbox»
- [ ] Первый комментарий = statement выше (в первые минуты)
- [ ] Ты онлайн 2–3 часа отвечать на тред
- [ ] Друзьям: «зайдите на https://news.ycombinator.com/newest и найдите пост сами» — **не** кидать прямую ссылку на item для голоса
- [ ] Не просить upvote в Telegram/Discord чатах пачкой
- [ ] Не постить тот же URL повторно неделю за разом

---

## 4) Инфра под Hug of Death

У вас уже хорошо:

| Слой | Почему ок |
|------|-----------|
| Cloudflare CDN | Статика кэшируется по краю |
| Нет upload backend | Нет очереди файлов / диска |
| Client-side tools | CPU у пользователя, не у вас |
| Indexing worker отдельно | Не в hot path главной |

Перед запуском (сам проверь / агент проверит по запросу):

1. Cloudflare: кэш для HTML/CSS/JS, Always Online по возможности  
2. Не деплоить тяжёлые изменения в час X  
3. AdSense/analytics не должны блокировать first paint  
4. Иметь запасной статус: если CDN ок — сайт жив даже при всплеске  

**Не нужно** поднимать «агрессивную защиту API», пока нет своего API.

---

## 5) CTA на главной — что можно / нельзя для HN

### Нельзя в день Show HN
- «Enter email to unlock tools»
- Fake scarcity Lifetime Deal
- Paywall на то, что в FAQ названо free forever

### Можно (честный CTA)
Главный CTA = **использование продукта**:
- кнопки/карточки: Try Image Compress / Focus Room / PDF Compress  
- вторичный: Privacy page, About  

Опционально **после** хорошего треда (не обязательный блок в день 0):
- «Follow updates» через отдельную страницу / X / GitHub — без блокировки инструментов  

### Lifetime Deal / B2B — когда уместно

Только когда есть **реальная** платная ценность, не ломающая Zero-Backend:

| Идея | Совместимо с privacy? | Когда |
|------|------------------------|-------|
| Lifetime: pack локальных пресетов / desktop PWA bundle / priority feature roadmap vote | да, если без обязательного аккаунта для free tools | через 2–4 недели после HN |
| B2B: self-hosted / air-gap license / on-prem static mirror | да | когда попросят компании |
| Hosted API batch | нет, пока нет API и это меняет модель | не обещать сейчас |
| Email gate на free compress | **нет** | противоречит бренду |

Формулировка для себя:  
**Free tools stay free and local. Paid = optional extras, never ransom of current features.**

---

## 6) Пошаговый день релиза

### T−48ч
- [ ] Выбрать title (A/B/C)
- [ ] Прогнать homepage + 3 tools на телефоне/десктопе
- [ ] Ответы на FAQ готовы (privacy, Wasm size, ads)

### T−2ч
- [ ] Залогинен в HN
- [ ] Statement в буфере обмена
- [ ] Никаких деплоев

### T0 (Wed/Thu 15:00–17:00 UTC)
1. Submit → Show HN + URL  
2. Сразу first comment = statement  
3. Отвечать по делу, коротко, с фактами  

### T+24ч
- [ ] Собрать возражения из треда → backlog  
- [ ] Не запускать Lifetime Deal в эмоциях от трафика  

---

## 7) Связка с Oneirox PH

| День | Oneirox | VeloTools |
|------|---------|-----------|
| Вторник | Product Hunt live | **тишина** (не Show HN) |
| Среда 15–17 UTC | поддержка PH organically | **Show HN VeloTools** |
| Четверг | follow-up PH | ответы в HN-треде |

Не мешать аудитории и свою энергию на два «дня нуля».

---

## 8) Готовый текст для друзей (без ring-vote)

```text
Закинул Show HN про VeloTools. Если интересно — зайди на news.ycombinator.com/newest,
найди пост сам и почитай. Прямую ссылку на голос лучше не открывать — HN это пессимизирует.
```

---

**Статус документа:** ready to post (copy + timing).  
**Не сделано намеренно:** email form / Lifetime checkout — сначала честный Show HN, потом монетизация без противоречия privacy.
