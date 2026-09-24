# VeloTools Project Status

| Field              | Status                                                                                                           |
| ------------------ | ---------------------------------------------------------------------------------------------------------------- |
| PROJECT            | VeloTools                                                                                                        |
| DOMAIN             | <https://velotools.app>                                                                                          |
| AUDIT DATE         | 2026-09-24                                                                                                       |
| BRANCH             | `main`                                                                                                           |
| HEAD               | `a7afa6134d8ba98a302b337e3f4a80209bc56d84`                                                                       |
| WORKTREE STATUS    | Pre-existing untracked `.agents/`, `AGENTS.md`, `velo-growth-desk/`; audit adds docs only                        |
| DEPLOYMENT TARGET  | Cloudflare production; repository does not contain the Pages/build/redirect configuration                        |
| STACK              | Static HTML/CSS/vanilla JS; React/Vite tool-card bundle; Node generators; Zod; Vitest/Playwright                 |
| BUILD STATUS       | Tool-card typecheck + isolated Vite build pass; Focus matrix build fails; generation is not reproducible         |
| TEST STATUS        | Targeted: 24 Vitest + 4 PDF integration + 49 PDF audit checks pass. Global `npm test` and lint fail structurally |
| SEO AUDIT STATUS   | Complete; 139 routes, 123 indexable/sitemap URLs, 110 generated pages                                            |
| CURRENT PHASE      | P0-1 Generation Pipeline Architecture Review — implementation review pending                                     |
| P0 COUNT           | 4                                                                                                                |
| P1 COUNT           | 8                                                                                                                |
| NEXT SAFE STEP     | Review approved P0-1 implementation plan/diff boundaries; then implement P0-1 only                               |
| DO NOT TOUCH       | `.agents/`, `AGENTS.md`, `velo-growth-desk/`; generated HTML manually; deploy/index/noindex/claims before review |
| LAST REVIEW STATUS | P0-1 architecture review passed; implementation review required                                                  |

## Current top blockers

1. Focus matrix dry build fails; intent regeneration drifts 51/54 outputs; EEAT changes 125/131 on first pass and remains non-idempotent (102 changes on repeat).
2. GA4 runs on 138 pages while the policy says Google Analytics is future-only and 65 pages say no tracking/zero data collection.
3. Quantitative, offline, lossless and compliance claims are not backed by scoped evidence.
4. Google Indexing API is wired to ordinary tool pages outside Google’s eligible content types.

## Verified healthy baseline

- 123/123 live sitemap URLs return HTTP 200.
- Sitemap/indexability reconciliation is exact: 123 indexable, 16 noindex, no overlap/omission.
- 309/309 JSON-LD blocks parse.
- Representative production SEO fields match repository.
- No application/source/generated/config file was changed by the audit.

Detailed evidence: [Revival audit](audits/VELOTOOLS_REVIVAL_AUDIT_2026-09-24.md)

Permanent rules: [Engineering & SEO rules](specs/VELOTOOLS_ENGINEERING_SEO_RULES_V1.md)
