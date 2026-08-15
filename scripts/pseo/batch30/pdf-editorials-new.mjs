/**
 * Batch-30 compress-pdf PSEO editorials — 12 new platform slugs.
 * Anti-doorway: unique H2/FAQ/paragraphs per slug; ≥600 words each; browser-only privacy.
 * Same field shape as scripts/seo-data/intents/compress-pdf-editorials.mjs.
 */
export const NEW_PDF_EDITORIALS = {
  'compress-pdf-for-yahoo-mail': {
    securityH2: 'Trim a Yahoo Mail PDF entirely on your own device',
    securityHtml: `<p>Yahoo Mail throws a “message too large” banner at the worst moment, and the reflex is to paste the file into whatever compressor the search engine surfaces first. That reflex hands a tax return or a signed lease to a stranger. This page removes the stranger: the browser reads the PDF, applies a locked email Web preset, and hands you a smaller file to attach.</p>
<p>Because the re-encode happens in tab memory, VeloTools never receives a single byte. The working copy exists only while the tab is open, which is the same Zero-Backend promise behind the rest of our PDF suite.</p>
<p>Once the size gauge turns green, switch to Yahoo Mail and attach the download yourself. Compression already finished on your machine, so Yahoo only ever handles the copy you deliberately choose to send.</p>`,
    problemH2: 'What actually pushes a Yahoo attachment past the wall',
    problemHtml: `<p>Consumer Yahoo Mail behaves like a roughly <strong>25 MB</strong> total-message budget rather than a clean per-file cap. The quoted reply chain, inline logos, and your PDF all draw from the same pool, so a document that measures “only 22 MB” can still bounce once the thread carries a few earlier messages.</p>
<p>The heavy files are almost always camera exports and slide decks. Twelve-megapixel phone photos of a multi-page form, saved at full colour and high DPI, balloon far beyond what the page count suggests, and a PowerPoint-to-PDF conversion drags embedded raster images along for the ride.</p>
<p>This URL is tuned for that specific dead end: land comfortably under a practical 25 MB line while keeping the pages legible in Yahoo’s own preview on an older phone.</p>`,
    stepsH2: 'Clearing a Yahoo Mail “attachment too large” bounce',
    steps: [
      'Drop in the PDF that Yahoo refused; the Web preset at 96 DPI and 61% JPEG is already locked so you do not touch a single slider.',
      'Press Compress All and wait for the on-screen gauge to confirm you are under the 25 MB mark before you save anything.',
      'Download the result, reopen Yahoo Mail, and attach it manually; if the thread is still heavy, trim quoted history or split the packet.',
    ],
    specsH2: 'What the Yahoo Mail preset pins down for you',
    specs: [
      ['Problem it solves', 'Yahoo Mail message / attachment too large'],
      ['Size check', '25 MB before download'],
      ['Preset', 'Web · 96 DPI · 61% JPEG'],
      ['Colour', 'Kept for contracts, tickets, and slides'],
      ['Privacy', 'No upload to VeloTools'],
      ['Related tools', 'Gmail sibling · Split PDF'],
    ],
    presetH2: 'Reasoning behind Yahoo’s gentle Web quality target',
    presetHtml: `<p>Yahoo’s ceiling lives in the same class as Gmail’s, so there is no reason to reach for the brutal grayscale Screen crush that a 5 MB course portal demands. A Web path near 96 DPI keeps body copy sharp inside Yahoo’s reader while shedding the export bulk that never needed to travel.</p>
<p>Metadata that only pads the file is discarded, and the JPEG quality is set at 61 rather than something lower because Yahoo previews on ageing Android mail apps expose compression ringing on scanned text. If one pass is not enough, split the document before you crank the quality down and wreck readability.</p>`,
    deepH2: 'Choosing between Yahoo, Gmail, and an Apple mailbox',
    deepHtml: `<p>Yahoo’s failure mode resembles Gmail’s classic ceiling, yet quoted HTML in a long reply chain quietly steals headroom you assumed was free. Leaving a little margin under the gauge is the difference between a clean Send and a second bounce.</p>
<p>Set against <a href="/compress-pdf-for-gmail/">the Gmail 25 MB page</a>, this URL runs a marginally firmer JPEG quality because Yahoo’s mobile preview forgives less artefacting on dense scans. When your recipient lives in Apple’s world instead, hand the job to <a href="/compress-pdf-for-onedrive/">the OneDrive mail-path checker</a> only if the file is destined for a cloud link; for a private Proton inbox, use <a href="/compress-pdf-for-proton-mail/">the Proton Mail page</a>.</p>
<p>When a single packet stays stubborn, break it apart with <a href="/split-pdf/">Split PDF</a> and send two lighter messages, or run one careful pass on <a href="/compress-pdf/">Compress PDF</a> with a stronger preset.</p>
<p>Everything else — merge, reorder, unlock — is catalogued under <a href="/pdf-tools/">PDF tools</a> once the Yahoo send finally clears.</p>`,
    faqH2: 'Yahoo Mail PDF size questions people search',
    faq: [
      { q: 'Why does Yahoo Mail claim my PDF is too large to send?', a: 'Consumer accounts fail near a 25 MB total-message budget. The reply body and every attachment share that pool, so a PDF that looks almost fine still blocks Send when the thread is long.' },
      { q: 'Can I shrink a PDF for Yahoo without a website seeing it?', a: 'Yes. This page re-encodes in your browser only. You download the smaller file and attach it inside Yahoo yourself, so nothing reaches VeloTools.' },
      { q: 'Will my recipient still be able to read the compressed pages?', a: 'You receive a standard PDF that opens in Yahoo preview and desktop readers. Very heavy scans become page images, so selectable text may weaken.' },
      { q: 'What should I try if the file is still above 25 MB?', a: 'Split the packet, delete unused photo pages, or run a firmer Screen pass on the main Compress PDF tool. One full-bleed image page is usually the culprit.' },
      { q: 'Is a shared Drive link better than compressing for Yahoo?', a: 'A link dodges the attachment budget but only helps when the recipient can open the folder. Compression wins whenever they expect a plain attached file.' },
    ],
  },

  'compress-pdf-for-proton-mail': {
    securityH2: 'Keep the compress step private before Proton takes over',
    securityHtml: `<p>Proton Mail encrypts a message on its own infrastructure after you attach, which is excellent — right up until you realise you fed the same PDF to a public “free compressor” minutes earlier. That first upload quietly creates a processor who was never supposed to touch the exhibit. This page deletes that hop entirely.</p>
<p>Signed agreements, medical letters, and evidence bundles are re-encoded in tab memory and never transit our servers. You download the trimmed copy, then attach it inside Proton like any other file.</p>
<p>Annotations remain switched on by default so counsel comments and redline notes survive the shrink. Close the tab afterwards and there is nothing on our side to close.</p>`,
    problemH2: 'Encrypted mail still runs into hard attachment physics',
    problemHtml: `<p>Encryption does not repeal file-size reality. Free and many Plus workflows still feel a practical <strong>25 MB</strong> comfort zone for everyday attachments, so a dense scanned exhibit will refuse to attach no matter how private the mailbox is.</p>
<p>Faced with that, privacy-conscious users often defeat their own choice by pasting the document into a random compress host — the exact behaviour Proton was chosen to avoid. A local Web preset with a live gauge keeps the whole chain on the device.</p>
<p>This page exists to resolve that contradiction: privacy-preserving compression feeding a privacy-preserving inbox, with no third party in the middle.</p>`,
    stepsH2: 'Attaching a lighter exhibit inside Proton Mail',
    steps: [
      'Add the oversized PDF; the Web preset at 59% JPEG with annotations preserved is already locked for review-heavy sends.',
      'Run Compress All until the 25 MB gauge clears, then download the trimmed exhibit to your own disk.',
      'Attach the download in Proton Mail, and for genuine archives reach for a Proton Drive share instead of forcing one giant attachment.',
    ],
    specsH2: 'Proton-oriented locks on this compress page',
    specs: [
      ['Problem it solves', 'Proton attachment too large / privacy-safe shrink'],
      ['Size check', '25 MB before download'],
      ['Preset', 'Web · 96 DPI · 59% JPEG'],
      ['Annotations', 'Preserved for counsel markup'],
      ['Privacy', 'Local only before the Proton attach'],
      ['Related tools', 'Yahoo Mail · Box'],
    ],
    presetH2: 'Why the Proton profile refuses to strip comments',
    presetHtml: `<p>Legal and security reviewers annotate before they send, so wiping comment streams by default would quietly destroy the point of the message. This profile keeps every annotation intact while still shedding the image bulk that inflates scanned bundles.</p>
<p>The JPEG quality sits at 59, a touch firmer than a plain webmail target, because Proton correspondents tend to ship dense exhibit scans that need a little extra squeeze. It stops short of grayscale homework mode so seals and signatures stay convincing to a human reviewer.</p>`,
    deepH2: 'Compression before attach versus encryption after attach',
    deepHtml: `<p>Proton’s guarantees begin the instant a message leaves your client. Anything you did to the file beforehand — including a detour through an unknown compressor — sits outside that shield, which is why the shrink belongs on your own machine.</p>
<p>Reach for <a href="/compress-pdf-for-yahoo-mail/">the Yahoo Mail page</a> only when the destination is actually a Yahoo inbox, since its preview quirks differ from Proton’s. For enterprise reviewers who need a hosted copy after mail proves too tight, hand the bundle to <a href="/compress-pdf-for-box/">the Box page</a> and keep annotations attached.</p>
<p>Truly archival packets should stay untouched offline; send a Proton Drive link rather than grinding vector text into mush with repeated passes. When one exhibit alone is enormous, isolate it with <a href="/split-pdf/">Split PDF</a> first.</p>
<p>For a one-off manual quality tweak, the unlocked <a href="/compress-pdf/">Compress PDF</a> hub and the wider <a href="/pdf-tools/">PDF tools</a> catalogue cover the rest.</p>`,
    faqH2: 'Proton Mail compression questions answered',
    faq: [
      { q: 'Does this page upload my PDF before Proton encrypts anything?', a: 'No. The re-encode runs in your browser, and only you upload the finished exhibit into Proton Mail, so no outside processor ever sees it.' },
      { q: 'Why does the Proton preset keep annotations instead of stripping them?', a: 'Reviewer markup is frequently the reason for the send. The profile trims image weight while leaving comment and redline streams untouched.' },
      { q: 'What attachment size should I aim for with Proton?', a: 'Treat roughly 25 MB as a practical comfort zone for free and Plus workflows unless your specific plan documents a different hard limit.' },
      { q: 'Can I force grayscale for monochrome scanned exhibits?', a: 'Switch to the main Compress PDF tool when the pages are pure monochrome and you need deeper savings than this colour-safe profile provides.' },
      { q: 'Is Proton Drive a better route than compressing large bundles?', a: 'For multi-hundred-megabyte archives, yes. Compress here whenever the other side simply expects a normal attached PDF in their inbox.' },
    ],
  },

  'compress-pdf-for-google-classroom': {
    securityH2: 'Submit to Classroom without a detour through a compress host',
    securityHtml: `<p>A Google Classroom deadline is stressful enough without also trusting a graded worksheet to a random online shrinker. This page keeps the assignment on the student’s device: the browser rewrites the pages with a Screen grayscale preset, and the file goes straight from the download folder into Classroom.</p>
<p>Handwritten homework, quiz photos, and lab notes never pass through our servers. They live in tab memory until the tab closes, which matters when a phone holds a child’s name on every page.</p>
<p>Because Classroom rides on Drive-sized ceilings, the goal here is not a hard byte cap but openability: a copy light enough that the teacher’s phone actually renders it in the Classroom app instead of spinning.</p>`,
    problemH2: 'Why Classroom homework opens slowly even when it uploads',
    problemHtml: `<p>Classroom will happily accept a large Drive-backed file, so students rarely see a blunt “too large” error. The failure surfaces later, when a teacher grading on a phone taps a full-colour, high-DPI scan and watches it crawl toward a <strong>~15 MB</strong> practical wall before rendering.</p>
<p>The camera is the villain again. A worksheet shot at twelve megapixels and left in colour is enormous relative to its information, and a stack of those pages turns one homework set into a sluggish download for everyone in the class.</p>
<p>This URL assumes that quiet failure on purpose: grayscale plus a lower resolution so tonight’s submission opens quickly in the app, not so it survives as a print portfolio.</p>`,
    stepsH2: 'Making a Classroom submission open on a teacher’s phone',
    steps: [
      'Drop in the homework scan; Screen mode with grayscale is already locked because worksheet photos rarely need colour.',
      'Run Compress All and watch the gauge settle toward the practical ~15 MB openability target before you download.',
      'Submit the download in Classroom, and if it still drags, delete blank pages or split a long lab appendix into parts.',
    ],
    specsH2: 'Classroom-oriented defaults on this URL',
    specs: [
      ['Problem it solves', 'Classroom PDF slow to open on phones'],
      ['Practical target', '~15 MB for app openability'],
      ['Preset', 'Screen + grayscale · 72 DPI'],
      ['Colour', 'Dropped to cut worksheet-photo bulk'],
      ['Privacy', 'Local only — you submit to Classroom'],
      ['Sibling pages', 'Brightspace · Schoology · Canvas'],
    ],
    presetH2: 'Why Classroom mode forces Screen plus grayscale',
    presetHtml: `<p>Pencil homework reads perfectly well in gray, so forcing monochrome and a Screen DPI target removes the camera’s colour bloat while keeping strokes legible when a teacher zooms in to grade. The result is a file that renders almost instantly in the Classroom mobile app.</p>
<p>If an instructor explicitly asked for colour figures and confirmed the class can handle larger files, this is the wrong page — reach for a milder colour preset elsewhere rather than fighting a phone-openability goal with rainbow scans.</p>`,
    deepH2: 'Classroom sits on Drive ceilings but grades on phones',
    deepHtml: `<p>The tension on this page is that Classroom inherits generous <strong>Drive</strong> storage limits while the actual reader is a teacher thumbing through submissions on a handset. Optimising for the app, not the marketing ceiling, is what keeps a grade queue moving.</p>
<p>Other learning platforms enforce blunt caps instead, so match the URL to the system: <a href="/compress-pdf-for-brightspace/">Brightspace’s ~10 MB page</a>, <a href="/compress-pdf-for-schoology/">Schoology’s harsh ~5 MB page</a>, or the classic <a href="/compress-pdf-for-canvas/">Canvas</a> route. Exam-style bubble scans belong on <a href="/compress-pdf-for-gradescope/">the Gradescope page</a> where contrast is preserved.</p>
<p>When a single lab report is enormous, break it up with <a href="/split-pdf/">Split PDF</a> before submitting, or run one more pass on <a href="/compress-pdf/">Compress PDF</a>.</p>
<p>The rest of the classroom toolkit — reorder, merge, unlock — lives under <a href="/pdf-tools/">PDF tools</a>.</p>`,
    faqH2: 'Google Classroom PDF submission questions',
    faq: [
      { q: 'Classroom accepted my PDF but the teacher says it will not open — why?', a: 'Classroom rides on Drive ceilings, so upload succeeds while a heavy colour scan still crawls on a grading phone. Compressing to the practical openability target fixes the render, not the upload.' },
      { q: 'Will my teacher mind that the homework turned grayscale?', a: 'For handwritten worksheets, almost never. If the assignment needs colour diagrams, ask first and use a colour preset on a platform with room to spare.' },
      { q: 'Does submitting here send my homework to VeloTools?', a: 'No. The shrink is entirely in your browser. Only you submit the finished file into Google Classroom afterward.' },
      { q: 'Can I hand in several smaller PDFs instead of one big file?', a: 'If the assignment allows multiple attachments, split first and submit the parts. Otherwise keep one file light enough to open quickly.' },
      { q: 'The scan looks faint after compressing — what now?', a: 'Zoom a sample page after download. If pencil is too light, recompress once at slightly higher quality on Compress PDF while watching the openability target.' },
    ],
  },

  'compress-pdf-for-brightspace': {
    securityH2: 'Prepare a Brightspace upload without a public shrink server',
    securityHtml: `<p>Graded coursework belongs inside Brightspace, not parked on an anonymous compress site on the way there. This page builds a smaller PDF on the student’s own computer with a grayscale Screen preset aimed at the <strong>10 MB</strong> assignment cap many D2L courses enforce.</p>
<p>Stylus markups, tablet exports, and phone photos never leave the device during the shrink. You download the trimmed file and hand it to the Brightspace dropbox yourself.</p>
<p>That browser-only path keeps student work out of unknown SaaS logs while you chase whatever quota the course happens to publish this term.</p>`,
    problemH2: 'When a D2L dropbox rejects a marked-up scan',
    problemHtml: `<p>Brightspace, still widely branded D2L, commonly sits near a <strong>10 MB</strong> assignment ceiling that administrators can raise per course. That is looser than the harshest K-12 caps yet far too tight for a colour photo packet dense with annotation layers.</p>
<p>The hidden weight is usually the markup stream. Apple Pencil strokes and tablet annotation data ride invisibly on top of already heavy page images, so a report that “looks like ten pages” refuses the dropbox on size.</p>
<p>Converting to grayscale while shedding that annotation stream is the move that clears the upload dialog, and it is exactly what this page locks by default.</p>`,
    stepsH2: 'When Brightspace reports the file exceeds the limit',
    steps: [
      'Drop the rejected PDF; grayscale Screen mode for scanned coursework is already locked on this D2L URL.',
      'Run Compress All until the gauge clears 10 MB, then confirm a sample page is still readable before saving.',
      'Upload the download into the Brightspace dropbox, and split appendices or verify the course maximum if it still fails.',
    ],
    specsH2: 'Brightspace assignment preset details',
    specs: [
      ['Problem it solves', 'Brightspace / D2L file exceeds maximum'],
      ['Size check', '10 MB typical course cap'],
      ['Preset', 'Screen + grayscale · 72 DPI'],
      ['Markup data', 'Annotation stream dropped to cut bulk'],
      ['Privacy', 'Local shrink → you upload to D2L'],
      ['Sibling pages', 'Schoology · Google Classroom'],
    ],
    presetH2: 'Grayscale Screen for D2L worksheets, not schematics',
    presetHtml: `<p>Most rejected Brightspace homework is perfectly legible in gray, so the profile forces monochrome and re-encodes at a Screen DPI that empties the camera’s colour budget. Annotation streams from stylus apps are stripped so the file stops hauling markup it no longer needs.</p>
<p>Colour schematics for an engineering brief are a different job: confirm the course raised its cap and reach for a colour-preserving preset, because pushing rainbow diagrams through a 10 MB grayscale gate is a fight you will lose on legibility.</p>`,
    deepH2: 'Small quotas, heavy stylus layers, and D2L reality',
    deepHtml: `<p>The recurring pain on D2L is the collision between a modest <strong>10 MB</strong> dropbox and coursework packed with Apple Pencil layers. Grayscale plus annotation stripping usually resolves it in one pass, which is why both are locked here rather than left to a slider.</p>
<p>Match the platform to its cap: <a href="/compress-pdf-for-schoology/">Schoology’s stricter ~5 MB page</a> for K-12 districts, <a href="/compress-pdf-for-google-classroom/">the Classroom openability page</a> for phone grading, or the established <a href="/compress-pdf-for-canvas/">Canvas</a> and <a href="/compress-pdf-for-blackboard/">Blackboard</a> routes. Exam scans that must keep contrast belong on <a href="/compress-pdf-for-gradescope/">Gradescope</a>.</p>
<p>Multi-module submissions are easier once you divide them with <a href="/split-pdf/">Split PDF</a>, then refine on <a href="/compress-pdf/">Compress PDF</a> if one module still runs heavy.</p>
<p>Need to reorder pages into the exact packet the instructor asked for? Start from <a href="/pdf-tools/">PDF tools</a>.</p>`,
    faqH2: 'Brightspace file-size questions from students',
    faq: [
      { q: 'Brightspace says my PDF exceeds the maximum allowed size — how do I fix it?', a: 'Compress on this page, download, and retry the dropbox. If the assignment permits several files, split the PDF and upload the parts instead.' },
      { q: 'Is 10 MB the official D2L limit at every school?', a: 'No. Administrators configure the quota per course. Ten megabytes is a common real-world default this page optimises for; check the assignment details for your number.' },
      { q: 'My tablet drawings make the file huge — will this help?', a: 'Yes. The preset strips the annotation stream and re-encodes pages in grayscale, which usually clears stylus-driven bloat entirely.' },
      { q: 'Will originality checking still work on a compressed scan?', a: 'Instructors can still open and read it, but automated text matching may see less selectable text after raster compression. Ask if a text-based original is required.' },
      { q: 'Should I use the Schoology page instead of this one?', a: 'Only if you submit to Schoology, which targets a harsher ~5 MB cap. This page is tuned for the looser ~10 MB D2L dropbox.' },
    ],
  },

  'compress-pdf-for-schoology': {
    securityH2: 'Beat a Schoology district cap without uploading elsewhere first',
    securityHtml: `<p>K-12 work carries a child’s name on every sheet, which is the last thing to feed to an unknown compress website. This page prepares a smaller PDF on the family device with a deliberately harsh grayscale Screen pass aimed at the tight <strong>5 MB</strong> ceilings many school districts push onto Schoology.</p>
<p>Worksheet photos and permission forms are rewritten in tab memory and never reach our servers. The download goes straight into the Schoology assignment from your own device.</p>
<p>That local-only path keeps student data out of third-party logs while still squeezing hard enough to clear a district’s stingy quota before the deadline banner appears.</p>`,
    problemH2: 'Why a Schoology worksheet blows past five megabytes',
    problemHtml: `<p>Schoology assignments frequently inherit a district-wide upload ceiling near <strong>5 MB</strong>, one of the tightest caps in mainstream education software. A single colour photo of a worksheet, shot at full phone resolution, can consume that entire quota by itself.</p>
<p>Parents and students then ricochet between a red “file too large” banner and compress sites that demand an account just to try. The dependable answer is an aggressive local grayscale pass tuned for tonight’s submission rather than a keepsake print.</p>
<p>This page assumes that stingy cap on purpose, forcing quality down far enough that a multi-page worksheet set still fits without a login or an outside upload.</p>`,
    stepsH2: 'Squeezing a worksheet under the Schoology limit',
    steps: [
      'Drop the rejected worksheet; a harsh grayscale Screen pass at 38% JPEG is already locked for tight district caps.',
      'Run Compress All until the gauge drops under 5 MB, then glance at a page to confirm the writing is still legible.',
      'Submit the download in Schoology, and photograph one page at a time or split the packet if it remains too large.',
    ],
    specsH2: 'Schoology K-12 upload preset',
    specs: [
      ['Problem it solves', 'Schoology assignment over the district cap'],
      ['Size check', '5 MB common district ceiling'],
      ['Preset', 'Harsh Screen + grayscale · 38% JPEG'],
      ['Colour', 'Forced off to survive the tiny cap'],
      ['Privacy', 'Local only — you submit to Schoology'],
      ['Sibling pages', 'Brightspace · Canvas'],
    ],
    presetH2: 'Why Schoology mode squeezes harder than other schools',
    presetHtml: `<p>A 5 MB gate leaves no room for politeness, so this profile drives JPEG quality down to 38 and locks grayscale outright. Handwriting stays readable for a teacher zooming in, which is the only fidelity a district worksheet actually needs.</p>
<p>If a specific assignment genuinely requires a colour chart, that submission does not belong behind this harsh gate — confirm a larger allowance with the teacher and use a colour preset instead of blaming the scan when a diagram turns muddy.</p>`,
    deepH2: 'District caps make Schoology the strictest school target',
    deepHtml: `<p>Because districts, not Schoology itself, set the ceiling, the practical <strong>5 MB</strong> wall is both common and unforgiving. This page leans into that reality with the most aggressive education preset in the batch, trading colour and resolution for a submission that simply fits.</p>
<p>Sister LMS pages ease off as their caps loosen: <a href="/compress-pdf-for-brightspace/">Brightspace’s ~10 MB page</a> and the familiar <a href="/compress-pdf-for-canvas/">Canvas</a> route both keep a little more quality. When a teacher grades on a phone rather than enforcing a byte cap, <a href="/compress-pdf-for-google-classroom/">the Classroom openability page</a> is the better fit.</p>
<p>A long worksheet set is easier to tame once you split it with <a href="/split-pdf/">Split PDF</a>, then finish on <a href="/compress-pdf/">Compress PDF</a> if one page is still stubborn.</p>
<p>More classroom helpers, including page reordering, sit under <a href="/pdf-tools/">PDF tools</a>.</p>`,
    faqH2: 'Schoology upload questions parents ask',
    faq: [
      { q: 'Schoology keeps rejecting my child’s worksheet for size — what fixes it fastest?', a: 'Compress on this page with the 5 MB gauge on, download, and resubmit. Full-resolution phone photos almost always fit after the harsh grayscale pass.' },
      { q: 'Why is the Schoology limit so much smaller than other platforms?', a: 'The cap usually comes from the school district rather than Schoology, and many districts set it near 5 MB, the tightest common education ceiling.' },
      { q: 'Does compressing here upload my child’s homework anywhere?', a: 'No. Everything runs in the browser, and only you submit the finished file into Schoology afterward.' },
      { q: 'The writing looks rough after this squeeze — is that expected?', a: 'At 38% quality some softness is normal. If pencil is too faint, recompress once at slightly higher quality on Compress PDF while keeping under 5 MB.' },
      { q: 'Can I submit two smaller files instead of one over-cap PDF?', a: 'If the assignment allows multiple attachments, split the worksheet and submit the parts. Otherwise keep a single file under the district cap.' },
    ],
  },

  'compress-pdf-for-gradescope': {
    securityH2: 'Keep exam scans on your machine while they slim down',
    securityHtml: `<p>Exam pages hold names, student IDs, and graded answers, so routing them through an anonymous compressor before Gradescope is a needless exposure. This page rewrites the scan in the browser with a Web grayscale preset aimed at a practical <strong>20 MB</strong> upload, and the file never leaves the device.</p>
<p>Bubble sheets and handwritten proofs are processed in tab memory only. You download the result and upload it into Gradescope yourself, so no outside service ever holds the exam.</p>
<p>Unlike a homework crush, this profile is careful to preserve the contrast that graders and autograders rely on, because a smudged answer box helps no one even when the file is small.</p>`,
    problemH2: 'Multi-page exam scans that refuse to upload',
    problemHtml: `<p>Gradescope accepts long, multi-page exam bundles, but a stack of full-resolution phone photos quickly climbs past a comfortable <strong>20 MB</strong>, and the upload stalls or times out on campus Wi-Fi. Every extra colour page makes it worse.</p>
<p>The instinct to force a deep homework-style crush backfires here. Flatten the contrast too far and a shaded bubble or a faint pencil digit becomes ambiguous, which turns a size problem into a grading dispute.</p>
<p>This URL threads that needle: grayscale to shed colour weight, but a Web-quality target that keeps ink and bubble edges crisp enough for both a human grader and Gradescope’s answer detection.</p>`,
    stepsH2: 'Fitting an exam scan into Gradescope cleanly',
    steps: [
      'Drop the multi-page exam scan; Web grayscale at 71% JPEG is locked to protect bubble and ink contrast.',
      'Run Compress All until the gauge lands near or under 20 MB while a sample answer box stays sharp.',
      'Upload the download to Gradescope, and rescan at lower phone resolution or split by question groups if it stalls.',
    ],
    specsH2: 'Gradescope exam-scan preset',
    specs: [
      ['Problem it solves', 'Gradescope scan too large / upload stalls'],
      ['Size check', '~20 MB practical target'],
      ['Preset', 'Web + grayscale · 96 DPI · 71% JPEG'],
      ['Contrast', 'Preserved for bubbles and handwriting'],
      ['Privacy', 'Local only — you upload to Gradescope'],
      ['Sibling pages', 'Schoology · Canvas'],
    ],
    presetH2: 'Grayscale that still guards exam contrast',
    presetHtml: `<p>Colour rarely carries meaning on an exam sheet, so grayscale is safe and removes the bulk of a phone photo’s weight. What is not safe is a low JPEG quality, so this profile holds at 71 to keep bubble outlines and pencil strokes distinct where detection and grading depend on them.</p>
<p>If a bundle is still too heavy after one pass, the right lever is fewer megapixels at scan time, not a harsher quality setting — rescanning a page at a saner resolution beats crushing every answer into ambiguity.</p>`,
    deepH2: 'Why exam scans need a gentler hand than homework',
    deepHtml: `<p>The whole reason this page differs from a coursework crush is that Gradescope reads answers, not just words. A <strong>20 MB</strong> target with protected contrast keeps both the human grader and the autograder confident, where a 5 MB homework pass would blur the very marks being scored.</p>
<p>For ordinary submissions bound by blunt caps, the LMS pages are a better fit: <a href="/compress-pdf-for-schoology/">Schoology’s ~5 MB page</a> or the classic <a href="/compress-pdf-for-canvas/">Canvas</a> route. When a teacher simply grades on a phone, <a href="/compress-pdf-for-google-classroom/">the Classroom openability page</a> applies instead.</p>
<p>Break a very long exam into question groups with <a href="/split-pdf/">Split PDF</a>, then run a careful pass on <a href="/compress-pdf/">Compress PDF</a> if a single section stays heavy.</p>
<p>Reordering or merging scanned sheets before upload is covered under <a href="/pdf-tools/">PDF tools</a>.</p>`,
    faqH2: 'Gradescope scan upload questions',
    faq: [
      { q: 'My Gradescope exam scan is too large to upload — how do I shrink it safely?', a: 'Use this page: grayscale Web compression runs in your browser toward roughly 20 MB while preserving the contrast Gradescope needs, then you upload it yourself.' },
      { q: 'Will compressing blur my bubble sheet answers?', a: 'The preset holds JPEG quality at 71 precisely to protect bubbles and ink. If a page is still too heavy, rescan it at lower resolution rather than crushing quality.' },
      { q: 'Is grayscale a problem for exam scans?', a: 'No. Colour rarely carries meaning on an exam sheet, so grayscale removes weight without affecting how answers are read or graded.' },
      { q: 'Does this page send my exam to VeloTools?', a: 'No. Processing stays in the browser. Only you upload the finished scan into Gradescope afterward.' },
      { q: 'What if the full exam bundle is still over 20 MB?', a: 'Split the scan by question groups, rescan the worst pages at lower phone resolution, or run one more measured pass on Compress PDF.' },
    ],
  },

  'compress-pdf-for-jira': {
    securityH2: 'Attach a design PDF to Jira without a middleman upload',
    securityHtml: `<p>Product specs, log dumps, and design exports headed for a Jira ticket often contain roadmap details that should not sit on a stranger’s compress server for “an hour.” This page shrinks the file in the browser with a Web preset aimed at Atlassian Cloud’s common <strong>10 MB</strong> per-file limit.</p>
<p>The document is re-encoded in tab memory and never reaches VeloTools. You download the trimmed PDF and attach it on the issue yourself, keeping internal work off unknown SaaS.</p>
<p>Annotations are stripped by default here because a Jira attachment is usually a snapshot for the ticket, not a live review thread — a deliberate contrast with review-oriented mail presets.</p>`,
    problemH2: 'The 10 MB bounce that stalls a ticket',
    problemHtml: `<p>Atlassian Cloud commonly caps a single Jira attachment near <strong>10 MB</strong>, though site admins can change it. Export a few Figma frames or a verbose log-to-PDF and the ticket rejects the upload just as you are trying to unblock a teammate.</p>
<p>People respond by pasting screenshots into the description, which scatters the detail and makes the issue harder to search later. A locked Web pass keeps the artefact as one attached PDF that reviewers can open in context.</p>
<p>Because the cap is per file rather than a message budget, the fix is straightforward: trim the export under 10 MB before it ever touches the issue.</p>`,
    stepsH2: 'Getting a design export under the Jira attachment cap',
    steps: [
      'Drop the oversized export; the Web preset at 57% JPEG with annotations stripped is already locked for tickets.',
      'Run Compress All until the gauge clears 10 MB, then download the trimmed PDF to your working folder.',
      'Attach the file on the Jira issue, and export fewer frames or split the doc if the cap still bounces it.',
    ],
    specsH2: 'Jira ticket attachment preset',
    specs: [
      ['Problem it solves', 'Jira attachment over the 10 MB limit'],
      ['Size check', '10 MB common Atlassian Cloud cap'],
      ['Preset', 'Web · 96 DPI · 57% JPEG'],
      ['Annotations', 'Stripped for a clean ticket snapshot'],
      ['Privacy', 'Local only before the issue attach'],
      ['Sibling pages', 'Confluence · Asana'],
    ],
    presetH2: 'Why Jira mode strips annotations by default',
    presetHtml: `<p>A ticket attachment is typically evidence — a rendered spec or a captured log — rather than a document people redline in place. Dropping the annotation stream shaves weight that would only pad the file and rarely carries meaning inside the issue.</p>
<p>If a particular attachment really is a review artefact, keep the markup by compressing on a preset that preserves annotations instead, such as the Confluence or Box routes, and attach that copy to the ticket.</p>`,
    deepH2: 'Where Jira attachments fit among Atlassian tools',
    deepHtml: `<p>The <strong>10 MB</strong> per-file ceiling makes Jira a per-attachment problem rather than a mailbox one, so the tactic is simply to land each export under the line before upload. Fewer exported frames often beats a harsher quality setting.</p>
<p>Its closest sibling is <a href="/compress-pdf-for-confluence/">the Confluence page</a>, which shares the ~10 MB neighbourhood but tunes for embeds that must not stall the editor. For task boards where mobile openability matters more than a hard cap, <a href="/compress-pdf-for-asana/">the Asana page</a> is the better match.</p>
<p>When a spec is genuinely large, divide it with <a href="/split-pdf/">Split PDF</a> and attach the relevant section, or run one more pass on <a href="/compress-pdf/">Compress PDF</a> with a firmer preset.</p>
<p>Everything else — merge, reorder, unlock — sits under <a href="/pdf-tools/">PDF tools</a> once the ticket accepts the file.</p>`,
    faqH2: 'Jira attachment size questions',
    faq: [
      { q: 'Why does Jira reject my PDF attachment?', a: 'Atlassian Cloud usually limits a single file to around 10 MB, and admins can adjust it. Compress under that line here, then attach on the issue again.' },
      { q: 'Does this page keep my ticket details private?', a: 'Yes. The re-encode runs in your browser and nothing reaches VeloTools. You attach the finished PDF to Jira yourself.' },
      { q: 'Why are annotations stripped for Jira?', a: 'A ticket attachment is normally a snapshot, so dropping the annotation stream trims weight. If you need markup preserved, compress on an annotation-keeping preset instead.' },
      { q: 'What if the export is still above 10 MB?', a: 'Export fewer Figma frames, split the document by section, or run a stronger Screen pass on the main Compress PDF tool.' },
      { q: 'Can I raise the Jira limit instead of compressing?', a: 'A site admin can change per-file limits, but compressing is faster for one attachment and keeps ticket history lean for everyone loading the issue.' },
    ],
  },

  'compress-pdf-for-confluence': {
    securityH2: 'Embed in Confluence without parking the file on a compressor',
    securityHtml: `<p>Architecture docs and design PDFs pinned to a Confluence page often describe systems that should not visit an outside compressor first. This page trims the file in the browser with a mild Web preset so a <strong>10 MB</strong> embed stops stalling the editor, and the document never leaves your session.</p>
<p>The re-encode happens in tab memory and never touches our servers. You download the lighter PDF and attach or embed it in Confluence yourself.</p>
<p>Annotations are stripped by default because a wiki embed is usually a reference artefact rather than a live redline, keeping the attached copy lean for everyone who loads the page.</p>`,
    problemH2: 'Why a heavy PDF makes a Confluence page crawl',
    problemHtml: `<p>Confluence Cloud pages feel sluggish once an attached or embedded PDF pushes past roughly <strong>10 MB</strong>, especially when a space is full of macros and the editor tries to render a preview. Readers open the page, wait, and lose the thread.</p>
<p>Teams work around it by pasting screenshots into the body, which fragments the diagram and defeats page search. A mild Web pass keeps a single embeddable PDF that opens without freezing the editor.</p>
<p>The issue is preview responsiveness rather than a hard rejection, so the goal is a file light enough that the macro renders promptly on a colleague’s laptop.</p>`,
    stepsH2: 'Keeping a Confluence embed responsive',
    steps: [
      'Drop the heavy PDF; the mild Web preset at 55% JPEG is already locked so embeds render without stalling.',
      'Run Compress All until the gauge clears the ~10 MB embed target, then download the lighter file.',
      'Attach or embed the download in Confluence, and split long chapters into separate attachments if a page still lags.',
    ],
    specsH2: 'Confluence embed-oriented preset',
    specs: [
      ['Problem it solves', 'Confluence page slow / embed too heavy'],
      ['Size check', '~10 MB embed target'],
      ['Preset', 'Web · 96 DPI · 55% JPEG'],
      ['Annotations', 'Stripped for a lean wiki artefact'],
      ['Privacy', 'Browser-only before the Confluence attach'],
      ['Sibling pages', 'Jira · Notion'],
    ],
    presetH2: 'Mild Web quality tuned for wiki reading',
    presetHtml: `<p>Wiki content is read in a narrow column, so a mild Web preset that empties export bloat is enough to make an embed feel instant. The quality sits slightly softer than a mailbox target because on-page rendering, not print fidelity, is the job.</p>
<p>Keep the pristine master elsewhere and let Confluence hold the readable copy. Overwriting your only lossless export with a wiki-optimised embed is the kind of shortcut that hurts a diagram later.</p>`,
    deepH2: 'Confluence embeds versus other document surfaces',
    deepHtml: `<p>The practical <strong>10 MB</strong> line on Confluence is about editor responsiveness rather than a blunt cap, so the aim is a prompt-rendering embed, not the smallest possible file. That focus separates it from a mailbox or LMS crush.</p>
<p>Its Atlassian sibling is <a href="/compress-pdf-for-jira/">the Jira page</a>, which shares the ~10 MB neighbourhood but targets ticket attachments. For product-doc embeds in a different wiki, <a href="/compress-pdf-for-notion/">the Notion page</a> tunes for a tighter in-page preview.</p>
<p>Long architecture specs embed more smoothly once you divide them with <a href="/split-pdf/">Split PDF</a>, and one measured pass on <a href="/compress-pdf/">Compress PDF</a> handles a stubborn chapter.</p>
<p>Reorder or merge sections before embedding from the wider <a href="/pdf-tools/">PDF tools</a> catalogue.</p>`,
    faqH2: 'Confluence PDF embed questions',
    faq: [
      { q: 'Why does my Confluence page load slowly after I add a PDF?', a: 'Embedded files past roughly 10 MB make the editor and preview crawl. Compress toward that target here, then re-attach the lighter copy.' },
      { q: 'Does compressing here upload my architecture doc anywhere?', a: 'No. The shrink is entirely in your browser, and you attach or embed the finished PDF in Confluence yourself.' },
      { q: 'Why does the Confluence preset drop annotations?', a: 'A wiki embed is usually a reference artefact, so stripping the annotation stream keeps it lean. Use an annotation-keeping preset if you need markup preserved.' },
      { q: 'What if the page still lags with a big spec?', a: 'Split the document into separate attachments per chapter, or run a firmer pass on Compress PDF before embedding.' },
      { q: 'Should I embed the PDF or link out to it?', a: 'Embed a compressed copy for quick reading and link out to a hosted master when readers need full fidelity beyond the page.' },
    ],
  },

  'compress-pdf-for-asana': {
    securityH2: 'Attach to an Asana task without a public compress hop',
    securityHtml: `<p>Design briefs and creative exports dropped onto an Asana task often carry unreleased work, which has no business sitting on an anonymous compressor first. This page trims the file in the browser with a Web preset so it opens smoothly in the mobile task view, and the export never leaves your device.</p>
<p>The document is re-encoded in tab memory and never reaches our servers. You download the lighter PDF and attach it on the task yourself.</p>
<p>Annotations are stripped by default because a task attachment is usually a reference for collaborators, and shedding that stream helps the file open quickly on a phone during standup.</p>`,
    problemH2: 'When an Asana task PDF stalls on a phone',
    problemHtml: `<p>Asana allows large task attachments on paid plans, so the failure is rarely a hard rejection. Instead, a bloated design export sits at the top of a task and refuses to render promptly in the mobile app, even inside a comfortable <strong>50 MB</strong> allowance.</p>
<p>The weight comes from InDesign and Figma exports that carry oversized embedded images and unused artboards. Collaborators tap the attachment, wait, and give up before the preview loads.</p>
<p>This URL optimises for that phone-openability moment: a Web pass with annotation stripping that keeps colour brand pages intact while cutting the export waste that makes mobile crawl.</p>`,
    stepsH2: 'Making an Asana attachment open on mobile',
    steps: [
      'Drop the design export; the Web preset at 69% JPEG with annotations stripped is already locked for task views.',
      'Run Compress All until the file feels light within the ~50 MB comfort zone, then download the trimmed copy.',
      'Attach the download on the Asana task, and remove unused artboards or split the brief if it still drags on phones.',
    ],
    specsH2: 'Asana task attachment profile',
    specs: [
      ['Problem it solves', 'Asana task PDF slow to open on mobile'],
      ['Comfort zone', '~50 MB before mobile stalls'],
      ['Preset', 'Web · 96 DPI · 69% JPEG'],
      ['Annotations', 'Stripped for faster task previews'],
      ['Privacy', 'Browser-only before the task attach'],
      ['Sibling pages', 'Jira · Confluence'],
    ],
    presetH2: 'Web quality that keeps brand colour on a task',
    presetHtml: `<p>Design collaborators expect their colour to survive, so this profile keeps colour and re-encodes at a Web quality high enough that brand pages still read well while the export bloat disappears. The goal is a phone-friendly preview, not a print master.</p>
<p>Unused artboards and oversized embedded images are the usual weight, so trimming those at export time pairs well with this pass. If fidelity truly matters more than mobile speed, keep the master and attach only the compressed reference copy.</p>`,
    deepH2: 'Asana openability versus hard-cap platforms',
    deepHtml: `<p>The distinctive thing about Asana is that its generous <strong>50 MB</strong>-class allowance means the real limit is human patience on a phone, not a byte ceiling. Optimising for the task preview, not a marketing cap, is what keeps a board moving.</p>
<p>Its productivity siblings enforce firmer caps: <a href="/compress-pdf-for-jira/">the Jira page</a> targets a ~10 MB per-file limit, and <a href="/compress-pdf-for-confluence/">the Confluence page</a> tunes for editor-responsive embeds. For a hosted design master that reviewers download later, <a href="/compress-pdf-for-box/">the Box page</a> keeps annotations and a larger comfort zone.</p>
<p>Multi-brief packets open faster once split with <a href="/split-pdf/">Split PDF</a>, and a single heavy export can take one more pass on <a href="/compress-pdf/">Compress PDF</a>.</p>
<p>Reorder or merge artboards before attaching from <a href="/pdf-tools/">PDF tools</a>.</p>`,
    faqH2: 'Asana attachment questions from teams',
    faq: [
      { q: 'Why does my Asana task PDF take forever to open on my phone?', a: 'Bloated design exports render slowly in the mobile task view even under Asana’s large allowance. Compressing here trims the export waste so the preview loads quickly.' },
      { q: 'Does Asana reject files, or just open them slowly?', a: 'Paid plans allow large attachments, so the pain is usually slow mobile rendering rather than a hard rejection. This page targets openability, not a byte cap.' },
      { q: 'Will my brand colours survive the compression?', a: 'Yes. The preset keeps colour and uses a fairly high Web quality, so brand pages stay readable while oversized embedded images are trimmed.' },
      { q: 'Does attaching here send my design to VeloTools?', a: 'No. Everything runs in your browser, and you attach the finished PDF on the Asana task yourself.' },
      { q: 'What if the export is still slow after compressing?', a: 'Remove unused artboards at export time, split the brief into parts, or run one more pass on Compress PDF before attaching.' },
    ],
  },

  'compress-pdf-for-box': {
    securityH2: 'Prepare a Box share without a second upload to a compressor',
    securityHtml: `<p>Client files headed for a Box shared link are only as pleasant as the PDF behind them, and parking that PDF on an anonymous compressor first adds a needless processor. This page trims the file in the browser toward a practical <strong>50 MB</strong> share comfort zone, and the document never leaves your device.</p>
<p>Contracts and creative masters are re-encoded in tab memory and never reach our servers. You download the lighter copy and upload it to Box under your own account.</p>
<p>Annotations are preserved here because Box shares are frequently sent to external reviewers who need the markup, so this profile keeps comments intact while shedding raster bloat.</p>`,
    problemH2: 'Why a 200 MB art PDF punishes a Box preview',
    problemHtml: `<p>Enterprise Box quotas are large, so storage is rarely the blocker. The friction shows up in the browser preview and the upload itself: a 200 MB print-quality art PDF crawls in the shared-link viewer and frustrates an external reviewer who just wanted a quick look.</p>
<p>Teams then fall back to desktop-sync-only workflows or fire off screenshots, both of which undercut the point of a clean shared link. A Web pass toward a practical <strong>50 MB</strong> keeps the file previewable in a browser without forcing anyone to install a sync client.</p>
<p>The target is reviewer comfort on a shared link, not a hard cap, so the aim is a copy that previews smoothly for someone outside your organisation.</p>`,
    stepsH2: 'Sizing a PDF for a comfortable Box link',
    steps: [
      'Drop the heavy art or contract PDF; the Web preset at 73% JPEG with annotations kept is already locked for shares.',
      'Run Compress All until the gauge sits near or under the ~50 MB comfort line, then download the lighter copy.',
      'Upload the download to Box and generate the link, keeping the print master offline for anyone who needs full fidelity.',
    ],
    specsH2: 'Box shared-link compress profile',
    specs: [
      ['Problem it solves', 'Box shared-link preview slow / upload heavy'],
      ['Comfort zone', '~50 MB for browser preview'],
      ['Preset', 'Web · 96 DPI · 73% JPEG'],
      ['Annotations', 'Kept for external reviewers'],
      ['Privacy', 'Browser-only before the Box upload'],
      ['Sibling pages', 'OneDrive · Google Drive'],
    ],
    presetH2: 'Higher-quality Web preset for external reviewers',
    presetHtml: `<p>Because a Box link often lands in front of a client, the JPEG quality is held at a generous 73 and annotations stay attached. The result previews cleanly in a browser and preserves the review context that external stakeholders expect.</p>
<p>This is deliberately gentler than a mailbox crush: the goal is a smooth shared-link preview, not the smallest attachment. Keep the untouched print master in a separate folder so a compressed share never becomes your only copy.</p>`,
    deepH2: 'Box comfort versus tighter cloud and mail targets',
    deepHtml: `<p>Box sits in the roomy cloud tier where a practical <strong>50 MB</strong> keeps previews and uploads pleasant rather than fighting a hard ceiling. That places it between mailbox caps and the very largest storage services.</p>
<p>Its cloud siblings tune differently: <a href="/compress-pdf-for-onedrive/">the OneDrive page</a> aims a mild pass at a 25 MB mail-path checker for people who still demand a direct attachment, while <a href="/compress-pdf-for-google-drive/">the Google Drive page</a> stays milder near a ~100 MB office target. When a private mailbox is the destination instead, <a href="/compress-pdf-for-proton-mail/">the Proton Mail page</a> keeps annotations too.</p>
<p>Very large binders share more comfortably once divided with <a href="/split-pdf/">Split PDF</a>, and a single heavy master can take one more pass on <a href="/compress-pdf/">Compress PDF</a>.</p>
<p>The rest of the suite, including merge and reorder, lives under <a href="/pdf-tools/">PDF tools</a>.</p>`,
    faqH2: 'Box shared-link size questions',
    faq: [
      { q: 'Do I need to compress a PDF before sharing it on Box?', a: 'Not for storage, but a 200 MB art PDF previews slowly on a shared link. A ~50 MB compress keeps the browser preview smooth for external reviewers.' },
      { q: 'Will comment markup survive on a Box share?', a: 'Yes. This profile keeps annotations because Box links often go to reviewers who need the markup, while still trimming raster bloat.' },
      { q: 'Does compressing here upload my file to Box automatically?', a: 'No. The shrink is local. You upload the download to Box and create the shared link yourself.' },
      { q: 'Can external reviewers preview the file without desktop sync?', a: 'That is the goal. Sizing toward ~50 MB keeps the browser shared-link preview responsive without forcing anyone to install a sync client.' },
      { q: 'Should I keep the original print master?', a: 'Yes. Store the untouched master in a separate folder so the compressed share copy never becomes your only version.' },
    ],
  },

  'compress-pdf-for-onedrive': {
    securityH2: 'Trim a OneDrive PDF before a mail cap rejects it',
    securityHtml: `<p>OneDrive and SharePoint store enormous files without complaint, so the real trouble starts when someone insists on a direct attachment and a mail ceiling bounces it. This page runs a mild Web pass toward a <strong>25 MB</strong> mail-path check, all in the browser, so the document never visits an outside compressor.</p>
<p>The file is re-encoded in tab memory and never reaches our servers. You download the lighter copy and either re-upload to OneDrive or attach it wherever the mail cap applies.</p>
<p>Annotations are preserved here because these office documents frequently carry review comments, and the mild profile keeps them while shedding export bloat.</p>`,
    problemH2: 'Storage is fine — the attachment path is the problem',
    problemHtml: `<p>Nobody hits a wall putting a PDF into OneDrive; the service will hold it comfortably. The failure appears one step later, when a recipient refuses a link and demands a direct file, and the mail client rejects anything past a common <strong>25 MB</strong> attachment ceiling.</p>
<p>Export bloat is what pushes an otherwise ordinary office PDF over that mail line. A mild Web pass trims the waste so the same document can travel as a plain attachment when a link simply will not do.</p>
<p>This URL is built for that specific hand-off: OneDrive keeps the master, and a lightly compressed copy satisfies the person who wants a file in their inbox rather than a shared link.</p>`,
    stepsH2: 'Getting a OneDrive PDF under a mail attachment cap',
    steps: [
      'Drop the office PDF; the mild Web preset at 74% JPEG with annotations kept is already locked for the mail path.',
      'Run Compress All until the gauge clears the 25 MB mail check, then download the lighter attachment copy.',
      'Attach the download or re-upload to OneDrive, and share a link or split the deck if it stays over the mail cap.',
    ],
    specsH2: 'OneDrive mail-path compress profile',
    specs: [
      ['Problem it solves', 'OneDrive file fine but mail attach rejected'],
      ['Size check', '25 MB mail-path check'],
      ['Preset', 'Web · 96 DPI · 74% JPEG'],
      ['Annotations', 'Kept for office review comments'],
      ['Privacy', 'Browser-only before share or attach'],
      ['Sibling pages', 'Box · Outlook'],
    ],
    presetH2: 'A mild pass for the awkward direct-attach request',
    presetHtml: `<p>Since storage is never the issue, this profile stays mild — quality 74 with annotations intact — because the only job is clearing a mail ceiling for someone who refuses a link. There is no reason to crush an office document that OneDrive would host untouched.</p>
<p>If the recipient will accept a shared link after all, skip the attachment entirely and send the OneDrive URL. The compressed copy exists purely for the case where a direct file is non-negotiable.</p>`,
    deepH2: 'OneDrive links versus the stubborn direct attachment',
    deepHtml: `<p>The quirk this page solves is social as much as technical: OneDrive can store the file, but a recipient sometimes insists on a direct attachment, and mail caps near <strong>25 MB</strong> then bite. A mild pass bridges that gap without degrading the office original.</p>
<p>For the actual mailbox send, pair this with <a href="/compress-pdf-for-outlook/">the Outlook page</a>, whose ~20 MB consumer habit is even tighter. Its cloud sibling <a href="/compress-pdf-for-box/">the Box page</a> keeps a larger comfort zone for hosted shares, and <a href="/compress-pdf-for-google-drive/">the Google Drive page</a> stays milder near ~100 MB.</p>
<p>Oversized decks travel better once split with <a href="/split-pdf/">Split PDF</a>, and a firmer squeeze is available on <a href="/compress-pdf/">Compress PDF</a> when a mail cap is unusually strict.</p>
<p>Reorder or merge before sharing from <a href="/pdf-tools/">PDF tools</a>.</p>`,
    faqH2: 'OneDrive attachment and sharing questions',
    faq: [
      { q: 'My file is fine in OneDrive but the email attach fails — why?', a: 'OneDrive stores large files easily, yet mail clients reject attachments past roughly 25 MB. A mild compress here clears that mail cap when a link will not do.' },
      { q: 'Should I just send a OneDrive link instead of compressing?', a: 'If the recipient accepts links, yes — that is simplest. Compress only when they insist on a direct attached PDF that must fit under a mail ceiling.' },
      { q: 'Will review comments survive this compression?', a: 'Yes. The mild profile keeps annotations because office documents often carry review markup, while trimming export bloat.' },
      { q: 'Does this page sign into my Microsoft account?', a: 'No. There is no Microsoft login. The shrink runs in your browser and you handle the OneDrive upload or the attachment yourself.' },
      { q: 'What if the file is still over the mail cap?', a: 'Send a OneDrive link, split the deck into parts, or run a firmer pass on Compress PDF before attaching.' },
    ],
  },

  'compress-pdf-for-messenger': {
    securityH2: 'Send a PDF in Messenger without a compress site in the middle',
    securityHtml: `<p>Receipts, forms, and travel documents shared in a Facebook Messenger chat should not detour through an unknown compressor before they reach the conversation. This page shrinks the file in the browser toward a practical <strong>25 MB</strong> chat comfort zone, and the document never leaves your device.</p>
<p>The PDF is re-encoded in tab memory and never reaches our servers. You download the lighter file and attach it in Messenger yourself, so only Meta’s chat sees what you choose to send.</p>
<p>That local-only step matters when a receipt carries a name or an address you would rather not hand to a random “free compressor” that quietly retains uploads.</p>`,
    problemH2: 'The Messenger document send that never finishes',
    problemHtml: `<p>Mobile Messenger document sends grow unreliable once a PDF climbs past a practical <strong>25 MB</strong> zone, a threshold that shifts with client and version. The upload spinner hangs, the recipient sees nothing arrive, and the chat stalls.</p>
<p>People then fall back to a burst of page screenshots, which smears fine print and scatters a single document across the thread. A Web pass that lands under the practical chat line keeps the file as one clean attachment.</p>
<p>Because the ceiling is fuzzy and client-dependent, aiming comfortably under 25 MB is the reliable way to make a send actually complete on cellular data.</p>`,
    stepsH2: 'Getting a PDF through a Messenger chat cleanly',
    steps: [
      'Drop the heavy PDF; the Web preset at 56% JPEG is already locked for the practical Messenger chat zone.',
      'Run Compress All until the gauge sits comfortably under 25 MB for a reliable mobile send.',
      'Attach the download in Messenger, and switch to Screen on Compress PDF or send a Drive link if it still hangs.',
    ],
    specsH2: 'Messenger chat document profile',
    specs: [
      ['Problem it solves', 'Messenger PDF send hangs / never delivers'],
      ['Comfort zone', '~25 MB for reliable chat sends'],
      ['Preset', 'Web · 96 DPI · 56% JPEG'],
      ['Colour', 'Kept for receipts and forms'],
      ['Privacy', 'Browser-only before the chat attach'],
      ['Sibling pages', 'WhatsApp · Telegram'],
    ],
    presetH2: 'Chat-readable Web quality under a fuzzy ceiling',
    presetHtml: `<p>Messenger’s document limit wobbles with the app version, so this profile aims a firm-but-readable Web quality under a practical 25 MB line rather than chasing a number the client will not confirm. Colour stays on for receipts and forms while metadata bloat is discarded.</p>
<p>If a send still hangs on a weak connection, the fix is a stronger pass or a link rather than another retry. A file that comfortably clears the practical zone is far more likely to deliver on the first attempt.</p>`,
    deepH2: 'Messenger among the messaging comfort bands',
    deepHtml: `<p>Like other chat apps, Messenger’s real limit is delivery reliability on mobile data, not a published cap. Aiming under a practical <strong>25 MB</strong> zone is what turns “sending…” into an attachment the other person can actually open.</p>
<p>Its messaging siblings lock different comfort bands: <a href="/compress-pdf-for-whatsapp/">the WhatsApp page</a> steers near a ~16 MB comfort band with the paperclip Document path, and <a href="/compress-pdf-for-telegram/">the Telegram page</a> targets a ~20 MB Files-tray band. When the audience is an inbox rather than a chat, <a href="/compress-pdf-for-gmail/">the Gmail page</a> handles the 25 MB attachment world.</p>
<p>A long packet sends more reliably once split with <a href="/split-pdf/">Split PDF</a>, and a firmer squeeze is available on <a href="/compress-pdf/">Compress PDF</a> when a send keeps stalling.</p>
<p>The wider catalogue, including merge and reorder, sits under <a href="/pdf-tools/">PDF tools</a>.</p>`,
    faqH2: 'Messenger PDF sending questions',
    faq: [
      { q: 'Why does my Messenger PDF send hang and never deliver?', a: 'Document sends grow unreliable past a practical ~25 MB zone that varies by app version. Compress comfortably under that line here, then attach again.' },
      { q: 'Is there an official Messenger PDF size limit?', a: 'The ceiling is fuzzy and client-dependent, so aiming under a practical 25 MB comfort zone is the reliable way to make a mobile send complete.' },
      { q: 'Will receipts and forms stay readable after compressing?', a: 'Yes. The preset keeps colour and a readable Web quality, so receipts and forms remain legible while metadata bloat is removed.' },
      { q: 'Does compressing here post my file to Facebook?', a: 'No. The shrink runs in your browser and nothing reaches VeloTools. You attach the finished PDF in Messenger yourself.' },
      { q: 'What if the send still fails on a weak connection?', a: 'Run a stronger Screen pass on Compress PDF, split the document, or share a Drive link instead of retrying the same heavy file.' },
    ],
  },
};
