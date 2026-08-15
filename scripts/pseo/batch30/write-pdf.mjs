/**
 * Batch-30 writer: platforms + intents + compress PDF editorials.
 * Run: node scripts/pseo/batch30/write-pdf.mjs
 */
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../../..');

const platforms = {
  'yahoo-mail': {
    id: 'yahoo-mail',
    name: 'Yahoo Mail',
    category: 'email',
    max_attachment_bytes: 26214400,
    max_attachment_label: '25 MB',
    notes:
      'Yahoo Mail consumer attachments commonly fail near a ~25 MB total message budget (similar to Gmail). Scanned packets and deck exports trip Send even when page count looks small.',
    recommended_preset: 'web',
    recommended_dpi: 96,
  },
  'proton-mail': {
    id: 'proton-mail',
    name: 'Proton Mail',
    category: 'email',
    max_attachment_bytes: 26214400,
    max_attachment_label: '25 MB',
    notes:
      'Proton Mail encrypts at rest on their side after you attach; this page still compresses locally first so sensitive PDFs never hit a third-party compress site. Practical ~25 MB attachment comfort for free/plus tiers unless your plan documents otherwise.',
    recommended_preset: 'web',
    recommended_dpi: 96,
  },
  'google-classroom': {
    id: 'google-classroom',
    name: 'Google Classroom',
    category: 'education',
    max_attachment_bytes: 104857600,
    max_attachment_label: '100 MB',
    notes:
      'Classroom inherits Drive-like ceilings, but teachers and students on phones abandon oversized homework PDFs. Practical Screen target keeps submissions openable in the Classroom app without long spinners.',
    recommended_preset: 'screen',
    recommended_dpi: 72,
  },
  brightspace: {
    id: 'brightspace',
    name: 'Brightspace (D2L)',
    category: 'education',
    max_attachment_bytes: 10485760,
    max_attachment_label: '10 MB',
    notes:
      'Many Brightspace / D2L courses enforce assignment upload caps near 10 MB (org-configurable). Phone worksheet photos routinely blow past that without a Screen pass.',
    recommended_preset: 'screen',
    recommended_dpi: 72,
  },
  schoology: {
    id: 'schoology',
    name: 'Schoology',
    category: 'education',
    max_attachment_bytes: 5242880,
    max_attachment_label: '5 MB',
    notes:
      'K-12 Schoology assignments often inherit tight school-district upload ceilings near 5 MB. Grayscale Screen mode is intentional for worksheet photos.',
    recommended_preset: 'screen',
    recommended_dpi: 72,
  },
  gradescope: {
    id: 'gradescope',
    name: 'Gradescope',
    category: 'education',
    max_attachment_bytes: 20971520,
    max_attachment_label: '20 MB',
    notes:
      'Gradescope accepts multi-page exam scans; a practical ~20 MB target keeps bubble sheets and handwritten pages uploadable without crushing OCR-critical contrast entirely.',
    recommended_preset: 'web',
    recommended_dpi: 96,
  },
  jira: {
    id: 'jira',
    name: 'Jira',
    category: 'productivity',
    max_attachment_bytes: 10485760,
    max_attachment_label: '10 MB',
    notes:
      'Atlassian Cloud Jira attachments are commonly limited near 10 MB per file (site admins can change it). Design PDFs and log dumps need a Screen/Web tradeoff before ticket upload.',
    recommended_preset: 'web',
    recommended_dpi: 96,
  },
  confluence: {
    id: 'confluence',
    name: 'Confluence',
    category: 'productivity',
    max_attachment_bytes: 10485760,
    max_attachment_label: '10 MB',
    notes:
      'Confluence page attachments and macros feel sluggish past ~10 MB in many Cloud sites. Mild Web quality keeps architecture PDFs embeddable without timing out the editor.',
    recommended_preset: 'web',
    recommended_dpi: 96,
  },
  asana: {
    id: 'asana',
    name: 'Asana',
    category: 'productivity',
    max_attachment_bytes: 104857600,
    max_attachment_label: '100 MB',
    notes:
      'Asana allows large task attachments on paid plans, but mobile task views stall on bloated PDFs. Practical Web comfort near 100 MB with annotation strip for design exports.',
    recommended_preset: 'web',
    recommended_dpi: 96,
  },
  box: {
    id: 'box',
    name: 'Box',
    category: 'cloud',
    max_attachment_bytes: 52428800,
    max_attachment_label: '50 MB',
    notes:
      'Box enterprise quotas vary; a practical ~50 MB PDF keeps browser uploads and shared-link previews comfortable for external reviewers without forcing desktop sync only.',
    recommended_preset: 'web',
    recommended_dpi: 96,
  },
  onedrive: {
    id: 'onedrive',
    name: 'OneDrive',
    category: 'cloud',
    max_attachment_bytes: 104857600,
    max_attachment_label: '100 MB',
    notes:
      'OneDrive/SharePoint can store huge files, but emailing a OneDrive link still fails when someone insists on a direct PDF attach under mail caps. Mild Web quality trims export bloat before share.',
    recommended_preset: 'web',
    recommended_dpi: 96,
  },
  messenger: {
    id: 'messenger',
    name: 'Facebook Messenger',
    category: 'messaging',
    max_attachment_bytes: 26214400,
    max_attachment_label: '25 MB',
    notes:
      'Messenger document sends on mobile are unreliable once PDFs climb past a practical ~25 MB comfort zone (client/version dependent). Screen/Web hybrid keeps receipts and forms shareable in chat.',
    recommended_preset: 'web',
    recommended_dpi: 96,
  },
};

/** Distinct fingerprints — quality values unused by existing intents */
const intents = [
  {
    slug: 'compress-pdf-for-yahoo-mail',
    platform: 'yahoo-mail',
    title: 'Compress PDF for Yahoo Mail — Fix Oversized Attachments (~25 MB) | VeloTools',
    description:
      'Yahoo Mail rejecting a PDF? Shrink under a practical ~25 MB message budget in your browser — Web preset, no upload to VeloTools.',
    h1: 'Make Yahoo Mail accept that oversized PDF',
    h1Em: 'Yahoo Mail',
    heroLead:
      'Yahoo Mail often fails Send near a ~25 MB total budget. This page locks an email Web preset with a live size check so you compress on-device, then attach from Yahoo yourself.',
    widget: {
      preset: 'web',
      quality: 61,
      dpi: 96,
      grayscale: false,
      stripMetadata: true,
      stripAnnotations: true,
      maxOutputBytes: 26214400,
      lock: ['preset', 'dpi'],
      limitWarning: 'Still over 25 MB — split the packet or remove unused image pages.',
    },
    intentBanner: 'Yahoo Mail mode: Web (96 DPI · 61% JPEG) · 25 MB checker',
  },
  {
    slug: 'compress-pdf-for-proton-mail',
    platform: 'proton-mail',
    title: 'Compress PDF for Proton Mail — Private Local Shrink Before Encrypt | VeloTools',
    description:
      'Compress sensitive PDFs under ~25 MB locally before attaching in Proton Mail — browser-only, no third-party compress upload.',
    h1: 'Shrink PDFs for Proton Mail without a compress site',
    h1Em: 'Proton Mail',
    heroLead:
      'Proton protects mail after attach — this page protects the compress step. Locked Web preset, ~25 MB checker, pixels stay in your tab until you attach in Proton.',
    widget: {
      preset: 'web',
      quality: 59,
      dpi: 96,
      grayscale: false,
      stripMetadata: true,
      stripAnnotations: false,
      maxOutputBytes: 26214400,
      lock: ['preset', 'dpi'],
      limitWarning: 'Still over 25 MB — strip scans or use Proton Drive link for huge packets.',
    },
    intentBanner: 'Proton Mail mode: Web (96 DPI · 59% JPEG · keep annotations) · 25 MB checker',
  },
  {
    slug: 'compress-pdf-for-google-classroom',
    platform: 'google-classroom',
    title: 'Compress PDF for Google Classroom — Homework That Opens on Phones | VeloTools',
    description:
      'Classroom PDF too heavy for the app? Screen-compress homework locally with a practical size path — no upload to VeloTools, then submit in Classroom.',
    h1: 'Shrink Classroom homework PDFs students can actually open',
    h1Em: 'Google Classroom',
    heroLead:
      'Classroom may allow large Drive files, but phone apps stall on bloated scans. This URL locks a Screen preset so tonight’s PDF opens after you submit.',
    widget: {
      preset: 'screen',
      quality: 44,
      dpi: 72,
      grayscale: true,
      stripMetadata: true,
      stripAnnotations: true,
      maxOutputBytes: 15728640,
      lock: ['preset', 'dpi'],
      limitWarning: 'Still huge for phones — remove blank pages or split the lab appendix.',
    },
    intentBanner: 'Classroom mode: Screen + grayscale (72 DPI · 44%) · mobile-friendly target',
  },
  {
    slug: 'compress-pdf-for-brightspace',
    platform: 'brightspace',
    title: 'Compress PDF for Brightspace D2L — Beat ~10 MB Assignment Caps | VeloTools',
    description:
      'Brightspace saying file too large? Compress under a common ~10 MB course cap in-browser with Screen preset — private, no account.',
    h1: 'Fix Brightspace “file too large” PDF uploads',
    h1Em: 'Brightspace',
    heroLead:
      'D2L Brightspace courses often cap assignments near 10 MB. Lock Screen quality here, clear the checker, then upload the PDF into Brightspace yourself.',
    widget: {
      preset: 'screen',
      quality: 46,
      dpi: 72,
      grayscale: true,
      stripMetadata: true,
      stripAnnotations: true,
      maxOutputBytes: 10485760,
      lock: ['preset', 'dpi'],
      limitWarning: 'Still over 10 MB — drop color figures or split modules.',
    },
    intentBanner: 'Brightspace mode: Screen + grayscale (72 DPI · 46%) · 10 MB checker',
  },
  {
    slug: 'compress-pdf-for-schoology',
    platform: 'schoology',
    title: 'Compress PDF for Schoology — K-12 Uploads Under ~5 MB | VeloTools',
    description:
      'Schoology assignment blocked? Shrink worksheet photos under a common ~5 MB district cap — grayscale Screen preset, browser-only.',
    h1: 'Get Schoology to accept that worksheet PDF',
    h1Em: 'Schoology',
    heroLead:
      'Many K-12 Schoology courses inherit ~5 MB upload ceilings. This page forces Screen + grayscale so camera worksheets fit before the deadline banner.',
    widget: {
      preset: 'screen',
      quality: 38,
      dpi: 72,
      grayscale: true,
      stripMetadata: true,
      stripAnnotations: true,
      maxOutputBytes: 5242880,
      lock: ['preset', 'dpi', 'grayscale'],
      limitWarning: 'Still over 5 MB — photograph one page at a time or split the packet.',
    },
    intentBanner: 'Schoology mode: Screen + grayscale (72 DPI · 38%) · 5 MB checker',
  },
  {
    slug: 'compress-pdf-for-gradescope',
    platform: 'gradescope',
    title: 'Compress PDF for Gradescope — Exam Scans Under ~20 MB | VeloTools',
    description:
      'Gradescope upload failing on a fat scan? Compress multi-page exams toward ~20 MB locally — keep contrast for bubbles, no cloud compress site.',
    h1: 'Fit exam scans into Gradescope without wrecking bubbles',
    h1Em: 'Gradescope',
    heroLead:
      'Multi-page exam photos explode past practical upload comfort. This URL locks a Web preset aimed at ~20 MB so bubble sheets stay readable after you upload to Gradescope.',
    widget: {
      preset: 'web',
      quality: 71,
      dpi: 96,
      grayscale: true,
      stripMetadata: true,
      stripAnnotations: true,
      maxOutputBytes: 20971520,
      lock: ['preset', 'dpi'],
      limitWarning: 'Still over 20 MB — rescan at lower phone resolution or split by question groups.',
    },
    intentBanner: 'Gradescope mode: Web grayscale (96 DPI · 71%) · 20 MB scan checker',
  },
  {
    slug: 'compress-pdf-for-jira',
    platform: 'jira',
    title: 'Compress PDF for Jira — Ticket Attachments Under ~10 MB | VeloTools',
    description:
      'Jira rejecting a design PDF? Shrink under a common ~10 MB attachment limit in your browser — strip metadata, keep ticket notes private.',
    h1: 'Attach PDFs to Jira without the 10 MB bounce',
    h1Em: 'Jira',
    heroLead:
      'Atlassian Cloud often caps ticket files near 10 MB. Compress design dumps here with a locked Web preset, then attach on the issue — nothing uploaded to us.',
    widget: {
      preset: 'web',
      quality: 57,
      dpi: 96,
      grayscale: false,
      stripMetadata: true,
      stripAnnotations: true,
      maxOutputBytes: 10485760,
      lock: ['preset', 'dpi'],
      limitWarning: 'Still over 10 MB — export fewer pages from Figma or use Screen on the main tool.',
    },
    intentBanner: 'Jira mode: Web (96 DPI · 57% JPEG · strip annotations) · 10 MB checker',
  },
  {
    slug: 'compress-pdf-for-confluence',
    platform: 'confluence',
    title: 'Compress PDF for Confluence — Page Attachments Under ~10 MB | VeloTools',
    description:
      'Confluence editor timing out on a PDF? Compress toward ~10 MB locally so architecture docs embed without stalling the page.',
    h1: 'Keep Confluence pages responsive with smaller PDF attaches',
    h1Em: 'Confluence',
    heroLead:
      'Wiki embeds crawl when PDFs climb past ~10 MB. Lock Web quality here, clear the checker, then attach inside Confluence on your own session.',
    widget: {
      preset: 'web',
      quality: 55,
      dpi: 96,
      grayscale: false,
      stripMetadata: true,
      stripAnnotations: true,
      maxOutputBytes: 10485760,
      lock: ['preset', 'dpi'],
      limitWarning: 'Still over 10 MB — split chapters into separate Confluence attachments.',
    },
    intentBanner: 'Confluence mode: Web (96 DPI · 55% JPEG) · 10 MB embed checker',
  },
  {
    slug: 'compress-pdf-for-asana',
    platform: 'asana',
    title: 'Compress PDF for Asana — Task Files That Open on Mobile | VeloTools',
    description:
      'Asana task PDF too heavy for phones? Trim design exports with a Web preset and annotation strip — browser-only, then attach on the task.',
    h1: 'Shrink Asana task PDFs collaborators can open on phones',
    h1Em: 'Asana',
    heroLead:
      'Asana may allow large uploads, but mobile task views stall on bloated decks. This page locks Web quality with annotation stripping before you attach.',
    widget: {
      preset: 'web',
      quality: 69,
      dpi: 96,
      grayscale: false,
      stripMetadata: true,
      stripAnnotations: true,
      maxOutputBytes: 52428800,
      lock: ['preset', 'quality'],
      limitWarning: 'Still huge — remove unused artboards or split the brief.',
    },
    intentBanner: 'Asana mode: Web (96 DPI · 69% JPEG · strip annotations) · mobile comfort',
  },
  {
    slug: 'compress-pdf-for-box',
    platform: 'box',
    title: 'Compress PDF for Box — Shared Links Under ~50 MB Comfort | VeloTools',
    description:
      'Box upload or preview crawling? Compress a PDF toward a practical ~50 MB share comfort zone in-browser before you generate the link.',
    h1: 'Prep client PDFs for Box shares without desktop-only sync',
    h1Em: 'Box',
    heroLead:
      'Enterprise quotas vary, but browser previews hate 200 MB art PDFs. Lock a Web preset with a ~50 MB checker, download, then upload to Box yourself.',
    widget: {
      preset: 'web',
      quality: 73,
      dpi: 96,
      grayscale: false,
      stripMetadata: true,
      stripAnnotations: false,
      maxOutputBytes: 52428800,
      lock: ['preset', 'dpi'],
      limitWarning: 'Still over 50 MB — keep annotations off or split print masters.',
    },
    intentBanner: 'Box mode: Web (96 DPI · 73% JPEG · annotations kept) · 50 MB checker',
  },
  {
    slug: 'compress-pdf-for-onedrive',
    platform: 'onedrive',
    title: 'Compress PDF for OneDrive — Shareable Files Without Mail Cap Pain | VeloTools',
    description:
      'OneDrive file fine but email attach fails? Compress export bloat locally with a mild Web preset before you share or attach elsewhere.',
    h1: 'Trim OneDrive PDFs before mail caps reject them',
    h1Em: 'OneDrive',
    heroLead:
      'Storage is not the problem — attachment and preview are. This page locks mild Web quality so SharePoint/OneDrive PDFs stay under common mail ceilings when someone demands a direct file.',
    widget: {
      preset: 'web',
      quality: 74,
      dpi: 96,
      grayscale: false,
      stripMetadata: true,
      stripAnnotations: false,
      maxOutputBytes: 26214400,
      lock: ['preset', 'dpi'],
      limitWarning: 'Still over 25 MB for mail — use a OneDrive link or split the deck.',
    },
    intentBanner: 'OneDrive mode: Web (96 DPI · 74% JPEG) · 25 MB mail-path checker',
  },
  {
    slug: 'compress-pdf-for-messenger',
    platform: 'messenger',
    title: 'Compress PDF for Messenger — Chat Documents Under ~25 MB | VeloTools',
    description:
      'Facebook Messenger failing on a PDF send? Compress toward a practical ~25 MB chat comfort zone in your browser — then share the file in Messenger.',
    h1: 'Send PDFs in Messenger without the endless spinner',
    h1Em: 'Messenger',
    heroLead:
      'Mobile Messenger document sends stall once PDFs climb past a practical ~25 MB zone. Lock Web quality here, download, then attach in the chat yourself.',
    widget: {
      preset: 'web',
      quality: 56,
      dpi: 96,
      grayscale: false,
      stripMetadata: true,
      stripAnnotations: true,
      maxOutputBytes: 26214400,
      lock: ['preset', 'dpi'],
      limitWarning: 'Still over 25 MB — switch to Screen on Compress PDF or send via Drive link.',
    },
    intentBanner: 'Messenger mode: Web (96 DPI · 56% JPEG) · 25 MB chat checker',
  },
];

function editorial(p) {
  const name = p.name;
  const slug = p.slug;
  const label = p.maxLabel;
  const siblingA = p.sibA;
  const siblingB = p.sibB;
  const audience = p.audience;
  const fail = p.fail;
  const privacy = p.privacy;
  const mech = p.mech;
  const next = p.next;
  const faq = p.faq;
  return {
    securityH2: p.securityH2,
    securityHtml: `<p>${p.sec1}</p>\n<p>${p.sec2}</p>\n<p>${p.sec3}</p>`,
    problemH2: p.problemH2,
    problemHtml: `<p>${p.prob1}</p>\n<p>${p.prob2}</p>\n<p>${p.prob3}</p>`,
    stepsH2: p.stepsH2,
    steps: p.steps,
    specsH2: p.specsH2,
    specs: p.specs,
    presetH2: p.presetH2,
    presetHtml: `<p>${p.pre1}</p>\n<p>${p.pre2}</p>`,
    deepH2: p.deepH2,
    deepHtml: `<p>${p.deep1}</p>\n<p>${p.deep2}</p>\n<p>${p.deep3}</p>\n<p>${p.deep4}</p>`,
    faqH2: p.faqH2,
    faq,
  };
}

/** Unique narrative packs — one per slug */
const packs = {
  'compress-pdf-for-yahoo-mail': {
    securityH2: 'Compress for Yahoo Mail without a third-party upload',
    sec1: 'Yahoo Mail’s “message too large” banner is annoying enough without also trusting a random compressor with tax PDFs or lease scans. On this URL the browser reads the file, applies a locked email Web preset, and you download a smaller PDF to attach yourself.',
    sec2: 'VeloTools never receives the bytes. Tab memory holds the working copy until you close the tab — the same Zero-Backend model as our other PDF tools.',
    sec3: 'When the checker clears, attach from Yahoo Mail the normal way. Compression finished locally; only Yahoo sees what you choose to send.',
    problemH2: 'Why Yahoo Mail keeps bouncing oversized PDFs',
    prob1: 'Consumer Yahoo Mail commonly behaves like a ~25 MB total message budget. Inline images in the reply chain eat the same pie as your attachment, so a “22 MB PDF” can still fail Send.',
    prob2: 'Phone camera exports and PowerPoint-to-PDF decks are the usual offenders: full-color pages at high DPI cross the line even when page count looks modest.',
    prob3: 'This page exists for that exact failure mode — get under a practical 25 MB ceiling while keeping the file readable in Yahoo’s mobile preview.',
    stepsH2: 'Steps when Yahoo refuses the attachment',
    steps: [
      'Drop the PDF Yahoo Mail rejected — the 25 MB email Web preset is already locked on this page.',
      'Run Compress All and wait until the size check shows under 25 MB before you download.',
      'Download, open Yahoo Mail, attach the new file. Still blocked? Split chapters or strip unused photo pages first.',
    ],
    specsH2: 'Yahoo Mail defaults locked on this URL',
    specs: [
      ['Problem', 'Yahoo Mail attachment / message too large'],
      ['Size check', '25 MB'],
      ['Preset', 'Web · 96 DPI · 61% JPEG'],
      ['Color', 'Kept for contracts and slides'],
      ['Privacy', 'No upload to VeloTools'],
      ['Related', 'Gmail sibling · Split PDF'],
    ],
    presetH2: 'Why Yahoo mode uses a gentler Web email preset',
    pre1: 'Yahoo’s practical ceiling sits near Gmail’s class of limit, so we avoid the aggressive grayscale Screen crush used for 5 MB LMS portals. Web quality around 96 DPI keeps body text crisp in Yahoo’s reader.',
    pre2: 'Metadata that only inflates exports is stripped. If you still miss the mark, split before you destroy readability — do not jump straight to the harshest Screen pass.',
    deepH2: 'Yahoo vs Gmail vs iCloud — pick the right email compressor',
    deep1: 'Yahoo Mail’s everyday failure looks like Gmail’s 25 MB wall, but reply threads with quoted HTML can steal headroom you thought you had. Leave a little margin under the checker.',
    deep2: 'Compared with <a href="/compress-pdf-for-gmail/">Gmail’s 25 MB page</a>, this URL uses a slightly firmer JPEG quality (61) because Yahoo previews on older Android mail apps forgive less ringing on scanned text.',
    deep3: 'If you live in Apple’s stack, <a href="/compress-pdf-for-icloud-mail/">iCloud Mail’s ~20 MB path</a> is tighter — switch there instead of reusing this preset. For chapter splits, open <a href="/split-pdf/">Split PDF</a>.',
    deep4: 'Browse the rest of the suite under <a href="/pdf-tools/">PDF tools</a> when you need merge or unlock after shrinking for Yahoo.',
    faqH2: 'Yahoo Mail PDF size questions',
    faq: [
      { q: 'Why does Yahoo Mail say my PDF is too large?', a: 'Consumer accounts commonly fail near a ~25 MB total message size. Body HTML plus attachments share that budget, so a PDF that looks “almost fine” still blocks Send.' },
      { q: 'Can I compress for Yahoo without uploading to a website?', a: 'Yes. This page processes in your browser only. Download the result, then attach inside Yahoo Mail yourself.' },
      { q: 'Will the recipient still open it?', a: 'You get a standard PDF. Heavy scans become page images, so search may weaken, but Yahoo preview and desktop readers open it.' },
      { q: 'What if it stays over 25 MB?', a: 'Split the packet, remove unused photo pages, or run a stronger Screen pass on the main Compress PDF tool.' },
      { q: 'Is a Drive link better?', a: 'Links dodge attachment caps, but only when the other person can access the folder. Compressing wins when they expect a simple attached file.' },
    ],
  },
  'compress-pdf-for-proton-mail': {
    securityH2: 'Local shrink before Proton Mail encryption takes over',
    sec1: 'Proton Mail encrypts messages on their infrastructure after you attach. That does not help if you first uploaded the same PDF to a public “free compressor.” Here the shrink step stays on-device.',
    sec2: 'Sensitive legal and medical PDFs never transit VeloTools. We re-encode pages in tab memory; you download, then attach inside Proton.',
    sec3: 'Annotations stay on by default so counsel markup survives. Close the tab when finished — nothing was stored with us.',
    problemH2: 'Proton users still hit attachment size walls',
    prob1: 'Encrypted mail does not magically raise attachment physics. Free and many Plus workflows still feel a practical ~25 MB comfort zone for everyday attaches.',
    prob2: 'People then bounce to sketchy compress sites that defeat the whole point of choosing Proton. The safer path is a local Web preset with a live size check.',
    prob3: 'This URL targets that contradiction: privacy-preserving compression before a privacy-preserving mailbox.',
    stepsH2: 'How to attach a smaller PDF in Proton Mail',
    steps: [
      'Add the oversized PDF — Web preset with annotations kept is already locked for review workflows.',
      'Compress All until the 25 MB checker clears, then download to your device.',
      'Attach the download in Proton Mail. Still large? Use Proton Drive sharing for archives instead of forcing one attach.',
    ],
    specsH2: 'Proton Mail–oriented locks',
    specs: [
      ['Problem', 'Proton Mail attachment too large / privacy-safe compress'],
      ['Size check', '25 MB'],
      ['Preset', 'Web · 96 DPI · 59% JPEG'],
      ['Annotations', 'Kept'],
      ['Privacy', 'Local only before Proton attach'],
      ['Related', 'Yahoo Mail · Box'],
    ],
    presetH2: 'Why Proton mode keeps annotations',
    pre1: 'Legal and security teams mark PDFs before sending. Stripping comments by default would break that workflow, so this page keeps annotations while still trimming image bloat.',
    pre2: 'JPEG quality 59 is slightly firmer than Yahoo’s 61 because Proton users often ship dense scanned exhibits — we need a bit more crush without going full grayscale homework mode.',
    deepH2: 'Encryption after attach is not compression before attach',
    deep1: 'Proton’s threat model starts when the message leaves your client. Uploading to a compressor first creates a second processor who never should have seen the file.',
    deep2: 'Use <a href="/compress-pdf-for-yahoo-mail/">Yahoo Mail</a> only when the destination mailbox is Yahoo — different preview quirks. For enterprise shares after mail fails, try <a href="/compress-pdf-for-box/">Box</a>.',
    deep3: 'If the packet is truly archival, keep the original offline and send a Drive-style Proton link instead of destroying vector text with endless Screen passes.',
    deep4: 'More utilities: <a href="/pdf-tools/">PDF tools</a> and the unlocked <a href="/compress-pdf/">Compress PDF</a> hub when you need a one-off quality tweak.',
    faqH2: 'Proton Mail compression FAQ',
    faq: [
      { q: 'Does this upload my PDF before Proton encrypts it?', a: 'No. Compression runs in your browser. Only you upload the finished file into Proton Mail.' },
      { q: 'Why keep annotations?', a: 'Review markup is often the point of the send. This preset trims image weight without wiping comments.' },
      { q: 'What limit should I aim for?', a: 'Treat ~25 MB as a practical attachment comfort zone unless your Proton plan docs state a different hard cap.' },
      { q: 'Can I use grayscale?', a: 'Switch to the main Compress PDF tool if exhibits are monochrome scans and you need more savings.' },
      { q: 'Is Proton Drive better for huge files?', a: 'Yes for multi-hundred-megabyte archives. Compress here when the other person expects a normal attachment.' },
    ],
  },
};

// Continue packs in part 2 file - write script will merge
writeFileSync(join(root, 'scripts/pseo/batch30/_platforms-pdf.json'), JSON.stringify(platforms, null, 2));
writeFileSync(join(root, 'scripts/pseo/batch30/_intents-pdf.json'), JSON.stringify(intents, null, 2));
writeFileSync(join(root, 'scripts/pseo/batch30/_packs-pdf-partial.json'), JSON.stringify(packs, null, 2));
console.log('wrote partial pdf scaffolds', Object.keys(platforms).length, intents.length);
