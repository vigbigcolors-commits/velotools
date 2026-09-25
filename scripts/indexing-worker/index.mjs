/**
 * Legacy Google Indexing API worker.
 *
 * Disabled intentionally: VeloTools ordinary tool/landing pages are not
 * eligible for Google Indexing API submission.
 *
 * Use sitemap.xml, internal linking and Google Search Console discovery.
 */

console.error(
  "VeloTools Indexing API worker is disabled for ordinary tool/landing pages."
);

process.exitCode = 2;
