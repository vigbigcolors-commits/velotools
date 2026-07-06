/**
 * Fact-driven copy — formula: [Task] + [Hard limits] + [Technical action]
 * No filler words (best, fast, ultimate).
 */
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = join(__dirname, '..', 'seo-data');

let _formats;
let _platforms;
let _platformsImage;

function formats() {
  if (!_formats) _formats = JSON.parse(readFileSync(join(dataDir, 'formats.json'), 'utf8'));
  return _formats;
}

function platformsPdf() {
  if (!_platforms) _platforms = JSON.parse(readFileSync(join(dataDir, 'platforms.json'), 'utf8'));
  return _platforms;
}

function platformsImage() {
  if (!_platformsImage)
    _platformsImage = JSON.parse(readFileSync(join(dataDir, 'platforms-image.json'), 'utf8'));
  return _platformsImage;
}

export function getPlatform(id) {
  return platformsPdf()[id] || platformsImage()[id] || null;
}

export function isImageIntent(intent) {
  return intent.tool === 'image-compress' || intent.toolMode?.startsWith('image');
}

/** Meta description from facts if not set manually */
export function buildMetaDescription(intent) {
  if (intent.description) return intent.description;
  const plat = getPlatform(intent.platform);
  const w = intent.widget;
  if (isImageIntent(intent) && plat) {
    const dims =
      w.outputWidth && w.outputHeight ? `${w.outputWidth}×${w.outputHeight} px` : `${plat.min_width_px}px min`;
    const ratio = plat.aspect_ratio !== 'flexible' ? ` · ${plat.aspect_ratio} aspect locked` : '';
    return (
      `${intent.h1.replace(intent.h1Em || '', intent.h1Em || '').trim()}. ` +
      `${dims}${ratio}, ${plat.color_profile}, output capped at ${plat.max_output_label}. Browser-only — no upload.`
    );
  }
  if (plat?.max_attachment_label) {
    return (
      `Compress PDF for ${plat.name}: ${plat.max_attachment_label} limit, ` +
      `${w.preset} preset (${w.dpi} DPI · ${w.quality}% JPEG). Browser-only processing.`
    );
  }
  return intent.title;
}

export function buildHeroLead(intent) {
  if (intent.heroLead) return intent.heroLead;
  const plat = getPlatform(intent.platform);
  const w = intent.widget;
  if (isImageIntent(intent) && plat) {
    return (
      `${plat.name} requires ${w.outputWidth}×${w.outputHeight} px output, ${plat.color_profile}, ` +
      `and files under ${plat.max_output_label}. Upload once — crop, resize, and compress are pre-locked on this URL.`
    );
  }
  return '';
}

export function buildSecurityNote(intent) {
  if (isImageIntent(intent)) {
    return (
      `<p>Image bytes are processed with the Canvas API in tab memory. ` +
      `This URL only changes default crop dimensions, aspect lock, JPEG quality, and output size warnings — ` +
      `not the privacy model. No image data is uploaded to VeloTools servers.</p>`
    );
  }
  const plat = getPlatform(intent.platform);
  return (
    `<p>Compression runs entirely in your browser via PDF.js and pdf-lib. ` +
    `${plat ? plat.name + ' limits are enforced in the widget; ' : ''}` +
    `no PDF bytes are transmitted over the network.</p>`
  );
}

export function buildHowItWorksSteps(intent) {
  const plat = getPlatform(intent.platform);
  if (isImageIntent(intent)) {
    return [
      `Drop a photo — crop ratio and output dimensions are already set for ${plat?.name || intent.platform}.`,
      `Click Compress (or Convert). Processing runs locally in the browser.`,
      `Download when the file passes the ${plat?.max_output_label || 'platform'} size check.`,
    ];
  }
  return [
    `Drop your PDF — preset and DPI are locked for ${plat?.name || intent.platform}.`,
    `Click Compress All. Processing runs locally.`,
    `Download when output is within ${plat?.max_attachment_label || 'the platform limit'}.`,
  ];
}

export function buildDeepDive(intent) {
  const plat = getPlatform(intent.platform);
  const src = formats()[intent.formatIn];
  const out = formats()[intent.formatOut];
  const w = intent.widget;
  if (!plat) return '';

  if (isImageIntent(intent)) {
    const lines = [
      `<p><strong>${plat.name}</strong> (${plat.source_url}): aspect <code>${plat.aspect_ratio}</code>, ` +
        `minimum ${plat.min_width_px}×${plat.min_height_px} px, maximum file weight ${plat.max_output_label} ` +
        `(${plat.max_output_bytes.toLocaleString('en-US')} bytes), color profile ${plat.color_profile}. ` +
        `${plat.notes}</p>`,
      `<p>Output format: <strong>${out?.name || 'JPEG'}</strong> (${out?.codec || 'DCT'}, ${out?.bit_depth || '8-bit'}). ` +
        (src?.transparency && !out?.transparency
          ? `${src.name} transparency (${src.transparency_note}) is flattened before JPEG encode. `
          : '') +
        `This page locks export to ${w.outputWidth}×${w.outputHeight} px at ${w.quality}% JPEG quality.</p>`,
    ];
    if (w.aspectRatio) {
      lines.push(
        `<p>Aspect ratio <strong>${plat.aspect_ratio}</strong> is locked in the crop tool so the selection frame cannot drift from marketplace requirements.</p>`,
      );
    }
    return lines.join('\n');
  }

  const lines = [];
  if (src?.id === out?.id) {
    lines.push(
      `<p>Compresses <strong>${src.name}</strong> (${src.codec}) via PDF.js render at ${w.dpi} DPI, ` +
        `JPEG ${w.quality}%, pdf-lib reassembly — locked to ${plat.name}.</p>`,
    );
  }
  lines.push(
    `<p><strong>${plat.name}</strong>: max ${plat.max_attachment_label} (${plat.max_attachment_bytes.toLocaleString('en-US')} bytes). ` +
      `${plat.notes} Preset <code>${w.preset}</code> is locked on this URL.</p>`,
  );
  return lines.join('\n');
}

export function buildTechSpecsRows(intent) {
  const plat = getPlatform(intent.platform);
  const w = intent.widget;
  if (isImageIntent(intent)) {
    return [
      ['Platform', plat.name],
      ['Source documentation', plat.source_url],
      ['Aspect ratio', plat.aspect_ratio + (w.lockAspect ? ' (locked)' : '')],
      ['Output dimensions', `${w.outputWidth}×${w.outputHeight} px`],
      ['Color profile', plat.color_profile],
      ['Max file size', plat.max_output_label],
      ['JPEG quality', `${w.quality}% (locked)`],
      ['Processing', 'Canvas API + JPEG encode (browser-only)'],
      ['Network', '0 bytes of image content transmitted'],
    ];
  }
  return [
    ['Platform', `${plat.name} · max ${plat.max_attachment_label}`],
    ['Locked preset', w.preset],
    ['DPI / JPEG quality', `${w.dpi} DPI · ${w.quality}%`],
    ['Grayscale', w.grayscale ? 'On (locked)' : 'Off'],
    ['Limit checker', w.maxOutputBytes ? `Warn if &gt; ${plat.max_attachment_label}` : '—'],
    ['Processing', 'PDF.js → JPEG → pdf-lib'],
    ['Network', '0 bytes of PDF content transmitted'],
  ];
}

export function buildFaq(intent) {
  const plat = getPlatform(intent.platform);
  const w = intent.widget;
  if (isImageIntent(intent)) {
    return [
      {
        q: 'Why are crop and quality controls locked?',
        a: `This URL targets ${plat.name} specifications. Locked controls ensure the rendered UI matches the page intent — a generic resizer with Amazon-only text would be treated as a doorway page.`,
      },
      {
        q: `What if output still exceeds ${plat.max_output_label}?`,
        a: (w.limitWarning || 'Reduce JPEG quality.') + ' The checker runs after compression in your browser.',
      },
      {
        q: 'Are images uploaded to a server?',
        a: 'No. Same pipeline as /image-compress/ — Canvas and JPEG encode run locally.',
      },
      {
        q: 'Does sRGB conversion happen automatically?',
        a: `Browser canvas export uses ${plat.color_profile} for JPEG output. For print-wide-gamut sources, review color on a calibrated display before listing.`,
      },
    ];
  }
  return [
    {
      q: 'Why is the preset locked?',
      a: `Page intent is ${plat.name} (${plat.max_attachment_label}). Widget state must match URL or Google classifies the page as thin doorway content.`,
    },
    {
      q: 'What if the PDF is still too large?',
      a: w.limitWarning + ' Split at /split-pdf/ if the platform allows multiple files.',
    },
    {
      q: 'Is the file uploaded?',
      a: 'No. Client-side PDF.js + pdf-lib only.',
    },
    {
      q: 'Scanned vs text PDFs?',
      a: 'Scanned pages compress more. Text-heavy PDFs may stay above the cap — lower DPI preset or split.',
    },
  ];
}

export function buildFaqJsonLd(faqItems) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };
}

export function renderEditorial(intent, esc) {
  const specs = buildTechSpecsRows(intent)
    .map(([th, td]) => `        <tr><th>${th}</th><td>${td}</td></tr>`)
    .join('\n');
  const faq = buildFaq(intent)
    .map(
      (item) =>
        `    <details>\n      <summary>${esc(item.q)}</summary>\n      <div class="faq-a">${esc(item.a)}</div>\n    </details>`,
    )
    .join('\n');
  const steps = buildHowItWorksSteps(intent)
    .map((s) => `      <li>${esc(s)}</li>`)
    .join('\n');

  return `<section class="editorial" aria-label="Guide for ${esc(intent.slug)}">

  <section id="security" class="seo-section seo-security">
    <h2>Security: browser-only processing</h2>
    ${buildSecurityNote(intent)}
  </section>

  <section id="how-it-works" class="seo-section seo-steps">
    <h2>How it works in 3 steps</h2>
    <ol>
${steps}
    </ol>
  </section>

  <section id="tech-specs" class="seo-section">
    <h2>Technical specifications</h2>
    <table class="seo-table">
      <tbody>
${specs}
      </tbody>
    </table>
  </section>

  <section id="deep-dive" class="seo-section seo-deep-dive">
    <h2>Platform limits and processing</h2>
    ${buildDeepDive(intent)}
  </section>

  <section id="faq" class="seo-section seo-faq">
    <h2>Frequently asked questions</h2>
${faq}
  </section>

</section>`;
}
