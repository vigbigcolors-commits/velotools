/**
 * Shared anti-doorway metrics for handcrafted PSEO editorials.
 */
export function stripHtml(html) {
  return String(html || '')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&[a-z]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function wordCount(text) {
  return stripHtml(text)
    .split(/[^a-zA-Z0-9']+/)
    .filter((w) => w.length > 0).length;
}

/** Flatten compress/image handcrafted editorial object → plain text */
export function handcraftedPlainText(ed) {
  if (!ed) return '';
  const bits = [];
  const push = (x) => {
    if (x == null) return;
    if (Array.isArray(x)) {
      for (const row of x) {
        if (Array.isArray(row)) bits.push(row.join(' '));
        else bits.push(String(row));
      }
      return;
    }
    bits.push(String(x));
  };
  push(ed.securityH2);
  push(ed.securityHtml);
  push(ed.problemH2);
  push(ed.problemHtml);
  push(ed.stepsH2);
  push(ed.steps);
  push(ed.specsH2);
  push(ed.specs);
  push(ed.presetH2);
  push(ed.presetHtml);
  push(ed.deepH2);
  push(ed.deepHtml);
  push(ed.faqH2);
  for (const f of ed.faq || []) {
    push(f.q);
    push(f.a);
  }
  return bits.join(' ');
}

/** BG remover matrix editorial → plain text */
export function bgEditorialPlainText(ed) {
  if (!ed) return '';
  const bits = [
    ed.eyebrow,
    ed.h2,
    ed.lead,
    ed.whyPreset,
    ed.workflowTip,
    ed.privacyNote,
    ed.scenarioH2,
    ed.scenarioBody,
    ed.edgesH2,
    ed.edgesBody,
  ];
  for (const f of ed.faqs || []) {
    bits.push(f.question, f.answer);
  }
  return bits.filter(Boolean).join(' ');
}

export function normalizeParagraph(p) {
  return stripHtml(p)
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Extract paragraph-like blocks from HTML or plain multi-sentence text */
export function extractParagraphs(htmlOrText) {
  const html = String(htmlOrText || '');
  const fromTags = [...html.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)].map((m) =>
    normalizeParagraph(m[1]),
  );
  if (fromTags.length) return fromTags.filter((p) => p.split(' ').length >= 8);
  return stripHtml(html)
    .split(/(?<=[.!?])\s+/)
    .map(normalizeParagraph)
    .filter((p) => p.split(' ').length >= 12);
}

export function wordSet(t) {
  return new Set(
    stripHtml(t)
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter((w) => w.length > 3),
  );
}

export function jaccard(a, b) {
  const A = wordSet(a);
  const B = wordSet(b);
  let inter = 0;
  for (const x of A) if (B.has(x)) inter++;
  return inter / (A.size + B.size - inter || 1);
}

export function widgetFingerprint(intent) {
  const w = intent.widget || {};
  if (intent.tool === 'compress-pdf' || intent.toolMode === 'compress') {
    return [
      'pdf',
      w.preset,
      w.dpi,
      w.quality,
      w.grayscale ? 1 : 0,
      w.stripMetadata ? 1 : 0,
      w.stripAnnotations ? 1 : 0,
      w.maxOutputBytes,
      (w.lock || []).slice().sort().join(','),
    ].join('|');
  }
  return [
    'img',
    w.outputWidth,
    w.outputHeight,
    w.aspectRatio ?? '',
    w.quality,
    w.format || '',
    w.maxOutputBytes,
    (w.lock || []).slice().sort().join(','),
  ].join('|');
}

export const MIN_EDITORIAL_WORDS = 600;
export const MIN_FAQ = 5;
export const MIN_H2 = 4;
export const MAX_JACCARD = 0.35;
