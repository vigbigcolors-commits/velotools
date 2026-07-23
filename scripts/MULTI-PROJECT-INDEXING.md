# Multi-project Indexing & tomorrow plan

> Обновляй статус после каждого дня. Не класть ключи в этот файл.

## Нужен ли отдельный Indexing API на каждый проект?

**Нет.** Один Google Cloud проект + один включённый **Web Search Indexing API** хватает.

Но для **каждого сайта** отдельно нужно:

| Что | VeloTools | Herminox | Oneirox | PatientBillGuide |
|-----|-----------|----------|---------|------------------|
| Свой домен в Search Console | ✅ velotools.app | нужно | нужно | нужно |
| Service account как **Owner** в GSC | ✅ | нужно | нужно | нужно |
| Sitemap с URL сайта | ✅ | нужно | нужно | нужно |
| Воркер знает sitemap/домен | ✅ | добавить | добавить | добавить |

Один и тот же `sa-key.json` / `velotools-indexer@...` можно использовать на всех сайтах — просто добавить его Owner в каждый Search Console.

Отдельный Cloud-проект на каждый бренд **не обязателен** (удобнее один `velotools-indexing`).

---

## Реестр сайтов

| id | Домен | Search Console | Owner SA | Sitemap | Воркер | Статус |
|----|-------|----------------|----------|---------|--------|--------|
| velotools | https://velotools.app | ✅ | ✅ | ✅ | ✅ 36 URL отправлено 2026-07-23 | live |
| herminox | (уточнить URL) | ❌ | ❌ | ❌ | ❌ | backlog |
| oneirox | (уточнить URL) | ❌ | ❌ | ❌ | ❌ | backlog |
| patientbillguide | (уточнить URL) | ❌ | ❌ | ❌ | ❌ | backlog |

---

## Завтра (VeloTools + подготовка других)

### VeloTools
1. Проверить в GSC индексацию `/tools/...` (URL Inspection на 2–3 страницы)
2. Добить sitemap: остальные 15 matrix URL (`npm run matrix:publish`)
3. Повторный indexing-run после sitemap
4. QA пресетов: таймер / режим / SEO-цифра минут **совпадают** (баг 25min vs 50 — фикс сегодня)
5. При необходимости: e2e smoke на 3 profession-страницы

### Другие проекты (если домены готовы)
1. Записать точные прод-URL в таблицу выше
2. Подтвердить/добавить свойства в Search Console
3. Добавить `velotools-indexer@velotools-indexing.iam.gserviceaccount.com` как Owner
4. Расширить воркер: список sitemap’ов (multi-site), лимит 2000/день на весь аккаунт
5. Не создавать новый API — только новые GSC-свойства

---

## 3 примера новых ссылок VeloTools

1. https://velotools.app/tools/backend-developer/focus-room/ — Backend · 50/10 · midnight · lofi  
2. https://velotools.app/tools/devops-engineer/focus-room/ — DevOps · 45/10 · jade · rain  
3. https://velotools.app/tools/copywriter/focus-room/ — Copywriter · 25/5 · teal · cafe  

---

## Заметки по качеству (обязательно)

- Пресет из матрицы = цифры на таймере = подписи Focus/Short/Long = блок «N min» внизу
- Никакого «зашитого 25» на PSEO-страницах с другим таймингом
- Ключи только в `scripts/indexing-worker/sa-key.json` (gitignore), никогда в git/чат
