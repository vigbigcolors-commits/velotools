# VeloTools Revival Audit — 2026-09-24

Scope: read-only application/SEO audit; documentation is the only repository write.

Checkpoint: `main` at `a7afa6134d8ba98a302b337e3f4a80209bc56d84`.

## 1. Executive summary

The live product is available and the current committed static output is internally coherent: 139 HTML routes exist, all 123 sitemap URLs return `200`, all indexable repository routes are in the sitemap, all 309 JSON-LD blocks parse, and representative production metadata matches the repository. Core image/PDF utility tests and the isolated React card build pass.

Revival is nevertheless blocked by four P0 governance/truth failures:

1. generated output cannot be reproduced safely;
2. live Google Analytics behavior contradicts the privacy policy and widespread “no tracking” wording;
3. prominent quantitative/offline/lossless/compliance claims exceed implementation evidence;
4. ordinary tool landing pages are submitted through Google’s Indexing API even though Google limits it to `JobPosting` and livestream `BroadcastEvent` pages.

Do not regenerate, publish pSEO, or deploy an SEO change until P0-1 is fixed and reviewed.

## 2. Git checkpoint

| Item                    | Evidence                                                                                         |
| ----------------------- | ------------------------------------------------------------------------------------------------ |
| Branch                  | `main`                                                                                           |
| HEAD                    | `a7afa6134d8ba98a302b337e3f4a80209bc56d84`                                                       |
| Remote                  | `https://github.com/vigbigcolors-commits/velotools.git`                                          |
| HEAD vs remote          | `origin/main` matched HEAD at audit start                                                        |
| Existing worktree state | `?? .agents/`, `?? AGENTS.md`, `?? velo-growth-desk/`                                            |
| Protection              | untracked items were treated as user WIP; not read as product source, changed, staged or removed |

Recent HEADs: `a7afa61` quality-control hydration fix; `63648f9` six-page search-intent alignment; preceding Focus noindex and PDF fixes. No application commit was created during this audit.

## 3. Actual technology stack

- Primary delivery: committed static HTML/CSS/vanilla JS, browser-only tools.
- React 19 + TypeScript + Vite: only the homepage tool-card micro-bundle under `src/tool-cards/`, built to `dist-tool-cards/` then copied to `js/` and `css/`.
- Data validation: Zod 4 in pSEO matrices.
- Tests: Vitest unit tests, one standalone Node PDF integration script, Playwright E2E specs.
- PDF runtime: `pdf-lib`, `@cantoo/pdf-lib`, PDF.js and JSZip; several are runtime CDN dependencies.
- Image runtime: Canvas APIs plus vendored `@jsquash/webp` WASM fallback.
- Background removal: dynamic remote import of `@imgly/background-removal@1.7.0`, which then obtains its model/runtime assets.
- Package manager: npm; `package-lock.json` is committed.
- Hosting: production headers identify Cloudflare. No `_headers`, `_redirects`, Wrangler, CI or Pages configuration is committed; Git-integrated deployment settings remain external to this repository.
- Rendering: static/SSR-shell HTML with client hydration; no application backend/API route was found.

## 4. Architecture map

```text
hand-authored core HTML + vanilla tool modules
  └── deployed as committed static files

src/tool-cards/**
  → Vite build (dist-tool-cards)
  → scripts/copy-tool-cards.mjs
  → js/tool-card-grid.js + css/tool-card-grid.css

intent JSON + platform facts + handcrafted editorials
  → scripts/pseo/build.mjs
  → 31 compress-PDF + 23 image-resizer HTML pages

Focus matrix entries + editorials (Zod)
  → scripts/pseo/matrix-build.mjs
  → 30 /tools/{profession}/focus-room/... pages

BG matrix entries + editorials (Zod)
  → scripts/pseo/bgremover-matrix-build.mjs
  → 26 /bgremover/for-* pages

all selected HTML
  → scripts/pseo/inject-eeat-rails.mjs (separate, undocumented post-pass)
  → Experience blocks/trust rails

published intent state + matrix publication scripts
  → mutate sitemap.xml
  → optional Google Indexing API worker
```

## 5. Sources of truth

| Area                           | Source                                                                   | Transformation                                      | Output/status                                         |
| ------------------------------ | ------------------------------------------------------------------------ | --------------------------------------------------- | ----------------------------------------------------- |
| Homepage tool cards            | `src/tool-cards/data/toolsData.ts`                                       | Vite + `scripts/copy-tool-cards.mjs`                | generated JS/CSS; claims duplicate HTML/schema truth  |
| Core routes/content            | route `index.html` files                                                 | none                                                | hand-maintained deployed HTML                         |
| PDF tool list                  | `scripts/pdf-tools-registry.json`                                        | scaffold only in `scripts/build-pdf-pages.mjs`      | live pages remain hand-maintained; registry can drift |
| Intent pSEO                    | `scripts/seo-data/intents/*.json`, `*-editorials.mjs`, `platforms*.json` | `scripts/pseo/build.mjs`                            | committed route HTML                                  |
| Focus pSEO                     | `scripts/seo-data/matrix/{entries,editorials,schema}.mjs`                | `matrix-build.mjs`                                  | committed route HTML                                  |
| BG pSEO                        | `scripts/seo-data/bgremover-matrix/*`                                    | `bgremover-matrix-build.mjs`                        | committed route HTML                                  |
| Experience/trust               | `scripts/seo-data/tool-experience.mjs` plus algorithmic PSEO copy        | `inject-eeat-rails.mjs`                             | mutates many existing HTML pages after generation     |
| Metadata/canonical/schema      | core inline HTML; pSEO registries + templates + generator code           | several independent replace pipelines               | valid today, but duplicated truth                     |
| Sitemap                        | committed `sitemap.xml` plus intent/matrix publication scripts           | in-place string mutation                            | correct today; multiple writers                       |
| Robots                         | committed `robots.txt`; per-page inline robots                           | no unified registry                                 | correct sitemap/noindex reconciliation today          |
| Internal links                 | repeated hand HTML + generator sibling loops + EEAT injector             | multiple transformations                            | no single eligibility registry                        |
| Tool capability/privacy claims | tool code, homepage HTML/schema, tool HTML/schema, tool-card data        | none unified                                        | conflicting/unverified claims exist                   |
| Redirects                      | five static HTML shells                                                  | client/meta behavior only                           | production returns `200`, not HTTP redirects          |
| Deployment                     | external Cloudflare configuration                                        | Git integration inferred from live behavior/history | not reproducible from repository alone                |

Root cause: source data exists, but independent post-processing and hand-maintained copies are not composed into one deterministic pipeline.

## 6. Route families

| Family              | Count | Indexable | Source/value/risk                                                                                 |
| ------------------- | ----: | --------: | ------------------------------------------------------------------------------------------------- |
| Core product        |    17 |        17 | real tools/hubs; hand-maintained                                                                  |
| Trust/brand         |     7 |         7 | About, founder, Lab, methodology, privacy, terms                                                  |
| Intent landings     |    80 |        80 | 31 PDF + 23 image + 26 BG generated pages                                                         |
| Focus matrix        |    30 |        19 | 11 duplicate-state pages intentionally `noindex`                                                  |
| Legacy alias shells |     5 |         0 | `/background/`, `/compress/`, `/pdf/`, `/pdf-compress/`, `/pdf-compressor/`; `200` soft redirects |
| Total               |   139 |       123 | 16 `noindex`; sitemap contains exactly 123 URLs                                                   |

Generated pages total 110; generated indexable pages total 99. No broken internal href target was found. Twenty indexable routes have zero inbound HTML links: `/invoice-no-watermark/` and all 19 indexable Focus matrix routes.

## 7. Generation pipelines

### P0 — reproduction failure

Evidence:

- `node scripts/pseo/matrix-build.mjs --dry-run` fails at `scripts/pseo/matrix-build.mjs:272`: `SEO section markers missing for backend-developer-focus-room`.
- In-memory `buildPage(intent)` comparison differs from checked-in HTML for 51/54 intents: all 30 PDF intents and 21 non-opt-in image intents. Only Ozon, AliExpress and one remaining current case reproduce exactly.
- `npm run eeat:inject -- --dry-run` reports 125 changes across 131 scanned HTML files even on the current committed tree.
- `pseo:build` does not invoke the EEAT injector. Running the primary generator can remove the post-injected trust rail/Experience block; running the injector then rewrites broad unrelated output.
- BG and Focus builders also clone mutable hub HTML, coupling generated output to unrelated hub markup markers.

Root cause: generator output, hub templates and a global HTML post-processor form an implicit multi-step pipeline with no idempotence contract.

Impact: the next regeneration can produce a large unrelated diff, remove trust content, fail midway or deploy mixed generations.

Smallest fix: specify one ordered build pipeline, make each transformation idempotent, stop deriving generated templates from mutable full hub pages where marker contracts are unstable, and add a clean-tree regeneration gate. Do not manually normalize the 110 output pages.

## 8. Core tools

| Tool                     | Audit result                 | Capability notes                                                                                                                                                                                                                                       |
| ------------------------ | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Image compressor/resizer | Partially verified           | unit utilities pass; Canvas/WebP WASM paths exist; AVIF is browser-encoder dependent; RAW support extracts embedded JPEG previews rather than demosaicing RAW sensor data; internal encode edge caps are 4096/8192 px despite “any size/no limit” copy |
| PDF suite                | Verified for tested paths    | 24 shared unit tests + 4 standalone PDF integration checks pass; local PDF audit: 49 passed/0 issues; compressor rasterization is lossy and must not be described as zero quality loss                                                                 |
| QR generator             | Partially verified           | QR data unit tests pass; runtime depends on unpkg `qr-code-styling`; no live export was executed in this audit                                                                                                                                         |
| Invoice                  | Partially verified           | totals tests pass; state is stored in `localStorage`; PDF/PNG rendering depends on CDN `html2canvas`; broad offline claim is unproven                                                                                                                  |
| Focus Room               | Partially verified           | live UI rendered H1 and `25:00` timer without console errors; localStorage logic exists; `focus/sw.js` exists but no service-worker registration was found                                                                                             |
| BG remover               | Unverified processing result | live UI loads without console errors; engine is dynamically imported from `esm.sh`/jsDelivr; no representative segmentation benchmark or fixture suite supports speed/accuracy claims                                                                  |

## 9. SEO architecture

Strengths:

- 139/139 route HTML files have titles and canonicals.
- All 123 indexable routes are in the sitemap; all 16 noindex routes are excluded.
- No duplicate indexable title, H1 or description was detected; duplicate titles are limited to the five redirect shells.
- HTTPS/non-`www` canonicalization works: HTTP and `www` return `301`; missing trailing slash returns `308`.

Risks:

- 20 indexable orphan routes undermine discovery and the claimed route hierarchy.
- 98 titles exceed 60 characters; 17 descriptions exceed 160 (11 exceed 180). These are snippet-truncation risks, not automatic quality failures.
- OG exists on 97/139 pages and Twitter cards on 56/139; coverage is inconsistent by template.
- Five legacy aliases return `200` and perform client-side redirection. They consume crawl requests as HTML duplicates even though they are canonical/noindex.
- Route/navigation/SEO eligibility is distributed across hand HTML, three pSEO data systems, sitemap and injector logic.

## 10. pSEO eligibility

Positive controls:

- Zod schemas use strict allowlists.
- Intent validation requires unique titles/H1/descriptions/leads and widget fingerprints.
- Focus matrix enforces unique state fingerprints and intentionally noindexes 11 hub-duplicate presets.
- BG matrix enforces distinct content and tool state.

Failures/risks:

- `pseo:audit` fails on three cross-family H2 duplicates: LinkedIn, Amazon and Etsy “Field note” headings.
- The EEAT injector algorithmically creates first-person text by substituting a platform/profession label. This is not credible human Experience and weakens anti-doorway safeguards.
- Platform limits are time- and tenant-dependent, but the data has no evidence URL, last-verified date or confidence/type field. Several entries explicitly use “practical” invented thresholds while page titles can present them as platform limits.
- Indexability is not derived from an auditable shared registry across all three families.
- Current output quality cannot compensate for a non-reproducible generator.

Do not create or publish more pSEO until reproduction, evidence provenance and orphan linking are fixed.

## 11. robots, sitemaps and indexing

- `robots.txt` is static, allows the site, disallows `/cdn-cgi/` and common tracking/query variants, and points to the correct sitemap.
- `sitemap.xml` is static committed output mutated by multiple publication scripts.
- XML parse: 123 unique URLs; no missing local indexable routes, no noindex routes, no local HTML mismatch.
- Live verification: `/`, `/robots.txt`, `/sitemap.xml` return `200`; all 123 sitemap URLs return `200` by HEAD.
- P0: `scripts/pseo/publish.mjs:71` calls `notifyGoogle`; `scripts/indexing-worker/index.mjs:217-220` publishes `URL_UPDATED` for ordinary tool pages. Google’s official documentation says the Indexing API is only for `JobPosting` or livestream `BroadcastEvent`/`VideoObject` pages: <https://developers.google.com/search/apis/indexing-api/v3/using-api>. Ordinary VeloTools pages are ineligible.

Smallest fix: disable Indexing API submission for these routes and retain sitemap/Search Console discovery. Do not remove sitemap publication.

## 12. Metadata and canonical

- Self-canonical: 134/139; the five exceptions are intentional noindex alias shells canonicalizing to preferred routes.
- Missing H1/description: only the five alias shells.
- No duplicate H1/description was found across route HTML.
- Representative production title/H1/description/canonical/robots and JSON-LD block counts match repository on 12 routes spanning core, trust and all generated families.
- Metadata truth remains duplicated between inline core HTML, JSON intent data, matrix entries, generator replacement code and schema literals.

## 13. Schema

309 JSON-LD blocks parse successfully. Inventory:

| Type                  | Count |
| --------------------- | ----: |
| `FAQPage`             |   125 |
| `WebApplication`      |    91 |
| `SoftwareApplication` |    30 |
| `BreadcrumbList`      |    26 |
| `HowTo`               |    22 |
| `ItemList`            |     3 |
| `WebPage`             |     3 |
| `Organization`        |     2 |
| `Person`              |     2 |
| `WebSite`             |     2 |
| `Article`             |     1 |
| `CollectionPage`      |     2 |

Syntax is healthy, but factual consistency is not: schema repeats “up to 90%,” format/offline and feature claims that are unverified or misleading in visible content. FAQ volume is high and produced through multiple independent code paths. Schema eligibility/content must be reviewed after claims are corrected at source.

## 14. Internal links

- Global nav/footer markup is copied across many HTML files; homepage card navigation uses a separate React registry.
- BG generator creates every sibling link on every BG pSEO page (26-way cross-linking). This is broad SEO-oriented linking, not necessarily the best user navigation.
- Intent pages receive parent/trust links from a separate injector rather than their generator.
- Focus generator does not create a hub directory/link surface; its 19 indexable routes are orphaned except for sitemap discovery.
- `/invoice-no-watermark/` is also orphaned.
- No broken internal route targets were found in `<a href>` analysis.

Smallest fix: add an explicit `linkEligible`/hub grouping decision to existing route data and render concise parent/related links from it. Do not add a generic link graph service.

## 15. Privacy/browser-only verification

Implementation evidence supports a narrow promise: no file-upload API, XHR, form action or application backend was found for tool bytes. Processing code reads browser `File`/Blob/Canvas data locally.

This is not “no network/no tracking”:

- 138/139 HTML routes load or bootstrap GA4 (`G-9FBE4JKG3R`) through `/js/analytics.js`.
- 65 pages simultaneously contain “no tracking” or “zero data collection” wording.
- `privacy/index.html:277` says Google Analytics would be disclosed “in the future,” while it is live now.
- No consent-mode default/consent UI was found. Google documents that default GA4 stores a client ID in `_ga`; consent mode controls storage/collection: <https://support.google.com/analytics/answer/11593727> and <https://developers.google.com/tag-platform/security/concepts/consent-mode>.
- Google Fonts, CDN libraries, GTM, BG-removal code/model and normal navigation generate external requests.
- `js/vt-recent.js` uses IndexedDB; Invoice and Focus use localStorage.
- `focus/sw.js` contains a cache-first worker but no registration was found; blanket offline claims are therefore not guaranteed.

P0 smallest fix: decide the actual analytics policy, make code/privacy/consent/no-tracking copy agree, then separately scope “no upload” to user file bytes.

## 16. Product claim verification

| Status     | Route/source                                               | Claim                                                                                         | Evidence and recommendation                                                                                                                  |
| ---------- | ---------------------------------------------------------- | --------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| FALSE      | homepage tool card, `src/tool-cards/data/toolsData.ts:106` | PDF “Zero quality loss”                                                                       | compressor rasterizes pages to JPEG at configurable DPI/quality; replace at source with explicit lossy behavior after review                 |
| UNVERIFIED | homepage/BG, `toolsData.ts:129`, BG page                   | `99.4%` accuracy, `<2 sec`, `20x faster`                                                      | no benchmark fixtures, hardware/browser matrix or cited measurement; remove numbers or add reproducible benchmark                            |
| MISLEADING | homepage/about/tool pages                                  | all tools work offline once loaded                                                            | runtime CDN/model/font dependencies exist; no general SW registration; scope by tool and tested cache state                                  |
| MISLEADING | image tool                                                 | “no file limit”, “any size”                                                                   | RAM is finite and encoder path caps edges at 4096/8192 px; state actual browser/memory limits                                                |
| PARTIAL    | image tool                                                 | RAW conversion                                                                                | code extracts embedded JPEG preview and explicitly fails when absent; it does not demosaic RAW sensor data; rename to RAW preview extraction |
| PARTIAL    | image tool                                                 | AVIF support                                                                                  | relies on browser Canvas encoder and rejects mismatched output; describe browser-dependent support                                           |
| MISLEADING | image tool                                                 | crop/rotate “lossless”                                                                        | pixel transforms are followed by encoding; lossy formats can lose detail                                                                     |
| PARTIAL    | BG remover                                                 | fully local/no upload                                                                         | image bytes appear local, but JS/model download remotely; describe first-run network dependency and verify package behavior                  |
| UNVERIFIED | BG remover                                                 | cached forever, original-resolution HD, GDPR compliant, competitor storage/retraining/pricing | no evidence registry; time-sensitive/legal/comparative assertions require sources and dates or removal                                       |
| VERIFIED   | PDF core routes                                            | browser-local merge/split/protect/unlock paths                                                | unit/integration and local route/asset audit pass for tested fixtures; retain documented limitations                                         |
| UNVERIFIED | Focus card, `toolsData.ts:35`                              | “Scientifically proven deep work method”                                                      | no cited specific method/outcome; simplify or cite narrowly                                                                                  |

Claims are repeated in visible HTML, JSON-LD, homepage cards and FAQ blocks. Fix the existing shared/primary source first, regenerate, then verify all surfaces.

## 17. Performance

- Tracked repository: 337 files, about 53.7 MB; route HTML alone is about 8.5 MB.
- Focus audio is about 41.5 MB across six MP3 files; `fire.mp3` alone is 18.1 MB. The unregistered SW proposes caching the complete set at install time.
- Image landing HTML is roughly 130–150 KB per route because the full parent tool and long editorial are cloned.
- Homepage React bundle is 221.7 KB raw/67.8 KB gzip and CSS 57.7 KB raw/8.2 KB gzip; isolated Vite production build succeeds.
- 259 external script tags across route HTML have no SRI; GA tags account for 137. Remote fonts and repeated analytics remain common render/network work.
- BG removal imports code/model at runtime; first-run performance is network/device dependent.

Priority is pipeline/content duplication and runtime dependency policy, not CSS micro-optimization.

## 18. Code/dependency health

- `npm audit --omit=dev`: 0 production-package vulnerabilities.
- Full `npm audit`: 6 dev vulnerabilities (3 high, 3 moderate) in `brace-expansion`, `nanoid`, Vitest mocker and Vite’s older esbuild chain. Do not auto-fix; plan reviewed dev-tool upgrades.
- 259 external script tags have no `integrity`; production headers observed `x-content-type-options` and referrer policy but no CSP/HSTS header in the sampled responses.
- Lint configuration treats ESM/browser modules and generated/vendor bundles as generic scripts and scans untracked `velo-growth-desk`; global result is 224 errors/21 warnings and is not a meaningful release gate.
- `scripts/indexing-worker/sa-key.json`, SQLite log and local `node_modules` exist locally but are correctly ignored and untracked. No secret content was opened. Prefer credentials outside the repository tree to reduce handling risk.
- Dynamic HTML is mostly build-time escaped; pSEO Zod schemas are strict. Maintain this boundary.

## 19. Tests/build status

| Check                          | Result                                                                                 |
| ------------------------------ | -------------------------------------------------------------------------------------- |
| `pseo:validate`                | pass: 54 intents                                                                       |
| `matrix:validate`              | pass: 30 entries                                                                       |
| `bgmatrix:validate`            | pass: 26 entries                                                                       |
| `audit-matrix.mjs`             | pass: 30 HTML, 19 sitemap, 11 noindex                                                  |
| `pseo:audit`                   | fail: 3 duplicate cross-family H2s                                                     |
| targeted Vitest                | pass: 6 files, 24 tests                                                                |
| standalone PDF integration     | pass: 4/4                                                                              |
| local PDF tools audit          | pass: 49, issues: 0                                                                    |
| TypeScript `--noEmit`          | pass                                                                                   |
| isolated Vite production build | pass; 1794 modules                                                                     |
| global `npm test`              | fail: Vitest collects Playwright spec and standalone exiting script; worker/OOM errors |
| global lint                    | fail: 224 errors/21 warnings; scope/config includes generated/vendor/untracked code    |
| Focus matrix dry build         | fail at first page, missing marker                                                     |
| intent regeneration comparison | fail: 51/54 differ                                                                     |
| EEAT injector dry run          | fail idempotence: 125/131 would change                                                 |
| JSON-LD parse                  | pass: 309/309                                                                          |
| `git diff --check` before docs | pass                                                                                   |

No repository-mutating production build/regeneration was run.

## 20. Production/repository drift

- Live checked: root, representative core tools, trust page, all three generated families, robots and sitemap; all returned `200`.
- All 123 sitemap URLs returned `200`.
- Twelve representative pages matched local title, H1, description, canonical, robots and JSON-LD block count.
- Image compressor, BG remover and Focus loaded in the in-app browser without console warnings/errors; Focus rendered `25:00`.
- HTTP and `www` redirect `301` to `https://velotools.app/`; `/focus` redirects `308` to `/focus/`.
- Five legacy aliases return `200` rather than HTTP redirects.
- No sampled stale-deploy metadata drift was found. Full interactive file processing was not executed against production in this audit.

## 21. P0 findings

| ID   | Finding                                                                                  | Effort |   Risk | Smallest correction                                                                                                      |
| ---- | ---------------------------------------------------------------------------------------- | -----: | -----: | ------------------------------------------------------------------------------------------------------------------------ |
| P0-1 | Generated pipeline is failing/non-idempotent and 51 intent outputs drift                 |      M |   HIGH | compose one ordered pipeline; repair Focus marker contract; add regeneration-clean gate                                  |
| P0-2 | GA4 is live while privacy/no-tracking claims say otherwise                               |    S–M |   HIGH | decide analytics/consent policy; align loader, policy and all claims                                                     |
| P0-3 | Quantitative/offline/lossless/compliance product claims lack evidence or contradict code |      M |   HIGH | claim registry/evidence pass using existing sources; remove or narrow unsupported claims, then regenerate schema/content |
| P0-4 | Generic tool pages use an ineligible Google Indexing API workflow                        |     XS | MEDIUM | disable API notification for these routes; keep sitemap/Search Console workflow                                          |

## 22. P1 findings

| ID   | Finding                                                                                  | Effort |   Risk |
| ---- | ---------------------------------------------------------------------------------------- | -----: | -----: |
| P1-1 | 20 indexable orphan routes                                                               |      S |    LOW |
| P1-2 | templated first-person Experience plus 3 duplicate cross-family H2s                      |    S–M | MEDIUM |
| P1-3 | global test/lint commands are broken as release gates                                    |      S |    LOW |
| P1-4 | schema repeats unverified capability claims                                              |    S–M | MEDIUM |
| P1-5 | remote runtime scripts/models, no SRI and no observed CSP                                |      M | MEDIUM |
| P1-6 | pSEO platform facts lack source URL/verification date/confidence                         |      M | MEDIUM |
| P1-7 | five legacy duplicates use `200` client redirects                                        |   XS–S |    LOW |
| P1-8 | tool/navigation/claim truth is fragmented across React data, HTML, schema and registries |      M | MEDIUM |

## 23. P2 findings

| ID   | Finding                                                                                                  | Effort |   Risk |
| ---- | -------------------------------------------------------------------------------------------------------- | -----: | -----: |
| P2-1 | title/description truncation risk (98 titles >60; 17 descriptions >160)                                  |      S |    LOW |
| P2-2 | sitemap has multiple in-place writers and no single eligibility projection                               |      M | MEDIUM |
| P2-3 | deployment configuration/runbook is absent from repository                                               |     XS |    LOW |
| P2-4 | large duplicated HTML/audio payloads and remote-font/analytics overhead                                  |      M | MEDIUM |
| P2-5 | README is a placeholder and advertises unsupported/unclear ZIP/7z behavior                               |     XS |    LOW |
| P2-6 | one Focus variant lacks Lab/Method links and two generated targets lack a conventional Experience marker |     XS |    LOW |
| P2-7 | ignored service-account key/logs live inside repository directory                                        |     XS | MEDIUM |

## 24. P3 findings

| ID   | Finding                                                                              | Effort | Risk |
| ---- | ------------------------------------------------------------------------------------ | -----: | ---: |
| P3-1 | OG/Twitter coverage varies by template (97/56 of 139)                                |      S |  LOW |
| P3-2 | manifest is linked on 131/139 pages and viewport on 134/139                          |     XS |  LOW |
| P3-3 | alias shells lack H1/description; improve only if retained instead of HTTP redirects |     XS |  LOW |
| P3-4 | oversized `favicon.svg` (~575 KB) and general static-asset polish                    |     XS |  LOW |

## 25. Recommended recovery sequence

1. **P0 spec/review:** define the canonical generation order and exact expected artifacts.
2. Repair idempotence and Focus build without changing SEO content; add in-memory/clean-tree regression checks for all 110 generated pages.
3. Disable ordinary-page Indexing API submission.
4. Decide analytics policy and consent behavior; align privacy text and “no tracking” wording in one reviewed change.
5. Build an evidence table for claims, then narrow false/unverified visible copy and schema from existing sources of truth.
6. Repair test/lint scopes so global commands are deterministic gates.
7. Add useful hub links to the 20 orphans and replace alias shells with hosting redirects.
8. Re-review pSEO eligibility/fact provenance before any new page publication.
9. Only then address performance/social metadata/dependency upgrades.

Each numbered step requires `SPEC → IMPLEMENTATION → DIFF → TESTS → REVIEW → COMMIT`; do not combine P0 truth changes into one unreviewable patch.

## 26. What not to touch

- Protected untracked `.agents/`, `AGENTS.md`, `velo-growth-desk/`.
- Generated route HTML until generator/idempotence work is specified.
- Existing 11 Focus noindex decisions without a separate eligibility review.
- Framework/hosting architecture; no evidence supports a rewrite.
- Production dependencies via automatic update/fix.
- GSC/robots/noindex/content deletion in the same patch as pipeline repair.
- Current deployed output while P0-1 is unresolved.

## 27. Unknowns requiring evidence

- Cloudflare Pages project settings, production branch, build command, headers/redirect rules and rollback procedure are external to Git.
- No committed analytics property configuration, consent-region policy or retention settings were inspected.
- No benchmark corpus supports image/BG speed, quality or accuracy claims.
- No browser/device compatibility matrix verifies AVIF, HEIC, mobile memory or offline behavior.
- No authoritative source/last-verified metadata exists for platform limits/comparisons.
- GSC spreadsheets dated 2026-09-07 were not used to infer current ranking/index status; this audit makes no traffic-performance claim.
- Full production file-processing journeys were not run; production verification was HTTP/metadata/UI/runtime-load based.

## Content disposition summary

- **KEEP:** working tool UI, concise operational limits, trust pages, source-specific handcrafted editorials.
- **VERIFY:** every numeric, offline, format, privacy, regulatory and competitor claim.
- **SIMPLIFY:** BG remover comparison/marketing blocks and repeated homepage/tool prose.
- **MERGE:** alias shells into platform HTTP redirects; duplicate claim sources into existing registries.
- **REWRITE:** privacy/analytics disclosure and templated first-person Experience at source.
- **NOINDEX CANDIDATE:** no new action now; re-evaluate orphan/near-duplicate intent pages only after evidence review.
- **REMOVE CANDIDATE:** ineligible Indexing API calls and unsupported superlatives, after separate review.
