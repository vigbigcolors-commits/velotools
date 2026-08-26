/**
 * Unique human Experience copy per flagship tool (founder voice).
 * Never clone this text across tools — each must stay tool-specific.
 */
export const TOOL_EXPERIENCE = {
  'image-compress': {
    title: 'From the builder: why this compressor exists',
    body: `I kept sending client photos to upload-based compressors and hated the wait — and the risk. This tool is the one I use before shipping WebP/AVIF to production: Canvas decode on device, live preview, batch up to 15, RAW preview extract when a full demosaic is not available. If quality looks wrong at 80%, drop to 70% and compare — that loop is why the preview is here.`,
    links: [
      { href: '/lab/why-zero-upload/', label: 'Why zero upload' },
      { href: '/bgremover/', label: 'BG Remover' },
      { href: '/methodology/', label: 'Methodology' },
    ],
  },
  bgremover: {
    title: 'From the builder: on-device cutouts',
    body: `Catalog and portrait work taught me that “free removers” often mean your face sits on someone else’s GPU. Here the isnet WASM model runs in the browser; Refine exists because hair and jewelry fail on the first pass. I still export PNG for design tools and JPG-with-white when a marketplace demands a white field — that is a workflow choice, not a slogan.`,
    links: [
      { href: '/lab/', label: 'Lab Notes' },
      { href: '/image-compress/', label: 'Image Compressor' },
      { href: '/bgremover/for-ecommerce/', label: 'Ecommerce preset' },
    ],
  },
  invoice: {
    title: 'From the builder: invoices without an account',
    body: `Early freelance work meant either Word templates or SaaS that held client names on a server. This generator builds the PDF in the browser — logo, tax, currencies — so billing data never becomes someone else’s CRM. I use it when a one-off invoice must leave the machine in under a minute with no watermark.`,
    links: [
      { href: '/about/', label: 'About Vigen' },
      { href: '/qr/', label: 'QR for payment pages' },
      { href: '/methodology/', label: 'Methodology' },
    ],
  },
  qr: {
    title: 'From the builder: QR that stays local',
    body: `Printed menus and Wi‑Fi cards do not need a tracking short-link middleman. Generate URL, Wi‑Fi, or vCard here, set colors, export SVG/PNG — the payload never leaves the tab. I check quiet-zone and contrast on a phone camera before print; that field test is why custom colors exist.`,
    links: [
      { href: '/invoice/', label: 'Invoice Generator' },
      { href: '/lab/', label: 'Lab Notes' },
      { href: '/about/', label: 'About' },
    ],
  },
  focus: {
    title: 'From the builder: Focus Room as a boundary',
    body: `Context-switching between build, ops, and support wrecked deep work. Focus Room is the timer + ambient stack I actually leave open: fixed blocks, no account, no “streak” gamification. Profession presets exist because a 25/5 default is wrong for roadmap writing — the numbers on the page must match the clock.`,
    links: [
      { href: '/tools/backend-developer/focus-room/', label: 'Backend preset' },
      { href: '/lab/', label: 'Lab Notes' },
      { href: '/methodology/', label: 'Methodology' },
    ],
  },
  'compress-pdf': {
    title: 'From the builder: PDF size without the upload',
    body: `Scanned contracts and course packs blew past email limits. Upload compressors were a non-starter for client PDFs. This page re-encodes with PDF.js / pdf-lib in memory — Screen/Web/Print/Archive presets match the job, not a marketing slider. Grayscale when text is the only signal; keep color for design proofs.`,
    links: [
      { href: '/pdf-tools/', label: 'All PDF tools' },
      { href: '/merge-pdf/', label: 'Merge PDF' },
      { href: '/lab/why-zero-upload/', label: 'Why zero upload' },
    ],
  },
  'pdf-tools': {
    title: 'From the builder: one PDF hub, eight jobs',
    body: `I split PDF work into merge, split, rotate, compress, convert, unlock, and protect because a single “do everything” page hid the real action. Each tool stays zero-upload. Start here when you know the job; jump to Compress when size is the only problem.`,
    links: [
      { href: '/compress-pdf/', label: 'Compress PDF' },
      { href: '/merge-pdf/', label: 'Merge PDF' },
      { href: '/methodology/', label: 'Methodology' },
    ],
  },
  'merge-pdf': {
    title: 'From the builder: merge without a portal',
    body: `Combining signed pages and exhibits used to mean another upload portal. Merge runs locally so order control stays in your hands — drag, reorder, download. I verify page count against the source set before sending to a client.`,
    links: [
      { href: '/pdf-tools/', label: 'PDF hub' },
      { href: '/split-pdf/', label: 'Split PDF' },
      { href: '/compress-pdf/', label: 'Compress PDF' },
    ],
  },
  'split-pdf': {
    title: 'From the builder: extract only what you need',
    body: `Shipping a full deck when someone asked for three slides wasted bandwidth and leaked extras. Split keeps ranges local. Extract the pages you need, then compress if email still rejects the size.`,
    links: [
      { href: '/pdf-tools/', label: 'PDF hub' },
      { href: '/merge-pdf/', label: 'Merge PDF' },
      { href: '/compress-pdf/', label: 'Compress PDF' },
    ],
  },
  'rotate-pdf': {
    title: 'From the builder: fix scan orientation first',
    body: `Phone scans land sideways more often than people admit. Rotate here before merge or compress — fixing orientation after compression is a wasted pass. Local only; no queue.`,
    links: [
      { href: '/pdf-tools/', label: 'PDF hub' },
      { href: '/compress-pdf/', label: 'Compress PDF' },
      { href: '/jpg-to-pdf/', label: 'JPG to PDF' },
    ],
  },
  'pdf-to-jpg': {
    title: 'From the builder: pages as images when portals demand it',
    body: `Some marketplaces and LMS forms want JPG, not PDF. Convert page rasters locally, then run Image Compressor if the portal has a size cap. Do not upload a full contract to a random converter to get one preview frame.`,
    links: [
      { href: '/jpg-to-pdf/', label: 'JPG to PDF' },
      { href: '/image-compress/', label: 'Image Compressor' },
      { href: '/pdf-tools/', label: 'PDF hub' },
    ],
  },
  'jpg-to-pdf': {
    title: 'From the builder: photo stacks into one PDF',
    body: `Receipt stacks and whiteboard shots become one PDF here — order matters, so review thumbnails before export. Keep this local when the photos include addresses or kids in the background.`,
    links: [
      { href: '/pdf-to-jpg/', label: 'PDF to JPG' },
      { href: '/merge-pdf/', label: 'Merge PDF' },
      { href: '/image-compress/', label: 'Image Compressor' },
    ],
  },
  'unlock-pdf': {
    title: 'From the builder: unlock only what you own',
    body: `This removes a password you already know so you can edit or compress a file you own. It is not a bypass toy for other people’s documents. After unlock, Protect if you need to re-seal a deliverable.`,
    links: [
      { href: '/protect-pdf/', label: 'Protect PDF' },
      { href: '/compress-pdf/', label: 'Compress PDF' },
      { href: '/methodology/', label: 'Methodology' },
    ],
  },
  'protect-pdf': {
    title: 'From the builder: seal before you send',
    body: `Client drafts leave the machine with a password I set here — Standard Security Handler in the file, not a “secure link” on a stranger’s server. Remember the password; we cannot recover it because we never saw the file.`,
    links: [
      { href: '/unlock-pdf/', label: 'Unlock PDF' },
      { href: '/pdf-tools/', label: 'PDF hub' },
    ],
  },
  'compress-jpg-online': {
    title: 'From the builder: JPG-only fast path',
    body: `When the job is only JPEG size for email or forms, this path stays narrower than the full Image Compressor. Still zero upload. For WebP/AVIF or batch RAW, use the main compressor instead.`,
    links: [
      { href: '/image-compress/', label: 'Full Image Compressor' },
      { href: '/lab/why-zero-upload/', label: 'Why zero upload' },
      { href: '/about/', label: 'About' },
    ],
  },
  'invoice-no-watermark': {
    title: 'From the builder: why “no watermark” is a product rule',
    body: `Client invoices with a tool logo look unprofessional. This page exists because freelancers search that exact constraint. The generator itself is the same local PDF pipeline as /invoice/ — no account, no watermark, data stays in the tab. If you only need the tool, open Invoice; if you need the policy, read Methodology.`,
    links: [
      { href: '/invoice/', label: 'Open Invoice Generator' },
      { href: '/methodology/', label: 'Methodology' },
      { href: '/lab/', label: 'Lab Notes' },
    ],
  },
};

export const CORE_TOOL_DIRS = Object.keys(TOOL_EXPERIENCE);
