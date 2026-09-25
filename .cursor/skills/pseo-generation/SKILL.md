---
name: pseo-generation
description: >-
  Generate VeloTools programmatic SEO (PSEO) pages with anti-doorway, anti-thin,
  and search-quality hard gates. Use when creating/editing compress-pdf-for-*,
  image-resizer-for-*, bgremover/for-*, focus tools matrix pages, intents,
  editorials, platforms JSON, or when the user mentions PSEO, doorway, thin
  content, pseo:validate, or PSEO-MASTER-PROMPT.
---

# VeloTools PSEO Generation Skill

## Mandatory first read

Read and obey the full master prompt:

`scripts/PSEO-MASTER-PROMPT.md`

If anything conflicts with that file, the master prompt + repo validators win.

## Non-negotiables (fail-closed)

1. **Zero-Backend:** tools never upload user files; copy must not claim otherwise.
2. **Anti-doorway:** no noun-swap clones; page must teach a distinct workflow + distinct widget state.
3. **Anti-thin:** editorial ≥600 words, ≥5 FAQ, ≥4 H2; no fluff padding.
4. **Uniqueness:** unique title/h1/description/lead/FAQ; no shared paragraphs; Jaccard ≤0.35 vs siblings.
5. **Widget fingerprint:** different preset/DPI/quality/bytes/size/bg from siblings; UI numbers = copy.
6. **Schema/canonical:** self-URL on this page — never parent hub.
7. **Hub links:** when adding a cluster, link from the hub tool page + sibling footers.
8. **No stubs / no fake SearchAction / no query-param ranking tricks.**

## Workflow

1. Collect brief: cluster, slug, facts, widget, siblings.
2. Draft to the Output Contract in `PSEO-MASTER-PROMPT.md`.
3. Run self-audit checklist (all YES).
4. Write into the correct source (`*-editorials.mjs`, matrix entries, intents JSON).
5. Validate:
   - `npm run pseo:validate` + `npm run pseo:audit` (compress/image)
   - `npm run bgmatrix:validate` + build (bgremover)
   - `npm run matrix:validate` (focus)
6. Build → publish conservatively → sitemap discovery. Do not submit ordinary VeloTools tool/landing pages to Google Indexing API.

## Differentiation axes (use ≥3)

Platform limit · audience job · failure mode · preset rationale · edge craft · privacy angle · sibling contrast.

## Voice

Expert, specific, calm, English public copy, numbers over adjectives, privacy-first.
