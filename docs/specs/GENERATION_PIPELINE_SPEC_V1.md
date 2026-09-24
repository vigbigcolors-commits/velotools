# VeloTools Generation Pipeline Specification v1

Status: architecture review pending

Scope: P0-1 only. This document specifies the repair of generated-output ownership and determinism. It does not change privacy, claims, Indexing API policy, indexability, or page copy.

## 1. Purpose

Make generated HTML reproducible from a clean checkout. Given identical source, dependencies, configuration and relevant environment, a complete generation run must produce the same generation-owned repository state on every run.

The required workflow remains `SPEC → IMPLEMENTATION → DIFF → TESTS → REVIEW → COMMIT`. This is the SPEC stage only.

## 2. Current architecture

The repository contains independent static route HTML plus four generation/mutation systems:

1. Intent pSEO: `scripts/pseo-pipeline.mjs` invokes `scripts/pseo/build.mjs` for records in `scripts/seo-data/intents/*.json`.
2. Focus matrix: `scripts/pseo/matrix-build.mjs` renders `scripts/seo-data/matrix/*` against `focus/index.html`.
3. BG matrix: `scripts/pseo/bgremover-matrix-build.mjs` renders `scripts/seo-data/bgremover-matrix/*` against `bgremover/index.html`.
4. Global trust post-processor: `scripts/pseo/inject-eeat-rails.mjs` walks 131 HTML files and mutates most of them.

Separately, `scripts/copy-tool-cards.mjs` copies Vite output from `dist-tool-cards/` to committed `js/tool-card-grid.js` and `css/tool-card-grid.css`. Sitemap and state are mutated by `scripts/pseo/publish.mjs`, `scripts/pseo/matrix-publish.mjs`, legacy batch scripts, and `scripts/pseo/bump-discovered-lastmod.mjs`.

No CI, Cloudflare Pages config, Wrangler config, `_headers`, or `_redirects` is committed. The exact production build command is therefore not repository-verifiable.

## 3. Evidence

| Observation        | Reproduction/evidence                                                                                                                                                                                                          | Classification                                                                          |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------- |
| Intent drift       | In-memory `buildPage(intent)` versus committed `index.html`: 51/54 differ. Exact matches are only `compress-pdf-for-google-classroom`, Ozon, and AliExpress.                                                                   | J, B, L: later mutation and incomplete pipeline composition.                            |
| EEAT first pass    | `node scripts/pseo/inject-eeat-rails.mjs --dry-run`: 125 of 131 scanned pages would change.                                                                                                                                    | J/B: broad source-output post-processing outside family builders.                       |
| EEAT repeated pass | In isolated detached worktree, first EEAT pass changed 125; second pass still changed 102; third dry-run still reported 102. Representative `bgremover/for-amazon/` gains one blank line before `builder-experience` per pass. | D/H/J: non-idempotent whitespace mutation.                                              |
| Focus build        | `node scripts/pseo/matrix-build.mjs --dry-run` fails at `matrix-build.mjs:272`: `SEO section markers missing for backend-developer-focus-room`.                                                                                | B/J: fragile marker contract against mutable `focus/index.html`.                        |
| Builder scope      | `pseo-pipeline.mjs` calls `writePage`, but never calls the EEAT injector; its normal `build` only selects intent statuses `draft` or `built`, and transitions a draft to `built`.                                              | L/B: build and maintenance generators use different logic; current command is stateful. |
| Stale ownership    | Builders can create directories/files but do not enumerate owned outputs or remove a former route. Sitemap has several independent in-place writers.                                                                           | Missing stale-artifact contract; sitemap ownership is a separate P2 concern.            |

These findings do **not** establish timestamps, unstable object ordering, or environment-dependent copy as current causes. No timestamp is emitted by the three HTML builders. Line-ending warnings in the isolated Windows worktree are a separate checkout attribute concern; the semantic drift above occurs before Git normalization.

## 4. Current generation graph

| Family                    | Input source                                                                                                                | Generator / intermediate transform                                                                             | Post-processor / mutator                                                      | Output and consumer                                                                            |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| Intent PDF/image          | `scripts/seo-data/intents/{compress-pdf,image-resizer}.json`; platform JSON; editorial modules; `scripts/seo/fact-copy.mjs` | `scripts/pseo/build.mjs` clones `compress-pdf/index.html` or `image-compress/index.html`, then replaces fields | separately `inject-eeat-rails.mjs`; publish mutates intent status and sitemap | `compress-pdf-for-*/index.html`, `image-resizer-for-*/index.html`; committed static deployment |
| Focus                     | `scripts/seo-data/matrix/{schema,entries,editorials,index}.mjs`                                                             | `matrix-build.mjs` clones `focus/index.html`, applies config/schema/SEO replacement                            | separately EEAT; `matrix-publish.mjs` mutates sitemap/state                   | `tools/*/focus-room/**/index.html`; committed static deployment                                |
| BG                        | `scripts/seo-data/bgremover-matrix/{schema,entries,editorials,index}.mjs`                                                   | `bgremover-matrix-build.mjs` clones `bgremover/index.html`, applies config/schema/SEO replacement              | separately EEAT; legacy `batch30/publish-bg.mjs` and sitemap writers          | `bgremover/for-*/index.html`; committed static deployment                                      |
| Trust blocks              | `scripts/seo-data/tool-experience.mjs`, algorithmic labels from paths                                                       | `inject-eeat-rails.mjs` scans all eligible HTML                                                                | same script writes in place                                                   | core tool pages and generated families; committed static deployment                            |
| Tool cards                | `src/tool-cards/**`, `vite.tool-cards.config.mjs`                                                                           | `vite build`                                                                                                   | `copy-tool-cards.mjs` copies two files                                        | `dist-tool-cards/` ignored; `js/tool-card-grid.js`, `css/tool-card-grid.css` committed         |
| Sitemap/publication state | intent/matrix eligibility, `scripts/seo-data/publish-state.json`                                                            | `publish.mjs`, `matrix-publish.mjs` append XML                                                                 | `batch30/publish-bg.mjs`, `bump-discovered-lastmod.mjs` also write it         | `sitemap.xml`, publish state; committed static deployment and indexing worker                  |
| Core routes               | individual `*/index.html`                                                                                                   | none                                                                                                           | EEAT can mutate many                                                          | committed static deployment                                                                    |

## 5. Root causes of drift

P0-1 root cause count: 3. A fourth finding — competing sitemap/state writers — is real, but it does not cause the observed intent/Focus/EEAT reproduction failures and remains outside the minimal P0-1 implementation.

1. **Implicit multi-owner pipeline.** Intent builders own metadata, config, schema and editorial replacements, while a global, independent EEAT pass owns trust CSS, navigation/footer changes, Experience blocks and rails. `pseo:build` omits that pass. The generated artifact is therefore not the output of one declared command.
2. **EEAT is non-idempotent.** In `injectPseoRail`, the replacement regex ends with `</section>\s*` while `pseoExperienceHtml()` starts with a newline. Each refresh consumes trailing whitespace then prefixes fresh whitespace. The observed result is one additional blank line each pass on 102 pages. This is a concrete formatting mutation, not a hypothetical behavior.
3. **Focus depends on an unstable whole-page marker.** `matrix-build.mjs` requires the source hub to contain `<!-- SEO SECTION` followed by `</section>\r?\n\r?\n<style>`. The current `focus/index.html` does not meet that exact end-marker assumption, so the first entry cannot render. The Focus system is a separate generator family, but shares the same fragile “clone mutable hub and regex-replace” pattern.
4. **Related ownership finding — defer from P0-1.** A removed or renamed data entry leaves its old committed route because builders only create/write. `publish.mjs`, `matrix-publish.mjs`, `batch30/publish-bg.mjs`, and `bump-discovered-lastmod.mjs` independently edit `sitemap.xml`; two publish paths also edit `publish-state.json`. This must receive a later one-writer sitemap design, but changing it is not necessary to make HTML generation deterministic and would mix publication/Indexing API work into P0-1.

The 51/54 intent mismatch is caused by (1), not manual HTML edits as a proven primary cause. The three matching routes are incidental current convergence: Google Classroom and the two opt-in image intents happen to contain their necessary output directly from `build.mjs`; that is not an ownership guarantee. Separately, `pseo-pipeline.mjs build` mutates `publishStatus` for draft records, so it cannot be the two-pass deterministic entrypoint even after EEAT ownership is repaired.

## 6. Focus failure root cause

- Command: `node scripts/pseo/matrix-build.mjs --dry-run`.
- Failure: `Error: SEO section markers missing for backend-developer-focus-room` at `scripts/pseo/matrix-build.mjs:272`.
- Call path: CLI → `buildAllMatrixPages()` → `buildMatrixPage(entry)` → source-hub SEO replacement.
- Input: first Zod-validated `MATRIX` entry `backend-developer-focus-room` and `focus/index.html`.
- Expected output: `tools/backend-developer/focus-room/index.html` with unique matrix content and page config.
- Actual cause: marker matching requires a precise adjacency to `<style>` which the mutable hub no longer provides.

Focus is a separate legacy matrix pipeline, not an extension of intent pSEO. It must retain its own renderer/data schema, but adopt the common contract: an explicit stable template boundary and one declared generation sequence.

**Focus recommended boundary:** add one source-owned, unique Focus matrix slot to the Focus shell (for example `<!-- VT:FOCUS_MATRIX_SEO_SLOT -->`) and replace that slot only after asserting it occurs exactly once. The slot is a template contract, not a search for surrounding copy, closing tags, whitespace, or a following `<style>` element. Extracting a new duplicate full-page Focus template is not justified.

## 7. EEAT injector analysis

`inject-eeat-rails.mjs` adds/replaces `#vt-eeat-css`, Lab/Method navigation and footer links, core-tool Experience sections, and PSEO Experience/trust rails. It scans the repository root and writes source-owned core HTML and all three generated families.

It recognizes several of its own blocks, but recognition is incomplete as an idempotence guarantee. PSEO Experience replacement grows whitespace on every run; 102 pages remain mutable after a first pass. It is deterministic in the narrow sense that it has no time/random input, but it is not idempotent and is not safely composable with builders. Formatting-only change is real and still unacceptable because it leaves a non-empty repository diff.

The injector currently masks missing template ownership: stable generated-family rails should be emitted by the relevant family renderer or a shared pure renderer called by it. Core hand-authored Experience content may remain an explicit, separately reviewed maintenance transform only if it becomes idempotent and is excluded from generated route ownership. It must not run as a global repair pass in the pSEO release path.

**EEAT target owner:** the relevant family renderer (`build.mjs`, `matrix-build.mjs`, or `bgremover-matrix-build.mjs`) owns its generated trust block directly. A small pure render helper is allowed only to share identical markup; it must receive data and return a string, never traverse or mutate HTML files. **POSTPROCESSOR_REQUIRED=NO** for generated pages.

## 8. Current source-of-truth matrix

| Domain              | Current source                                         | Current mutators                                      | Current output                | Problem                                            | Proposed single owner                                                                                           |
| ------------------- | ------------------------------------------------------ | ----------------------------------------------------- | ----------------------------- | -------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Tool definitions    | route JS/HTML; Focus/BG/intent config registries       | family builders, client hydrators                     | HTML config + client behavior | family-specific and partly hand-authored by design | retain each product/family registry; no global registry                                                         |
| Intent definitions  | `scripts/seo-data/intents/*.json`                      | `intents.mjs` status writes                           | intent routes                 | status/data and output lifecycle coupled           | intent JSON for definition; publication state separated from definition in future implementation only if needed |
| Page copy           | editorial modules, hub HTML, `tool-experience.mjs`     | builders and EEAT                                     | visible HTML                  | generated Experience is post-injected              | editorial module plus family renderer for generated pages; core page HTML/tool-experience for core              |
| SEO metadata        | intent/matrix/BG entry data plus hub HTML              | all three builders; EEAT indirectly changes page      | `<head>`                      | template copies are mutable inputs                 | each family renderer from its existing data                                                                     |
| Canonical           | entry/intent path                                      | all family builders                                   | `<link rel=canonical>`        | no output collision registry                       | entryPath/intent slug validated centrally per family + cross-family route check                                 |
| JSON-LD             | renderer functions plus hub scripts                    | builders                                              | JSON-LD scripts               | repeated regex replacement against hubs            | each family renderer emits its owned JSON-LD from the same entry data                                           |
| EEAT/trust blocks   | `tool-experience.mjs`, path-derived text               | global injector; two opt-in image transforms in build | page sections/links/CSS       | competing builder/injector ownership               | family renderer for generated trust output; explicit core-page maintenance only                                 |
| Internal links      | hub HTML, generator sibling loops, EEAT                | builders/EEAT                                         | anchors                       | no eligibility projection                          | retain family-local link renderers; derive sibling links from validated family registry                         |
| Sitemap eligibility | intent `publishStatus`, matrix `indexable`, static XML | three+ XML writers                                    | `sitemap.xml`                 | multiple writers, stale entries possible           | one sitemap projection command fed by explicit eligible route inventory                                         |
| Output path         | slug/`entryPath()`/BG use case                         | builders                                              | route `index.html`            | no complete owned-output set                       | each existing family path function; unified route inventory validates collisions/staleness                      |
| Focus content       | matrix entries/editorials and `focus/index.html`       | matrix builder, EEAT                                  | `tools/**/index.html`         | fragile mutable hub marker                         | matrix entry/editorial + stable Focus shell boundary                                                            |

## 9. Ownership conflicts

- Intent HTML is owned by `build.mjs`, then modified by EEAT. Desired owner: `build.mjs` plus a pure shared trust-block renderer it explicitly calls.
- Focus/BG HTML is owned by their builders, then modified by EEAT. Desired owner: each family builder, with the same shared pure renderer where trust rail output is required.
- `sitemap.xml` is owned by at least four writers. Desired owner: one explicit sitemap projection command in a separate P2 publication-ownership change; publishing selects eligibility/state but never hand-appends XML.
- Generated routes have no deletion owner. Desired owner: a generated-route inventory assembled from existing family registries.

## 10. Target architecture and exact generation order

Do not introduce a framework, CMS, database, or universal registry. Retain the three existing family renderers and their existing schemas.

1. A thin orchestration entrypoint loads and validates each existing family source (`validateAll`, matrix Zod import, BG Zod import) plus a cross-family route/canonical collision inventory. It calls the existing renderers without changing intent publish status.
2. Render intent, Focus, and BG artifacts from their respective data and **stable family shell boundaries**. The Focus repair replaces the brittle marker contract; it does not merge families.
3. During each family render, emit owned metadata, canonical, JSON-LD, page config, editorial and generated trust/Experience block through pure rendering helpers. No global HTML walk follows it.
4. Compute the complete generation-owned route inventory from existing registries and compare it with tracked files in the reserved generated namespaces. Fail on a stale/unexpected path before any removal/write.
5. Write only declared family outputs. Do not alter sitemap or publication state in P0-1.
6. Validate generated HTML/schema/routes and current sitemap consistency without rewriting sitemap.
7. Run the complete generation sequence again in an isolated clean checkout; require zero diff for owned artifacts.

Core hand-authored routes and the Vite tool-card build remain outside this P0-1 HTML-family pipeline. Tool-card build retains `vite build → copy-tool-cards.mjs` and receives its own deterministic-output gate.

## 11. Generation contract

### A. Input contract

Authoritative inputs are existing JSON/editorial/matrix registries, stable family shells, `tool-experience.mjs` where a family uses it, and the explicit route eligibility/publication source. Inputs must validate before outputs are touched. The deterministic generation entrypoint is read-only with respect to publish-status data.

### B. Output contract

Generation owns only `compress-pdf-for-*/index.html`, `image-resizer-for-*/index.html`, `tools/**/focus-room/**/index.html`, and `bgremover/for-*/index.html`. Tool-card output remains a separately declared build artifact. Sitemap ownership is explicitly deferred.

### C. Mutation contract

Family generators may modify only their declared outputs. No generator may walk all HTML. Core HTML and sitemap are not side effects of family generation.

Publication commands may mutate publication state only as a separate, reviewed operation. `publish.mjs` and `matrix-publish.mjs` currently update the shared daily counter; `publish.mjs` also updates individual intent status. Those mutations can remain outside P0-1, but the P0-1 orchestration command must never call them or `updateIntentStatus()`.

### D. Idempotence contract

With identical inputs, a second full generation run has an empty diff for every generation-owned path. Byte equality is the gate; semantic equivalence is not sufficient for committed static output.

### E. Validation contract

Invalid source, duplicate route/canonical, missing template boundary, invalid eligibility, invalid destination, missing required editorial/config, stale output, or invalid generated structured data fails before commit.

### F. Ownership contract

One renderer owns each generated block. No injector, formatter, or manual repair may subsequently alter it.

### G. Manual edit contract

Generated family HTML and generated sitemap entries are never manually edited. Edit source data, editorial, shell, renderer, or eligibility input instead.

### H. Deploy contract

Recommended authoritative behavior: deployment consumes reviewed, committed static artifacts and does not regenerate. This is model **B** (source plus deterministic generated output committed), consistent with the static repository and absent committed Cloudflare build configuration. External Cloudflare settings must be verified before implementation; if they currently regenerate, they must be aligned to this one behavior rather than creating a hybrid.

## 12. Stale artifact strategy and manifest decision

**MANIFEST_REQUIRED=NO.** Although generated and hand-authored pages share the repository root, each current family has a reserved, derivable output namespace: every current intent is `compress-pdf-for-*` or `image-resizer-for-*`; Focus schema fixes `tool` to `focus-room`, yielding `tools/*/focus-room/**`; BG schema yields `bgremover/for-*`. Current paths are already derivable from validated upstream registries.

At generation time: compute the expected path set from those registries; compare it with tracked `index.html` files within only these reserved namespaces; fail if a stale path would be removed unless an explicit reviewed prune mode is used. Never recursively delete a parent directory. The route inventory is an in-memory validation result, not a committed registry, and must not own route, canonical, eligibility, or sitemap truth.

## 13. Failure behavior

Generation fails loudly, before output mutation where feasible, for:

- missing/invalid source or template boundary;
- duplicate route or canonical across families;
- invalid or colliding destination path;
- missing required template input/editorial/config;
- route/canonical conflict or current noindex/sitemap reconciliation failure;
- generated route absent from expected set;
- stale manifest output without explicit reviewed prune authorization;
- non-empty diff after a second isolated generation pass.

Source normalization is permitted only when explicitly defined and tested; implicit repair through broad regex replacement is prohibited.

## 14. Test plan for implementation

1. Source validation: intents, Focus matrix and BG matrix parse/validate.
2. Complete generation succeeds in an isolated clean checkout.
3. Immediate identical second generation yields zero owned-artifact diff.
4. Representative intent, Focus and BG routes match title, H1, config, canonical, visible editorial and JSON-LD source truth.
5. Assert no non-owned/core/user-WIP files change.
6. Assert no duplicate output paths or canonicals across all route inventories.
7. Rename/remove fixture detects a stale file in a reserved generated namespace and fails without prune authorization.
8. All expected generated paths exist and match the inventory derived from upstream registries.
9. Parse every generated JSON-LD block.
10. Sitemap exactly equals approved indexable route projection; no `noindex` URL appears.
11. Run existing targeted product tests for image, PDF and Focus hydration behavior.
12. Run isolated tool-card production build and the production static build/deploy check once its external command is documented.

## 15. Migration batches

| Batch                      | Scope and expected files                                                                                                                         | Forbidden changes                                                               | Command/validation                                          | Rollback/review boundary                        |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------- | ----------------------------------------------------------- | ----------------------------------------------- |
| A — ownership              | `build.mjs`, `matrix-build.mjs`, `bgremover-matrix-build.mjs`, a pure family trust-render helper if duplication warrants it, Focus slot contract | generated HTML, sitemap, claims/privacy/indexing, framework                     | family validation plus isolated render comparison           | review renderer ownership before outputs change |
| B — deterministic contract | minimal orchestration that calls existing renderers without status mutation, derived route-inventory validation and focused tests                | sitemap, publication state, content, eligibility decisions, deployment settings | two-pass clean-worktree gate, duplicate/stale tests         | review stale-path boundary                      |
| C — one regeneration       | only declared generated HTML                                                                                                                     | hand-authored routes, sitemap and unrelated assets                              | full validation, schema parse, diff inspection              | review generated diff route-by-route            |
| D — release verification   | test/CI wiring or documented commands only if required to enforce gate                                                                           | P0-2/P0-4, copy/claims, deployment config changes                               | targeted product tests, tool-card build, `git diff --check` | separate commit/review; deploy remains separate |

Each batch is independently reversible by reverting its own commit. Do not combine batches with sitemap/publication-state consolidation, P0-2 privacy/GA4, P0-3 claims, P0-4 Indexing API, SEO content rewriting, robots/noindex decisions, or broad formatting.

## 16. Exact future verification commands

Do not run these in the active worktree before implementation review. Batch B adds one minimal orchestration command, `node scripts/pseo/generate-all.mjs`, which calls existing family renderers and validates only their declared output namespaces.

```powershell
npm run pseo:validate
npm run matrix:validate
npm run bgmatrix:validate
node scripts/pseo/audit-matrix.mjs
node scripts/pseo/generate-all.mjs --check
```

The clean-checkout idempotence gate is:

```powershell
git worktree add --detach <temporary-path> HEAD
Set-Location <temporary-path>
npm ci
node scripts/pseo/generate-all.mjs
git diff --exit-code -- 'compress-pdf-for-*/index.html' 'image-resizer-for-*/index.html' 'bgremover/for-*/index.html' 'tools/*/focus-room/**/index.html'
node scripts/pseo/generate-all.mjs
git diff --exit-code -- 'compress-pdf-for-*/index.html' 'image-resizer-for-*/index.html' 'bgremover/for-*/index.html' 'tools/*/focus-room/**/index.html'
```

The worktree is removed only after its result is recorded. `pseo:audit` remains informational until its known duplicate-H2 P1 failure is independently resolved; it is not a false P0-1 pass gate.

## 17. Risks

- Stable-shell extraction can unintentionally alter layout or client hooks; preserve selectors/script anchors and test hydration.
- Existing generated HTML includes post-injected content. The one-time normalization diff must be reviewed for content, metadata, schema and tool config, not accepted as formatter noise.
- Sitemap consolidation can change publication timing; preserve current eligibility while changing ownership.
- External Cloudflare configuration is unknown; do not assume deploy-time generation behavior.
- The ignored local service-account key is out of scope and must not be read or moved in this work.

## 18. Intentionally unchanged

- P0-2 GA4/privacy and consent behavior.
- P0-3 unsupported claims and related visible/schema copy.
- P0-4 Indexing API behavior.
- Existing Focus `noindex` decisions, robots, canonical policy, and sitemap eligibility values.
- Static HTML/vanilla-JS architecture, route taxonomy and runtime tool logic.
- Existing manual core-route content except only where a future reviewed ownership implementation requires removal of a generated-family side effect.

## 19. Open questions

1. Which Cloudflare Pages production build/deploy command is configured externally? Repository evidence cannot resolve whether it currently regenerates or merely deploys committed files.
2. Is a reviewed explicit prune command acceptable for a removed generated route, or must removal always be a separate manual approval? The safe default in this specification is fail-closed.

## 20. Review status

**ARCHITECTURE_REVIEW=PASS**

**REVIEW STATUS: IMPLEMENTATION REVIEW PENDING**

**P0_1_FIXED=NO**

No implementation, regeneration, generated-output mutation, commit, push, or deploy is authorized by this document.
