/**
 * Google Indexing API is intentionally disabled for VeloTools ordinary
 * tool and landing pages.
 *
 * Google currently limits the Indexing API to eligible JobPosting pages
 * and BroadcastEvent pages embedded in VideoObject.
 *
 * VeloTools discovery uses sitemap, internal links and Search Console.
 * Keep this compatibility function so existing publish flows do not break.
 */

export function notifyGoogle(pathsOrUrls, opts = {}) {
  const count = Array.isArray(pathsOrUrls)
    ? pathsOrUrls.length
    : pathsOrUrls
      ? 1
      : 0;

  const result = {
    skipped: true,
    count,
    dryRun: Boolean(opts?.dryRun),
    reason: "google-indexing-api-disabled-for-ordinary-velotools-pages"
  };

  console.log(
    `Indexing API disabled for ordinary VeloTools pages; skipped ${count} URL(s). Sitemap remains the discovery path.`
  );

  return Promise.resolve(result);
}
