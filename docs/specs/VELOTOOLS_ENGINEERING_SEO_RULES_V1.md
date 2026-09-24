# VeloTools Engineering & SEO Rules v1

Status: governance baseline

Effective: 2026-09-24

Applies to: application code, generated pages, SEO data, indexing, build and production deployment

## Required workflow

Every material change follows:

`SPEC → IMPLEMENTATION → DIFF → TESTS → REVIEW → COMMIT`

Architecture, routing, schema, canonical/indexability logic, pSEO eligibility, sitemap/robots changes and production deployment each require an explicit review checkpoint. A successful build is not approval to publish.

## Permanent laws

1. Never manually patch generated output when a source or generator exists.
2. Visible content, tool configuration, metadata, schema, canonical behavior, sitemap eligibility, robots directives and internal-link eligibility must not become independent conflicting truths.
3. A page is not index-worthy merely because it can be generated.
4. Real user utility beats page count.
5. Do not mass-produce AI content or keyword-swapped pages.
6. Every technical, privacy and product claim must match verified implementation.
7. Do not rewrite the architecture without evidence that the current architecture blocks the product.
8. Prefer the smallest correct implementation and deletion of duplication.
9. Production success requires live HTTP, metadata and functional verification.
10. No critical change bypasses `spec → implementation → diff → tests → review → commit`.
11. Architecture, schema, SEO eligibility and production deployment require separate review checkpoints.
12. Never sacrifice revival speed for speculative abstractions.

## Source-of-truth rules

- A source-of-truth map is required for each route family: `source data/template → generator/transformation → committed/deployed output`.
- Generated HTML, sitemap entries and bundles are artifacts. They may be committed for static hosting, but they are never edited as primary data.
- A generator must be deterministic and idempotent. Regeneration followed by the full pipeline must leave a clean diff when inputs did not change.
- Post-processors must be part of one documented build command, not a hidden manual second pass.
- A generated-file drift check is a release gate. Unexpected output propagation blocks commit.
- New truth registries are prohibited when an existing registry can safely carry the field.

## Product and privacy truth

- Claims are evidence, not copy. Record the implementation path, supported browsers/devices, test case and last verification date for measurable claims.
- Never claim guaranteed percentage savings, speed, accuracy, losslessness, unlimited capacity, full format support, offline operation, regulatory compliance or competitor behavior without scoped evidence.
- Distinguish:
  - user file/content bytes leaving the device;
  - external JS, models, fonts and assets downloaded by the browser;
  - analytics, navigation and telemetry requests.
- “No upload” may describe file bytes only when code and network verification support it. It must not be presented as “no network” or “no tracking.”
- Analytics behavior and the privacy policy must match. Consent/default-denied behavior must be reviewed before analytics loads where required.
- Third-party runtime code/model dependencies must be disclosed as availability and privacy boundaries.

## SEO and pSEO eligibility

An indexable landing page requires all of the following:

1. distinct user intent;
2. a real task-specific tool state or workflow;
3. unique meaningful visible content;
4. correct functionality for the stated intent;
5. material differentiation from siblings;
6. a stable self-canonical URL;
7. a useful internal-link reason;
8. verified claims;
9. index-worthy quality after human review.

Search volume, a keyword, a competitor page or generator capability is never sufficient by itself. Weak pages remain draft/noindex until reviewed. Publication is dosed; page-count growth is not a success metric.

## Canonical, metadata, schema and indexing

- One preferred HTTPS, non-`www`, trailing-slash URL per document.
- Indexable HTML must self-canonicalize, return `200`, be internally discoverable and appear in the sitemap only when approved.
- Duplicate/legacy URLs should use a real permanent redirect when hosting supports it; client/meta redirect shells are a fallback, not the target architecture.
- `noindex` URLs must not appear in the sitemap.
- Title, description, H1, visible facts, JSON-LD and tool config derive from compatible source data and must agree.
- JSON-LD must be valid, visible-content-backed and use the page’s real canonical URL. Do not use schema to make stronger claims than the page/product.
- Sitemap publication is a discovery hint, not an indexing guarantee.
- Google Indexing API is not used for ordinary tool/landing pages. It is limited to content types allowed by Google’s current official policy.
- Query/tracking variants must canonicalize to the clean route and must not create indexable state pages.

## Internal linking and content

- Every indexable page must be reachable through useful HTML links from an appropriate hub or contextual page.
- Parent/child and related-tool links must be driven by route eligibility, not indiscriminate sitewide link injection.
- Human Experience text must describe a real, specific workflow. A templated first-person paragraph with substituted labels is not acceptable evidence of experience.
- Keep operational explanations, limits and failure modes. Remove unsupported superlatives, duplicated marketing prose and FAQ padding.

## Architecture and security discipline

- Preserve the static/product-first architecture unless a measured limitation requires change.
- Prefer existing plain HTML/JS modules and current registries. No CMS, database, framework migration or service layer without a proven need.
- Treat CDN scripts/models as supply-chain and availability dependencies. Pin versions; add integrity/self-hosting/CSP where practical and tested.
- Never commit credentials, service-account JSON, `.env*`, logs or local databases. Secret files should live outside the repository even when ignored where practical.
- Allowlisted/Zod-validated pSEO state is the only state embedded into generated pages. Do not derive trusted configuration from raw URL input.

## Test and review gates

Before review, run the smallest relevant set plus the global gates that are healthy:

- generator syntax/import check;
- source-data validation;
- matrix validation and uniqueness audit;
- in-memory/full regeneration drift comparison;
- JSON-LD validation;
- route/canonical/robots/sitemap reconciliation;
- targeted unit/integration tests;
- typecheck and isolated production build;
- `git diff --check`.

Before commit:

- inspect the complete diff;
- confirm only scoped files are staged;
- prove non-target generated pages are byte-for-byte unchanged when isolation is required;
- document any known failing global gate; never silently normalize it as success.

Before/after production deployment:

- record branch and commit;
- use the existing reviewed workflow;
- verify live status, title, H1, description, canonical, robots, schema and representative interactive behavior;
- compare representative non-target routes;
- stop on production drift or unintended propagation.

## Git discipline

- Protect unrelated WIP; no reset, restore, stash, broad staging or force push.
- One coherent change per commit. Generated artifacts and their source change together after regeneration review.
- No commit, push or deploy until the required review gate is explicitly passed.

## Anti-overengineering decision

For every proposed architecture change ask: “Can the same result be achieved safely by changing the existing source of truth with substantially less code?” If yes, use the smaller change.
