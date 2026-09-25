/**
 * Deterministic trust markup for generated route families.
 * This module is pure: it does not read or write HTML files.
 */

function labelFromPath(routePath) {
  if (routePath.startsWith('compress-pdf-for-')) {
    return routePath
      .replace(/^compress-pdf-for-/, '')
      .replace(/\/index\.html$/, '')
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
  if (routePath.startsWith('image-resizer-for-')) {
    return routePath
      .replace(/^image-resizer-for-/, '')
      .replace(/\/index\.html$/, '')
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
  if (routePath.startsWith('bgremover/for-')) {
    return routePath
      .replace(/^bgremover\/for-/, '')
      .replace(/\/index\.html$/, '')
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
  if (routePath.startsWith('tools/')) {
    return routePath
      .replace(/\/index\.html$/, '')
      .split('/')
      .slice(1)
      .map((segment) =>
        segment
          .split('-')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')
      )
      .join(' · ');
  }
  throw new Error(`Unsupported generated trust path: ${routePath}`);
}

function parentHub(routePath) {
  if (routePath.startsWith('compress-pdf-for-')) return '/compress-pdf/';
  if (routePath.startsWith('image-resizer-for-')) return '/image-compress/';
  if (routePath.startsWith('bgremover/for-')) return '/bgremover/';
  if (routePath.startsWith('tools/')) return '/focus/';
  throw new Error(`Unsupported generated trust path: ${routePath}`);
}

function workflow(routePath, label) {
  if (routePath.startsWith('compress-pdf-for-'))
    return {
      job: `PDF attachment limits for ${label}`,
      action: 'pick the Screen/Web preset that fits the channel, compress locally, then attach',
    };
  if (routePath.startsWith('image-resizer-for-'))
    return {
      job: `listing image sizes for ${label}`,
      action: 'resize to the channel box, then compress if the portal still rejects the file',
    };
  if (routePath.startsWith('bgremover/for-'))
    return {
      job: `background removal for ${label}`,
      action:
        'run the local cutout, Refine hair/edges, export PNG or white JPG as the channel requires',
    };
  return {
    job: `deep-work blocks for ${label}`,
    action: 'start the timer with the baked preset — the minutes on the page must match the clock',
  };
}

export function renderPseoTrust(routePath) {
  const label = labelFromPath(routePath);
  const hub = parentHub(routePath);
  const flow = workflow(routePath, label);
  const slug = routePath.replace(/\/index\.html$/, '');
  return {
    experience: `
<section class="vt-exp" id="builder-experience" data-pseo="${slug}" aria-label="Builder experience">
  <div class="vt-exp-kicker">Human experience · Vigen G.</div>
  <h2>Field note: ${label}</h2>
  <p>I keep this page because ${flow.job} kept failing with upload tools or generic presets. Here you ${flow.action}. Limits and architecture are documented in Lab Notes — this URL is a micro-instrument for one job, not a keyword clone.</p>
  <div class="vt-exp-links"><a href="${hub}">Parent tool</a><a href="/lab/">Lab Notes</a><a href="/methodology/">Methodology</a><a href="/about/vigen/">Vigen G.</a><a href="/about/">About</a></div>
</section>`,
    rail: `
<nav class="vt-eeat-rail" aria-label="Trust and product links">
  <a href="${hub}">Parent tool</a>
  <a href="/lab/">Lab Notes</a>
  <a href="/methodology/">Methodology</a>
  <a href="/about/">About</a>
  <a href="/">All tools</a>
</nav>`,
  };
}
