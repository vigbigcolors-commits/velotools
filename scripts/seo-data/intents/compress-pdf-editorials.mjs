/**
 * Handcrafted compress-pdf PSEO editorials — unique per slug.
 * Anti-doorway: no shared H2/FAQ/paragraphs; ≥600 words each; browser-only privacy.
 */
export const COMPRESS_PDF_EDITORIALS = {
  'compress-pdf-for-gmail': {
    securityH2: 'Shrink for Gmail without uploading your PDF',
    securityHtml: `<p>If Gmail says the attachment is too large, you do not need a website that asks you to “upload to compress.” On this page the file never leaves your laptop: the browser reads it, shrinks pages with a locked email preset, and you download a smaller PDF to attach yourself.</p>
<p>That is the difference between convenience and privacy. Contracts, tax packets, and medical letters stay in tab memory until you close the tab — VeloTools never receives a copy.</p>
<p>When you are ready, attach the download in Gmail the normal way. Compression finished locally; only Gmail sees what you choose to send.</p>`,
    problemH2: 'Why Gmail keeps rejecting that attachment',
    problemHtml: `<p>Everyday Gmail accounts enforce a hard ceiling near <strong>25 MB per message</strong>. The body, inline images, and every attachment share that budget, so a scanned lease or slide deck that looks “only a little big” still fails Send.</p>
<p>Phone camera exports and exported PowerPoint packs are the usual culprits: full-color pages at high DPI balloon past the limit even when page count is modest. People then paste screenshots into Drive links — workable, but not what a recipient who expects a simple attached PDF wants.</p>
<p>This URL exists for that exact failure: get under 25 MB while keeping the file readable in Gmail’s preview on phones and desktop.</p>`,
    stepsH2: 'How to fix “attachment too large” in Gmail',
    steps: [
      'Drop the PDF that Gmail rejected — the 25 MB email preset is already locked on this page.',
      'Tap Compress All and wait for the green size check under 25 MB before you download.',
      'Download, open Gmail, attach the new file. Still oversized? Use Split PDF for chapters, then send two messages.',
    ],
    specsH2: 'What this Gmail page locks for you',
    specs: [
      ['Problem it solves', 'Gmail attachment too large / over 25 MB'],
      ['Size check', '25 MB before download'],
      ['Preset', 'Email-friendly Web quality (readable on phones)'],
      ['Color', 'Kept (contracts and slides stay in color)'],
      ['Privacy', 'No upload to VeloTools'],
      ['Related tools', 'Split PDF · main Compress PDF'],
    ],
    presetH2: 'The email Web preset behind this Gmail URL',
    presetHtml: `<p>We lock a Web-quality path around 96 DPI with moderate JPEG quality so text stays crisp in Gmail’s viewer without preserving print-shop masters. Metadata that only inflates the file is stripped; you keep a normal PDF you can open anywhere.</p>
<p>It is gentler than Screen modes used for LMS homework because Gmail’s 25 MB ceiling gives more room than a 5 MB course upload. If you still miss the mark after one pass, split chapters or run a stronger pass on the main compressor — do not crush quality first.</p>`,
    deepH2: 'Why Gmail stops at 25 MB — and what to do next',
    deepHtml: `<p>Gmail’s well-known ceiling is about <strong>25 MB per message</strong> for everyday accounts. Workspace admins can raise it, but most people still hit the classic wall with scanned packets and slide decks.</p>
<p>This page is tuned for that moment: keep the file readable in Gmail’s preview, strip bulky metadata, and show a warning before you waste time on a failed Send. It is not meant for print-shop masters — keep your original if you still need perfect vector text later.</p>
<p>Compared with <a href="/compress-pdf-for-outlook/">Outlook’s tighter 20 MB habit</a>, Gmail gives a little more room, so we use a gentler email preset here. If one file is still huge after compressing, <a href="/split-pdf/">split the PDF</a> or run a second pass on <a href="/compress-pdf/">Compress PDF</a> with the Screen preset.</p>
<p>Also leave a little headroom: embedded images in the email body count toward the same message size. Browse more utilities on <a href="/pdf-tools/">PDF tools</a> when you need merge or reorder after shrinking.</p>`,
    faqH2: 'People also ask about Gmail PDF size',
    faq: [
      {
        q: 'Why does Gmail say my PDF attachment is too large?',
        a: 'Gmail blocks messages when the total size (body + attachments) crosses roughly 25 MB. A phone scan or slide deck often sits just over that line until you compress or split it.',
      },
      {
        q: 'How do I compress a PDF for Gmail without uploading it online?',
        a: 'Use this page: processing runs in your browser only. Download the smaller file, then attach it in Gmail yourself — we never see the PDF.',
      },
      {
        q: 'Will the other person still be able to open it?',
        a: 'Yes. You get a normal PDF that opens in Gmail preview, phones, and desktop readers. Very heavy scans become page images, so text search may be weaker.',
      },
      {
        q: 'What if it is still over 25 MB after compressing?',
        a: 'Split long packets into two emails, remove unused pages, or try a stronger Screen pass on the main Compress PDF tool. One full-bleed photo page is often the culprit.',
      },
      {
        q: 'Is Google Drive a better option than compressing?',
        a: 'Drive links avoid the attachment cap, but the recipient needs access. Compressing is better when the other person expects a simple attached file.',
      },
    ],
  },

  'compress-pdf-for-canvas': {
    securityH2: 'Submit to Canvas without sending homework to a compress site',
    securityHtml: `<p>Canvas upload errors are stressful enough without dropping a graded PDF on a random “free compressor.” Here your assignment stays on the device: we only change how pages are re-saved so a common <strong>5 MB</strong> course limit has a fair chance of accepting it.</p>
<p>Student IDs and handwritten pages never transit through our servers — you download, then upload into Canvas yourself.</p>
<p>Close the tab when you finish. Nothing is retained on VeloTools because nothing was uploaded in the first place.</p>`,
    problemH2: 'Why Canvas assignments fail on PDF size',
    problemHtml: `<p>Many Canvas courses still ship with a default upload ceiling near <strong>5 MB</strong>. That number feels generous until you photograph a worksheet in full color at twelve megapixels — one page can burn the entire quota.</p>
<p>Instructors rarely raise the limit mid-semester. Students then bounce between “file too large” banners and third-party compress sites that ask for an account. The safer path is a local grayscale Screen pass aimed at tonight’s deadline, not a portfolio print.</p>
<p>This page assumes that failure mode on purpose so SpeedGrader still receives something readable after you clear the size check.</p>`,
    stepsH2: 'What to do when Canvas rejects your PDF',
    steps: [
      'Add the file Canvas marked too large — Screen + grayscale for homework scans is already on.',
      'Compress All until the checker shows under 5 MB, then download the result to your device.',
      'Download and submit in Canvas. Still blocked? Remove blank pages or split the lab appendix.',
    ],
    specsH2: 'Canvas-oriented defaults on this URL',
    specs: [
      ['Problem it solves', 'Canvas file too large / assignment upload failed'],
      ['Size check', '5 MB (common course default)'],
      ['Preset', 'Screen quality for phone scans'],
      ['Color', 'Grayscale (cuts size on worksheet photos)'],
      ['Privacy', 'Local only — you upload to Canvas'],
      ['When to switch', 'Color diagrams → main Compress PDF'],
    ],
    presetH2: 'Why Canvas mode forces Screen + grayscale',
    presetHtml: `<p>Homework scans rarely need color fidelity. Forcing grayscale and a Screen DPI target removes the bulk of camera JPEG waste while keeping pencil strokes legible when a TA zooms in SpeedGrader.</p>
<p>If your instructor explicitly wants color figures and raised the course cap, leave this page and use a milder unlocked preset elsewhere — do not fight a 5 MB checker with rainbow pages.</p>`,
    deepH2: 'The real reason Canvas homework PDFs explode in size',
    deepHtml: `<p>Students photograph worksheets in full color at 12 megapixels. Canvas courses often still use a small default upload cap near <strong>5 MB</strong>. One photo page can burn the whole quota.</p>
<p>This URL assumes that failure mode on purpose: grayscale + lower resolution for “get it submitted tonight,” not for a printed portfolio. If your instructor raised the limit and you need color figures, use <a href="/compress-pdf/">Compress PDF</a> with a milder preset instead.</p>
<p>Need a smaller sibling for another LMS? See <a href="/compress-pdf-for-blackboard/">Blackboard</a> or <a href="/compress-pdf-for-moodle/">Moodle</a> — each locks a different tradeoff. To break a giant scan into parts, open <a href="/split-pdf/">Split PDF</a>.</p>
<p>More PDF helpers live under <a href="/pdf-tools/">PDF tools</a> if you need to reorder pages after shrinking for Canvas.</p>`,
    faqH2: 'Canvas PDF upload questions students actually ask',
    faq: [
      {
        q: 'Canvas says my file is too large — how do I fix it fast?',
        a: 'Compress on this page (5 MB checker on), download, and re-upload. Phone scans almost always shrink enough after the grayscale Screen preset.',
      },
      {
        q: 'Will my professor mind if the PDF turns grayscale?',
        a: 'For handwritten homework, usually no. For color charts, ask first or compress on the main tool with color kept if the course allows a bigger file.',
      },
      {
        q: 'Does this upload my assignment to VeloTools?',
        a: 'No. Nothing is sent to us. Only you upload the finished PDF into Canvas.',
      },
      {
        q: 'Can I submit multiple smaller PDFs instead?',
        a: 'If the assignment allows multiple files, split first, then compress each part. Otherwise keep one file under the course cap.',
      },
      {
        q: 'SpeedGrader looks blurry — what now?',
        a: 'Zoom in on a sample page after download. If pencil writing is faint, recompress once at slightly higher quality on Compress PDF, still watching the 5 MB check.',
      },
    ],
  },

  'compress-pdf-for-outlook': {
    securityH2: 'Get past Outlook’s size block on your PC',
    securityHtml: `<p>When Outlook refuses to send, people often try a web compressor that stores the file for “an hour.” Skip that. This Outlook page shrinks the PDF in the browser, keeps review comments when you need them, and checks the common <strong>20 MB</strong> attachment ceiling before you hit Send.</p>
<p>Legal redlines and vendor quotes stay on your machine during compression. VeloTools does not host the file; you attach the download in Outlook yourself.</p>
<p>That local-only path matters when the PDF contains customer data your company policy forbids placing on unknown SaaS compressors.</p>`,
    problemH2: 'Outlook’s attachment ceiling vs what you think you sent',
    problemHtml: `<p>Many Outlook.com and Outlook on the web mailboxes still behave like a <strong>20 MB</strong> attachment cap — five megabytes tighter than everyday Gmail. Desktop Outlook follows whatever Exchange admins configured, which may be the same number or a transport rule that looks like a size error.</p>
<p>Review threads make the problem worse: comment balloons and markup streams add weight on top of already heavy slide exports. Stripping those comments to save space can break the conversation — so this URL keeps them on purpose.</p>
<p>If Send fails even under 20 MB, size is not always the villain; DLP policies can still block the message after compression.</p>`,
    stepsH2: 'Fix Outlook attachment size errors',
    steps: [
      'Drop the PDF Outlook would not send — the 20 MB preset is locked here with comments kept.',
      'Compress All; comments and annotations stay unless you strip them elsewhere on purpose.',
      'Attach the download in Outlook. Still blocked? Split the deck or ask IT if a transport rule is the real cause.',
    ],
    specsH2: 'Outlook attachment profile',
    specs: [
      ['Problem it solves', 'Outlook attachment too large / Send failed'],
      ['Size check', '20 MB (common Outlook.com / OWA default)'],
      ['Preset', 'Email Web quality, slightly stronger than Gmail mode'],
      ['Comments', 'Kept on this URL for review threads'],
      ['Privacy', 'No Microsoft or VeloTools upload during compress'],
      ['Compare', 'Gmail allows ~25 MB — see Gmail page'],
    ],
    presetH2: 'Why Outlook mode is a bit tougher than Gmail mode',
    presetHtml: `<p>Five fewer megabytes than Gmail means we bias JPEG quality slightly more aggressively while still aiming for readable slides on a phone. Annotations stay so sticky-note review threads survive the shrink.</p>
<p>If your tenant truly allows 50–100 MB attachments, you can still use this page for faster mobile downloads — or switch to a lighter unlocked preset when fidelity matters more than the 20 MB warning.</p>`,
    deepH2: 'Outlook vs Gmail size limits (why this page exists)',
    deepHtml: `<p>Five megabytes less room than everyday Gmail is why this Outlook URL exists. Many consumer and OWA mailboxes still behave like a <strong>20 MB</strong> attachment cap, so the preset is a bit more aggressive than <a href="/compress-pdf-for-gmail/">Compress PDF for Gmail</a> while still aiming for readable slides on a phone.</p>
<p>Desktop Outlook follows whatever your Exchange admin configured. If Send fails even under 20 MB, look for DLP or transport rules. Size compression cannot bypass a policy that blocks certain content types.</p>
<p>Sharing a huge appendix? <a href="/split-pdf/">Split PDF</a> into parts, or host the full file and send a link. For a second, stronger pass use <a href="/compress-pdf/">Compress PDF</a> unlocked.</p>
<p>Need chat delivery instead of mail? Compare <a href="/compress-pdf-for-teams/">Teams</a> or browse <a href="/pdf-tools/">PDF tools</a> for merge and split after you clear Outlook’s size gate.</p>`,
    faqH2: 'Outlook PDF attachment FAQ',
    faq: [
      {
        q: 'Why won’t Outlook send my PDF?',
        a: 'Most often the attachment is over the mailbox size limit (commonly around 20 MB). Compress here, or split the file. Less often, a company rule blocks the message for other reasons.',
      },
      {
        q: 'Is Outlook’s limit smaller than Gmail’s?',
        a: 'For many consumer and OWA accounts, yes — roughly 20 MB vs Gmail’s ~25 MB. Use this page for Outlook and the Gmail page when you are sending from Gmail.',
      },
      {
        q: 'Do I lose comment bubbles when I compress?',
        a: 'Not on this Outlook URL — annotations are kept so review threads survive. Other VeloTools presets may strip them to save more space.',
      },
      {
        q: 'Can I compress without signing into Microsoft 365?',
        a: 'Yes. There is no Outlook login here. You only attach the finished PDF in Outlook yourself.',
      },
      {
        q: 'What if IT raised our limit to 100 MB?',
        a: 'You can still compress for faster mobile downloads. Ignore the 20 MB warning when you know your tenant allows more — or use the main compressor with a lighter preset.',
      },
    ],
  },

  'compress-pdf-for-blackboard': {
    securityH2: 'Blackboard uploads without a public compress middleman',
    securityHtml: `<p>Graded work belongs in Blackboard, not on a third-party compress server. This page prepares a smaller PDF on your computer with a homework preset (grayscale Screen) aimed at the <strong>~10 MB</strong> ceiling many Ultra courses still use.</p>
<p>Stylus markups and camera scans never leave your device during the shrink. You download, then submit into Blackboard yourself.</p>
<p>That browser-only path keeps student work out of unknown compress SaaS logs while you chase the course quota.</p>`,
    problemH2: 'When Blackboard Ultra rejects a scanned packet',
    problemHtml: `<p>Tablet markups and phone photos inflate PDFs faster than students expect. Blackboard Learn / Ultra courses frequently sit near a <strong>10 MB</strong> assignment cap — larger than Canvas’s harsh 5 MB default, still small for color photo packets.</p>
<p>Apple Pencil layers and annotation streams add invisible bloat on top of the page images. Removing that stream while converting to grayscale is usually what clears the upload dialog.</p>
<p>Admins can change quotas per course, so treat 10 MB as a common real-world target, not a universal Blackboard law.</p>`,
    stepsH2: 'When Blackboard says the file exceeds the limit',
    steps: [
      'Drop the rejected PDF — grayscale Screen mode for scans is already locked on this Blackboard URL.',
      'Compress All until you clear the 10 MB check and confirm a sample page still looks readable.',
      'Submit in Blackboard. If it still fails, split appendices or confirm the course’s real max file size.',
    ],
    specsH2: 'Blackboard homework preset',
    specs: [
      ['Problem it solves', 'Blackboard upload limit / file exceeds maximum'],
      ['Size check', '10 MB typical Ultra-style quota'],
      ['Preset', 'Screen + grayscale for phone scans'],
      ['Stylus markups', 'Annotation data stripped to cut bloat'],
      ['Privacy', 'Local compress → you upload to Blackboard'],
      ['Sister pages', 'Canvas (5 MB) · Moodle (color kept)'],
    ],
    presetH2: 'Gray Screen for Blackboard, not for color schematics',
    presetHtml: `<p>We force grayscale here because most rejected Blackboard homework is readable in gray. Annotation streams from stylus apps get stripped so the file stops carrying unused markup weight.</p>
<p>Need color schematics for an engineering course? Prefer Moodle mode on this site (color kept) or unlocked Compress PDF after you confirm a higher course limit — fighting color through a 10 MB gray-biased checker is the wrong fight.</p>`,
    deepH2: 'Scans, stylus pens, and Blackboard’s small quotas',
    deepHtml: `<p>Ultra courses frequently sit near a <strong>10 MB</strong> assignment cap — larger than Canvas’s harsh 5 MB default, still small for color photo packets packed with stylus layers.</p>
<p>We force grayscale here because most rejected Blackboard homework is readable in gray. Need color schematics? Prefer <a href="/compress-pdf-for-moodle/">Moodle mode</a> (color kept) or unlocked <a href="/compress-pdf/">Compress PDF</a> after you confirm a higher course limit.</p>
<p>Canvas users with a stricter cap should use <a href="/compress-pdf-for-canvas/">Compress PDF for Canvas</a>. Giant multi-lab PDFs belong in <a href="/split-pdf/">Split PDF</a> before a second compress.</p>
<p>After you clear the size gate, other helpers on <a href="/pdf-tools/">PDF tools</a> can reorder pages if your instructor wants a specific packet order.</p>`,
    faqH2: 'Blackboard file size questions',
    faq: [
      {
        q: 'Blackboard says my PDF exceeds the maximum allowed size — now what?',
        a: 'Compress on this page, re-download, and try again. If your course allows multiple files, split the PDF and upload parts.',
      },
      {
        q: 'Is 10 MB the official Blackboard limit everywhere?',
        a: 'No — admins set quotas. Ten megabytes is a common real-world default we optimize for. Check the assignment details if your school publishes a different number.',
      },
      {
        q: 'Will SafeAssign still work on a compressed scan?',
        a: 'Instructors can still open and read it. Automated text matching may see less selectable text after raster compression — ask if an original text PDF is required.',
      },
      {
        q: 'My PDF has Apple Pencil drawings and is huge.',
        a: 'This preset strips annotation streams and re-encodes pages in grayscale, which usually fixes stylus bloat.',
      },
      {
        q: 'Should I use the Canvas page instead?',
        a: 'Only if you submit to Canvas. Canvas mode aims at 5 MB with a harsher preset; Blackboard mode targets the looser ~10 MB homework case.',
      },
    ],
  },

  'compress-pdf-for-usps': {
    securityH2: 'Form PDFs stay private while you chase the size limit',
    securityHtml: `<p>Shipping labels, ID scans, and signed affidavits should not be uploaded to a random compress site. Use this page to shrink toward a practical <strong>~10 MB</strong> form limit while keeping color so stamps and ink still look intentional — everything runs offline in the browser.</p>
<p>Government and carrier portals already ask for sensitive pages; adding another third-party upload before that step is unnecessary risk.</p>
<p>VeloTools never receives the scan. You compress locally, then upload only to the official portal.</p>`,
    problemH2: 'Portal size errors that still demand readable seals',
    problemHtml: `<p>Online forms tied to USPS-style and municipal workflows often reject single-file uploads past roughly <strong>10 MB</strong>. Unlike homework modes, you cannot simply force grayscale — a muddy stamp or blue wet signature can fail a human review even when the byte count looks fine.</p>
<p>People respond by crushing quality until seals look blocky, then get rejected for legibility instead of size. The better path is email-like resolution with color kept, plus a warning near 10 MB so you know when to remove extra pages instead of destroying the stamp.</p>
<p>Always read the form’s own help text; some legacy fields sit at 5 MB and need a stronger Screen pass after this one.</p>`,
    stepsH2: 'Portal rejected your PDF for size — try this',
    steps: [
      'Drop the form or scan the portal refused — color is kept on purpose for seals and ink.',
      'Compress All and confirm you are under the 10 MB warning before leaving this tab.',
      'Upload to the official site. If it still fails, remove extra pages before crushing quality again.',
    ],
    specsH2: 'Gov / USPS-style form preset',
    specs: [
      ['Problem it solves', 'Online form PDF too large to upload'],
      ['Size check', '~10 MB practical single-file target'],
      ['Color', 'Kept for seals, stamps, blue ink'],
      ['Hidden data', 'Metadata stripped; visible pages unchanged'],
      ['Privacy', 'Local only — upload only to the official portal'],
      ['Not for', 'PDF/A archival packages'],
    ],
    presetH2: 'Color kept on purpose for stamps and wet ink',
    presetHtml: `<p>Unlike LMS grayscale modes, this URL refuses forced gray. We re-encode at email-like resolution, strip metadata that does not help a reviewer, and warn around 10 MB so you know when to delete unused pages.</p>
<p>It will not emit PDF/A. If the checklist demands archival PDF/A, use a dedicated converter after size is under control — do not expect a size tool to invent conformance.</p>`,
    deepH2: 'Readable seals beat maximum compression',
    deepHtml: `<p>Unlike homework modes, this URL refuses forced grayscale. A muddy stamp can fail a human review even when the file is small enough. We trade a bit of size for color fidelity at email-like resolution, then warn around <strong>10 MB</strong> — a ceiling many USPS-related and municipal fields still hint at.</p>
<p>Always read the form’s own help text; some legacy fields sit at 5 MB. When that happens, try Screen on <a href="/compress-pdf/">Compress PDF</a> and zoom the signature before submitting.</p>
<p>For school portals instead of government forms, use <a href="/compress-pdf-for-canvas/">Canvas</a>, <a href="/compress-pdf-for-blackboard/">Blackboard</a>, or <a href="/compress-pdf-for-moodle/">Moodle</a>. Multi-page evidence packets can be divided with <a href="/split-pdf/">Split PDF</a>.</p>
<p>Browse <a href="/pdf-tools/">PDF tools</a> if you need to reorder scanned pages before the official upload.</p>`,
    faqH2: 'USPS and government PDF upload FAQ',
    faq: [
      {
        q: 'The website says my PDF is too large to upload — can I compress it safely?',
        a: 'Yes on this page: compression stays in your browser. Then upload only to the official portal, never to an unknown third party.',
      },
      {
        q: 'Will my colored stamp or wet signature still look okay?',
        a: 'Color is preserved. Open the download at 100% zoom and check seals before submitting. If a stamp looks blocky, recompress once at higher quality on the main tool.',
      },
      {
        q: 'Is 10 MB guaranteed for every USPS form?',
        a: 'No. It is a practical working target. Follow the number printed on that specific form if it differs.',
      },
      {
        q: 'Do you store my ID scan?',
        a: 'No. Close the tab when you finish; we never receive the file.',
      },
      {
        q: 'The form requires PDF/A. Does this create PDF/A?',
        a: 'No. This outputs a normal size-optimized PDF. Use a PDF/A tool if the checklist explicitly demands it.',
      },
    ],
  },

  'compress-pdf-for-moodle': {
    securityH2: 'Moodle maxbytes errors without giving away the file',
    securityHtml: `<p>When Moodle blocks a submit on maximum file size, compress locally first. This page targets a conservative <strong>10 MB</strong> working default many sites use, keeps color for plots and screenshots, and never uploads your coursework to us.</p>
<p>STEM diagrams die in forced grayscale. That is why Moodle mode keeps color while still aiming at a practical Screen resolution for faster uploads.</p>
<p>You download the result and submit in Moodle yourself — no Moodle login and no VeloTools server copy.</p>`,
    problemH2: 'maxbytes surprises on school Moodle sites',
    problemHtml: `<p>Moodle limits are local configuration, often anywhere from a few megabytes to tens of megabytes. Publishing an honest <strong>10 MB</strong> working target helps the common case without pretending we can read your server’s maxbytes setting.</p>
<p>Students hit the wall with screenshot-heavy lab reports and colorful plots exported straight from notebooks. A Canvas-style gray crush would destroy those figures, so this URL takes a different path than Blackboard mode.</p>
<p>If your activity lists 2 MB, plan to split or run a stronger pass after this one. If it lists 50 MB, lighten up — the 10 MB checker is guidance, not a Moodle API feed.</p>`,
    stepsH2: 'Clear a Moodle “file is too large” message',
    steps: [
      'Drop the PDF Moodle rejected — Screen preset with color kept is locked here for STEM uploads.',
      'Compress All and watch the 10 MB checker (adjust expectations if your course lists another maxbytes).',
      'Download and submit again in Moodle. Ask the instructor only if the course publishes a different limit.',
    ],
    specsH2: 'Moodle-oriented working defaults',
    specs: [
      ['Problem it solves', 'Moodle maximum submission size / maxbytes'],
      ['Working check', '10 MB (confirm your course)'],
      ['Color', 'Kept for diagrams and code screenshots'],
      ['Preset', 'Screen resolution for faster uploads'],
      ['Privacy', 'Browser-only compress'],
      ['Contrast', 'Blackboard mode forces grayscale; Moodle does not'],
    ],
    presetH2: 'Color Screen for Moodle labs and plots',
    presetHtml: `<p>We lock Screen resolution so uploads finish on campus Wi-Fi without preserving print DPI. Color stays on because notebook plots and UI screenshots lose meaning when flattened to gray.</p>
<p>Blackboard’s sibling page on this site is the one that forces grayscale for scan-heavy homework. Pick the URL that matches your LMS, not the one that matches a friend’s advice from another platform.</p>`,
    deepH2: 'Your Moodle site picks maxbytes — we pick a safe middle',
    deepHtml: `<p>Because every school configures Moodle differently, we cannot promise a live maxbytes readout. A published <strong>10 MB</strong> working target still covers the most common assignment caps without inventing a false API sync.</p>
<p>Color stays on because STEM uploads die in forced grayscale. That is the intentional opposite of <a href="/compress-pdf-for-blackboard/">Blackboard mode</a>. Canvas courses with a brutal 5 MB cap should use <a href="/compress-pdf-for-canvas/">Compress PDF for Canvas</a> instead.</p>
<p>If your activity allows 50 MB, lighten up on <a href="/compress-pdf/">Compress PDF</a>. If it allows only 2 MB, plan on <a href="/split-pdf/">splitting</a> or a stronger grayscale pass after this one.</p>
<p>Need other PDF helpers after the shrink? Start from <a href="/pdf-tools/">PDF tools</a>.</p>`,
    faqH2: 'Moodle PDF size FAQ',
    faq: [
      {
        q: 'Moodle says the file is bigger than the maximum size allowed. How do I compress it?',
        a: 'Use this page, download the result, and upload again. Check the assignment’s listed maximum — your school may use a number other than 10 MB.',
      },
      {
        q: 'Where do I find my course’s real size limit?',
        a: 'Open the assignment settings text or ask the teacher/admin for maxbytes. Our 10 MB checker is a safe default, not a live feed from Moodle.',
      },
      {
        q: 'I have colored plots — will they survive?',
        a: 'Yes. This Moodle URL keeps color. Blackboard’s page on this site is the one that forces grayscale for scan-heavy homework.',
      },
      {
        q: 'Can I batch a whole folder for one week’s labs?',
        a: 'You can compress several PDFs in one sitting, but Moodle still enforces each activity’s rules. Check every output against the size warning.',
      },
      {
        q: 'Is my gradebook data involved?',
        a: 'No. There is no Moodle login and no server sync — only a local PDF shrink.',
      },
    ],
  },

  'compress-pdf-for-whatsapp': {
    securityH2: 'Family-group paperwork stays on your device until you tap Send',
    securityHtml: `<p>Rent renewals, pharmacy letters, and weekend itineraries that circulate in a WhatsApp family group deserve a kitchen-table workflow: slim the PDF on the handset or laptop you already trust, then hand the result to the paperclip yourself. This URL steers toward a comfortable <strong>~16 MB</strong> footprint so prepaid LTE does not choke the chat bubble mid-fetch.</p>
<p>Nothing leaves the tab while the shrink runs. Meta’s messenger only learns about the bytes after you deliberately pick the Document attachment inside WhatsApp.</p>
<p>That gap matters when aunties forward clinic notes or passport scans without thinking about random “free compressor” sites that quietly archive uploads.</p>`,
    problemH2: 'The spinning WhatsApp bubble that never finishes',
    problemHtml: `<p>WhatsApp’s marketing ceilings sound generous, yet a dense scan north of roughly <strong>16 MB</strong> turns into an endless circle on the other person’s phone. They abandon the fetch, ask you to “just screenshot it,” and suddenly boarding-pass barcodes become unreadable mush.</p>
<p>The camera-roll shortcut is the second failure mode. Dropping pages through the photo picker makes WhatsApp treat sheets like holiday snaps — heavy recompression, soft edges, dead barcodes. The durable ritual is: slim locally → save → paperclip → Document attachment.</p>
<p>This page optimizes for “opened before dinner,” not for archiving a press-ready landlord packet you should keep untouched in a folder at home.</p>`,
    stepsH2: 'Get a PDF into WhatsApp without the endless spinner',
    steps: [
      'Drop the overweight PDF — this chat URL locks a sharper bias for barcodes and fine landlord print.',
      'Run Compress All until the checker sits near or under the ~16 MB comfort band shown on screen.',
      'Save the result, open WhatsApp, paperclip as Document (never the photo picker). Camera-roll sends smear barcodes.',
    ],
    specsH2: 'WhatsApp paperclip Document profile',
    specs: [
      ['Problem it solves', 'PDF stalls mid-bubble / too heavy for family WhatsApp'],
      ['Comfort band', '~16 MB for prepaid LTE chat delivery'],
      ['Attach via', 'Paperclip Document (never camera roll)'],
      ['Quality bias', 'Sharper than mailbox modes for barcodes and fine print'],
      ['Privacy', 'Tab-local shrink before the messenger sees bytes'],
      ['Related', 'Split PDF when a multi-chapter rent pack still balloons'],
    ],
    presetH2: 'Barcode-friendly squeeze — not a homework Screen crush',
    presetHtml: `<p>JPEG bias sits higher than pure mailbox modes so boarding-pass barcodes and tiny landlord footnotes still scan under kitchen lighting. You trade some aggressiveness versus a Screen homework crush, and that is intentional: family chats punish illegible codes harder than they punish a few extra megabytes.</p>
<p>When one visa page must stay razor-clear inside a fat binder, chapter it apart first, then slim that sheet alone. Hoping WhatsApp will cheerfully ferry a 40 MB binder across prepaid LTE is how weekend trips start with arguments.</p>`,
    deepH2: 'Why the paperclip Document path and the ~16 MB comfort band',
    deepHtml: `<p>Think of WhatsApp less as a file server and more as a dinner-table courier. The comfort band on this URL lands near <strong>16 MB</strong> because that is where prepaid LTE stops abandoning the spinning bubble. Formal ceilings can read higher; patience in a noisy family group does not.</p>
<p>After you save the slim copy, always choose the <strong>Document</strong> attachment behind the paperclip. The photo picker re-bakes every sheet as if it were a selfie and routinely kills boarding-pass barcodes that looked perfect on your laptop.</p>
<p>Mailbox routes remain different jobs: <a href="/compress-pdf-for-gmail/">Gmail</a> (25 MB) and <a href="/compress-pdf-for-outlook/">Outlook</a> (20 MB) serve inbox workflows. Overstuffed binders belong in <a href="/split-pdf/">Split PDF</a> before a gentle second pass on <a href="/compress-pdf/">Compress PDF</a> when a single visa sheet must stay razor-clear.</p>
<p>If you need a messenger with a loftier comfort band for briefing stacks, compare <a href="/compress-pdf-for-telegram/">Telegram</a>. The wider catalog lives under <a href="/pdf-tools/">PDF tools</a>.</p>
<p>A useful household ritual: keep the untouched landlord original offline, slim a share copy for the group, and never overwrite the master with a chat-optimized export. Clinic letters and ID pages deserve the same two-copy habit — the kitchen table is not a records office, but the muscle memory saves tears later.</p>
<p>When someone still claims “it will not open,” ask which path they used. Nine times out of ten they forwarded a camera-roll collage. Resend the slim PDF via paperclip Document and watch the barcode revive. That single behavioral fix outperforms another round of aggressive shrinking.</p>`,
    faqH2: 'WhatsApp paperclip FAQ for heavy PDFs',
    faq: [
      {
        q: 'How do I slim a PDF before a WhatsApp send?',
        a: 'Run this page until you sit near or under about 16 MB, save the result, then in WhatsApp open the paperclip and pick Document — skip the photo picker entirely.',
      },
      {
        q: 'Why did my WhatsApp PDF turn soft and unreadable?',
        a: 'Almost always the camera-roll path. Resend the saved PDF as a Document attachment so WhatsApp stops re-baking sheets like holiday snaps.',
      },
      {
        q: 'WhatsApp took a heavier packet last month — why steer to 16 MB?',
        a: 'A heavier packet can clear the formal gate and still die on prepaid LTE for the other person. Sixteen megabytes is a comfort band aimed at fewer abandoned bubbles.',
      },
      {
        q: 'Will a boarding-pass barcode still scan after this squeeze?',
        a: 'The preset keeps a higher JPEG bias for that reason. If a code still fails, isolate that single sheet, slim it hotter on the main tool, and keep mass down by chaptering the binder.',
      },
      {
        q: 'Can Meta or VeloTools peek while the shrink runs?',
        a: 'VeloTools never sees the bytes — work stays in the tab. WhatsApp only learns about the PDF when you attach it yourself afterward.',
      },
    ],
  },

  'compress-pdf-for-slack': {
    securityH2: 'Prepare Slack files without parking them on a compress SaaS',
    securityHtml: `<p>Slack channels fill with PDFs that look fine on a laptop and stall on phones. Before you drop a deck into #general, shrink it in the browser here — VeloTools never hosts the file; Slack only sees what you upload afterward.</p>
<p>Internal roadmaps and salary bands should not detour through a random “free PDF compressor” just to clear a slow preview spinner.</p>
<p>Compression stays in tab memory. Close the tab when you finish and only the Slack upload remains under your workspace policies.</p>`,
    problemH2: 'Why Slack previews choke on “small” PDFs',
    problemHtml: `<p>Slack’s formal file limits are higher than what feels fast in a busy channel. In practice, PDFs past roughly <strong>1 MB</strong> of dense scans or slide exports make mobile previews crawl, force “tap to download,” and get ignored in standup threads.</p>
<p>People respond by pasting screenshots — worse for search, worse for accessibility, and still heavy. A Screen-leaning local compress aimed at that practical ~1 MB screen target keeps the file as a real PDF while respecting how Slack is actually used.</p>
<p>Workspace admins can raise quotas; they cannot invent patience for a 40 MB scan in a chat sidebar.</p>`,
    stepsH2: 'Make a PDF feel snappy inside Slack',
    steps: [
      'Drop the PDF that stalls Slack preview — a practical ~1 MB screen-oriented check is locked here.',
      'Compress All until the size warning clears for comfortable channel sharing on phones.',
      'Download, then upload into Slack yourself. Still sluggish? Split the appendix or share a Drive link instead.',
    ],
    specsH2: 'Slack channel sharing profile',
    specs: [
      ['Problem it solves', 'Slack PDF preview slow / file feels too heavy'],
      ['Practical check', '~1 MB for comfortable mobile screen sharing'],
      ['Preset bias', 'Screen-leaning for chat, not print'],
      ['Color', 'Kept for diagrams; expect stronger re-encode'],
      ['Privacy', 'Browser-only before your Slack upload'],
      ['When to skip', 'Archive masters — keep originals offline'],
    ],
    presetH2: 'Screen-first for Slack, not for print packets',
    presetHtml: `<p>This URL biases toward Screen quality so channel previews open without a long spinner. It is intentionally harsher than email modes because Slack reading happens in a narrow pane, not as an attachment people print later.</p>
<p>If legal needs a pristine archive, keep the original and only share the compressed copy in Slack. Do not overwrite your only master with a chat-optimized export.</p>`,
    deepH2: 'Formal Slack limits vs the ~1 MB practical screen target',
    deepHtml: `<p>Slack can accept larger files than a megabyte, yet dense PDFs past roughly <strong>1 MB</strong> routinely feel broken on phones: blank preview tiles, forced downloads, and threads that move on without reading. This page optimizes for that human limit, not the marketing ceiling.</p>
<p>Need a bigger attachment path for email instead? Use <a href="/compress-pdf-for-gmail/">Gmail</a> (25 MB) or <a href="/compress-pdf-for-outlook/">Outlook</a> (20 MB). For Microsoft chat with a higher practical budget, see <a href="/compress-pdf-for-teams/">Compress PDF for Teams</a>.</p>
<p>Huge binders belong in <a href="/split-pdf/">Split PDF</a> before a second pass on <a href="/compress-pdf/">Compress PDF</a>. More helpers live under <a href="/pdf-tools/">PDF tools</a>.</p>
<p>Remember: after you download, Slack still applies your workspace’s own retention and DLP rules — local compression does not bypass those.</p>`,
    faqH2: 'Slack PDF size questions people type into search',
    faq: [
      {
        q: 'How do I make a PDF smaller so Slack preview opens faster?',
        a: 'Compress it here toward roughly 1 MB for screen sharing, download the result, then upload into Slack. Dense scans usually shrink enough for mobile previews.',
      },
      {
        q: 'What is Slack’s real PDF upload limit?',
        a: 'Paid workspaces allow larger files than free plans, but the practical pain starts near 1 MB for phone previews. This page targets that usability ceiling.',
      },
      {
        q: 'Does compressing here upload my PDF to Slack automatically?',
        a: 'No. Processing is local in your browser. You upload to Slack only after you download.',
      },
      {
        q: 'Will teammates still be able to search text inside the PDF?',
        a: 'Often yes for born-digital text. Heavy camera scans may become page images, so search can weaken — keep a text original if searchability is critical.',
      },
      {
        q: 'Should I paste screenshots into Slack instead of a PDF?',
        a: 'Usually no. A compressed PDF stays clearer, searchable more often, and easier to download later than a pile of screenshots.',
      },
    ],
  },

  'compress-pdf-for-teams': {
    securityH2: 'Shrink for Microsoft Teams without a third-party upload hop',
    securityHtml: `<p>Teams chats and channel posts inherit Microsoft 365 attachment habits. Before you pin a PDF in a meeting chat, shrink it locally toward the familiar <strong>25 MB</strong> ceiling — processing stays in your browser, not on a public compress host.</p>
<p>Customer SOWs and HR packets should not detour through unknown SaaS just to clear a Teams size warning.</p>
<p>Download the result, then upload in Teams yourself. VeloTools never sees the bytes.</p>`,
    problemH2: 'Teams attachment failures that look like Outlook problems',
    problemHtml: `<p>Many tenants still behave like a <strong>25 MB</strong> practical attachment budget for chat and channel files — the same ballpark as Gmail, looser than Outlook’s common 20 MB consumer cap. Meeting recordings are unrelated; this page is for document PDFs people drag into chat.</p>
<p>Exported decks with embedded video posters and high-DPI screenshots routinely trip the limit. People then paste OneDrive links without permissions set, and external guests cannot open them.</p>
<p>Compressing locally keeps the “simple attached file” workflow while clearing the size gate before the meeting starts.</p>`,
    stepsH2: 'Clear a Teams “file is too large” chat upload',
    steps: [
      'Drop the PDF Teams refused — the 25 MB checker is already locked for this Microsoft chat URL.',
      'Compress All and wait until the size status shows under 25 MB for a safe channel attach.',
      'Download, then upload in Teams. Still blocked? Confirm tenant policies or split the deck into parts.',
    ],
    specsH2: 'Microsoft Teams document profile',
    specs: [
      ['Problem it solves', 'Teams chat/channel PDF too large to upload'],
      ['Size check', '25 MB practical attachment target'],
      ['Preset', 'Email-friendly Web quality for meeting chat'],
      ['Color', 'Kept for slide decks and screenshots'],
      ['Privacy', 'Local compress before Teams upload'],
      ['Compare', 'Outlook often tighter at ~20 MB'],
    ],
    presetH2: 'Web quality tuned for Teams chat panes',
    presetHtml: `<p>We lock an email-like Web preset so slides remain readable inside Teams’ preview pane without preserving print masters. Metadata bloat is stripped; visible pages stay in color.</p>
<p>If your tenant allows much larger files, you can still compress for guests on mobile data — or use a milder unlocked preset when fidelity beats the 25 MB warning.</p>`,
    deepH2: 'Teams at 25 MB vs Outlook’s tighter mailbox habit',
    deepHtml: `<p>Teams commonly lands near a <strong>25 MB</strong> practical document budget for chat uploads — closer to Gmail than to Outlook’s frequent <strong>20 MB</strong> consumer ceiling. That is why this preset is gentler than <a href="/compress-pdf-for-outlook/">Compress PDF for Outlook</a> while still aiming for readable meeting decks.</p>
<p>Guest access still follows SharePoint/OneDrive permissions if you switch to links. Compressing keeps a self-contained PDF when that is what attendees expect.</p>
<p>Need a harsher chat target? See <a href="/compress-pdf-for-slack/">Slack’s ~1 MB practical screen mode</a>. For chaptered packets use <a href="/split-pdf/">Split PDF</a>, then a light pass on <a href="/compress-pdf/">Compress PDF</a>.</p>
<p>Explore more utilities from <a href="/pdf-tools/">PDF tools</a> after the file clears Teams.</p>`,
    faqH2: 'Microsoft Teams PDF upload FAQ',
    faq: [
      {
        q: 'Why won’t Microsoft Teams accept my PDF in chat?',
        a: 'Most often the file is over the tenant’s attachment size budget — commonly around 25 MB. Compress here, then try again. Policies can still block certain content types.',
      },
      {
        q: 'Is the Teams limit the same as Outlook’s?',
        a: 'Not always. Outlook.com/OWA often feels like 20 MB, while Teams chat frequently allows closer to 25 MB. Use the matching page for the app you are uploading into.',
      },
      {
        q: 'Does this tool sign into my Microsoft 365 account?',
        a: 'No. There is no Microsoft login on this page. You only upload the finished PDF inside Teams yourself.',
      },
      {
        q: 'Can external guests open the compressed PDF?',
        a: 'Yes if you attach it in a chat they can access. Link sharing still depends on OneDrive permissions — attachment sharing is usually simpler for one-off decks.',
      },
      {
        q: 'What if my admin raised the limit above 25 MB?',
        a: 'You can still compress for faster mobile downloads. Treat the 25 MB checker as guidance when you know your tenant allows more.',
      },
    ],
  },

  'compress-pdf-for-discord': {
    securityH2: 'Discord-ready PDFs without uploading to a random compressor',
    securityHtml: `<p>Sharing patch notes, zines, or class notes in Discord should not require parking the PDF on an unknown compress site first. Shrink it in your browser here, then attach in the channel yourself — VeloTools never receives the file.</p>
<p>Nitro and server boosts change formal ceilings, but privacy should not. Local compression keeps fan wikis and homework out of third-party logs.</p>
<p>Close the tab when you finish. Only Discord sees what you choose to upload afterward.</p>`,
    problemH2: 'When Discord uploads stall even under the formal cap',
    problemHtml: `<p>Discord’s documented file size depends on Nitro status — often landing near <strong>~25 MB</strong> for many users — yet dense PDFs past roughly <strong>10 MB</strong> already feel painful on mobile data and slow community Wi-Fi.</p>
<p>People then convert pages to JPEG spam in the channel, which destroys search and makes moderation harder. A practical ~10 MB compress with readable quality keeps the file as a Document-style attach without burning the whole Nitro budget.</p>
<p>If you are on a tight free-tier ceiling, aim under that practical 10 MB target before you hit Send.</p>`,
    stepsH2: 'Attach a PDF in Discord without the upload hanging',
    steps: [
      'Drop the heavy PDF — this page aims at a practical ~10 MB Discord-friendly size under a ~25 MB ceiling.',
      'Compress All until the checker clears for comfortable mobile downloads in the channel.',
      'Download, then upload in Discord. Still failing? Confirm Nitro limits or split the packet into parts.',
    ],
    specsH2: 'Discord attachment working profile',
    specs: [
      ['Problem it solves', 'Discord PDF upload too large / hangs on mobile'],
      ['Formal ballpark', '~25 MB depending on Nitro'],
      ['Practical check', '~10 MB for comfortable delivery'],
      ['Preset', 'Chat-readable Web/Screen balance'],
      ['Privacy', 'Browser-only before Discord upload'],
      ['Tip', 'Prefer file attach over image paste stacks'],
    ],
    presetH2: 'Balanced quality under Discord’s practical 10 MB feel',
    presetHtml: `<p>We bias toward readable chat quality rather than print DPI, targeting the ~10 MB practical zone so non-Nitro friends can still download. Color stays for illustrated notes; metadata bloat goes away.</p>
<p>If you only share with Nitro friends on fiber, you can loosen up on the main compressor — this URL is for the common “everyone in the server can open it” case.</p>`,
    deepH2: 'Nitro ceilings vs the ~10 MB Discord practical target',
    deepHtml: `<p>Discord may allow up to roughly <strong>25 MB</strong> depending on Nitro, yet community uploads past about <strong>10 MB</strong> routinely fail the human test: canceled downloads, angry “reupload” replies, and screenshot spam. This page aims at that practical band.</p>
<p>For messaging with a similar chat vibe, compare <a href="/compress-pdf-for-whatsapp/">WhatsApp (~16 MB practical)</a> or <a href="/compress-pdf-for-telegram/">Telegram</a>. Email still belongs on <a href="/compress-pdf-for-gmail/">Gmail</a> when the audience is not in Discord.</p>
<p>Chapter a long zine with <a href="/split-pdf/">Split PDF</a>, then refine on <a href="/compress-pdf/">Compress PDF</a> if one issue must stay sharper. More options sit under <a href="/pdf-tools/">PDF tools</a>.</p>`,
    faqH2: 'Discord PDF file size questions',
    faq: [
      {
        q: 'How big can a PDF be for Discord?',
        a: 'It depends on Nitro and server settings — often around 25 MB — but files near 10 MB download more reliably for everyone. This page targets that practical size.',
      },
      {
        q: 'Why does my Discord PDF upload hang at 99%?',
        a: 'Large or dense PDFs time out on slow connections. Compress toward ~10 MB here, then retry. Splitting into parts also helps.',
      },
      {
        q: 'Is it safe to compress homework before posting in a class Discord?',
        a: 'Yes on this page: compression stays in your browser. Only upload the result into Discord if your school rules allow sharing that material.',
      },
      {
        q: 'Should I paste page screenshots instead of uploading a PDF?',
        a: 'Usually no. Screenshots spam the channel and lose vector text. A compressed PDF is cleaner for mods and readers.',
      },
      {
        q: 'Does VeloTools keep a copy for Nitro users to redownload?',
        a: 'No. Nothing is uploaded to us. There is no cloud stash — only your local download.',
      },
    ],
  },

  'compress-pdf-for-telegram': {
    securityH2: 'Lighten messenger files without parking them on a public compressor',
    securityHtml: `<p>Telegram’s Files tray is how freelancers move invoice stacks, stamped contracts, and channel briefing decks without feeding a media-album recompress pipeline. Pare mass in your own tab toward a field-friendly <strong>~20 MB</strong> band — VeloTools never hosts the payload; Telegram only receives what you choose later in the client.</p>
<p>Secret conversations and noisy workgroups both benefit from skipping shady shrink SaaS that quietly retain copies.</p>
<p>Processing stays inside the session memory. Close the tab when finished; solely your Telegram client performs the outbound transfer.</p>`,
    problemH2: 'Protocol capacity is not the same as a client who taps Open',
    problemHtml: `<p>Telegram’s pipe can haul oversized payloads, yet a dense scan past roughly <strong>20 MB</strong> still dies on commute LTE: the progress bar freezes, the freelancer “delivered” nothing useful, and the client never taps Open.</p>
<p>Routing sheets through the media album is worse. Telegram’s image pipeline smears microtext, stamp seals, and wireframe callouts until the brief is useless. The dependable sequence is: lighten locally → save → Files tray → skip Gallery entirely.</p>
<p>This URL optimizes for “opened in the taxi,” not for freezing a press-ready archive you should retain offline before the messenger transfer.</p>`,
    stepsH2: 'Move a PDF through Telegram’s Files tray without a dead progress bar',
    steps: [
      'Drop the PDF whose transfer dies mid-commute — the ~20 MB field band is locked on this messenger URL.',
      'Run Compress All until the size status feels safe for mobile Files delivery on LTE.',
      'Save, open Telegram, pick Files (not Gallery). Chapter the deck if mass still balloons.',
    ],
    specsH2: 'Telegram Files-tray working profile',
    specs: [
      ['Problem it solves', 'Telegram PDF transfer dies / client never opens it'],
      ['Field band', '~20 MB for reliable mobile Files sends'],
      ['Route via', 'Files tray — avoid Gallery / media album'],
      ['Fidelity', 'Messenger-readable with microtext-friendly bias'],
      ['Privacy', 'Session-local lighten before Telegram transfer'],
      ['Compare', 'WhatsApp ~16 MB comfort · Discord ~10 MB feel'],
    ],
    presetH2: 'Files-tray fidelity for Telegram — not media-album mush',
    presetHtml: `<p>We hold enough fidelity for invoice stamps and dense callouts while steering under the ~20 MB field line. Deadweight metadata disappears; illustrated briefs keep color.</p>
<p>If you only ship archive masters to desktop readers on cafe Wi-Fi, loosen on the unlocked compressor — this page serves the “opens on a phone between subway stops” case.</p>`,
    deepH2: 'Capacity myths versus the ~20 MB Telegram field band',
    deepHtml: `<p>Telegram’s protocol can ferry larger payloads than most everyday messengers, yet real clients on commute LTE abandon transfers past about <strong>20 MB</strong> of dense PDF. This page aims at that human ceiling so “delivered” equals “actually read.”</p>
<p>Sibling messenger targets lock different tradeoffs: <a href="/compress-pdf-for-whatsapp/">WhatsApp (~16 MB comfort)</a>, <a href="/compress-pdf-for-discord/">Discord (~10 MB feel)</a>, and <a href="/compress-pdf-for-slack/">Slack (~1 MB screen habit)</a>.</p>
<p>Chapter long briefing decks with <a href="/split-pdf/">Split PDF</a>, refine on <a href="/compress-pdf/">Compress PDF</a>, or browse <a href="/pdf-tools/">PDF tools</a> when you need merge after reordering sections.</p>
<p>Always route through the Files tray after saving. Gallery / media-album sends re-bake sheets like snapshots and routinely destroy microtext and stamp seals that looked crisp on a monitor.</p>
<p>Freelancer habit worth keeping: retain the untouched contract offline, lighten a share copy for the workgroup, and never overwrite the only master with a messenger-optimized export. Channel admins dropping weekly briefs should treat the same two-copy rule — Telegram is a courier, not your records vault.</p>
<p>When a client still claims the packet “will not open,” ask whether they received a Files item or a media collage. Resend via Files and the microtext usually returns without another brutal quality crush. Behavioral routing beats endless re-encoding loops.</p>
<p>Secret conversations add encryption after you transfer — they do not excuse parking the original on a public shrink host first. Lighten here, then attach inside the secret thread yourself. No bot bridge exists on this page; you alone decide the destination chat.</p>`,
    faqH2: 'Telegram Files-tray PDF questions',
    faq: [
      {
        q: 'How do I lighten a PDF before a Telegram Files send?',
        a: 'Use this page until you land near or under about 20 MB, save it, then in Telegram choose Files — never the Gallery / media album path.',
      },
      {
        q: 'Why does my Telegram PDF look smeared for the client?',
        a: 'It likely traveled through Gallery. Resend the lightened PDF via the Files tray so Telegram stops recompressing sheets as snapshots.',
      },
      {
        q: 'Telegram advertises huge payloads — why aim near 20 MB?',
        a: 'Huge payloads can succeed on the wire and still fail for commute LTE readers. Twenty megabytes is a field band aimed at fewer abandoned progress bars.',
      },
      {
        q: 'Can I lighten first, then attach inside a Secret Chat?',
        a: 'Yes. Pare mass locally here, then attach in the Secret Chat. We never see the payload; Telegram’s secret path applies only after your client upload.',
      },
      {
        q: 'Does this page push my PDF into Telegram bots automatically?',
        a: 'No. There is no bot bridge. You save locally, then pick the destination chat yourself.',
      },
    ],
  },

  'compress-pdf-for-google-drive': {
    securityH2: 'Trim Drive PDFs in the browser before you upload',
    securityHtml: `<p>Google Drive can hold large files, but colleagues still hate waiting on a 200 MB scan. Shrink with a milder preset here first — everything runs in your browser; VeloTools never stores the PDF; Drive only receives the upload you choose later.</p>
<p>Shared drives full of contracts should not detour through a public compressor just to save quota and sync time.</p>
<p>Local compression keeps sensitive packets off unknown SaaS while you prepare a Drive-friendly copy.</p>`,
    problemH2: 'Drive accepts 100 MB — sync and preview still suffer',
    problemHtml: `<p>Drive’s everyday comfort zone for office PDFs often sits near <strong>100 MB</strong> before previews lag, mobile sync crawls, and “storage almost full” warnings appear. The formal ceiling is higher; the practical pain arrives earlier.</p>
<p>People upload pristine print masters into shared folders meant for reading on phones. A milder compress — lighter than LMS grayscale modes — cuts sync weight while keeping color diagrams intact.</p>
<p>This URL is not for crushing homework to 5 MB. It is for making Drive libraries feel fast without destroying fidelity.</p>`,
    stepsH2: 'Prepare a lighter PDF before a Google Drive upload',
    steps: [
      'Drop the bulky PDF destined for Drive — a milder ~100 MB practical check guides this cloud-friendly URL.',
      'Compress All until the file feels reasonable for sync and preview, then download the lighter copy.',
      'Upload to Google Drive yourself. Keep the original offline if you still need a print master later.',
    ],
    specsH2: 'Google Drive friendly compress profile',
    specs: [
      ['Problem it solves', 'Drive PDF too heavy to sync / preview slowly'],
      ['Practical guidance', '~100 MB milder office target'],
      ['Preset', 'Milder than email/LMS crush modes'],
      ['Color', 'Kept for diagrams and brand decks'],
      ['Privacy', 'Browser-only before your Drive upload'],
      ['Keep originals', 'Yes — do not overwrite print masters'],
    ],
    presetH2: 'Milder preset for Drive, not Canvas-level crush',
    presetHtml: `<p>We avoid forced grayscale and ultra-low Screen quality. Drive readers expect color slides and readable contracts; the goal is trimming waste, not surviving a 5 MB LMS gate.</p>
<p>If you also need to email the same file, run a second pass on the Gmail URL after the Drive copy is saved — one preset rarely serves both jobs perfectly.</p>`,
    deepH2: 'Why Drive mode stays milder than email compress pages',
    deepHtml: `<p>Drive can store far more than <strong>100 MB</strong>, yet shared folders full of 150–300 MB scans make mobile apps crawl. This page aims at a milder office target so previews open without the harsh grayscale used for <a href="/compress-pdf-for-canvas/">Canvas</a>.</p>
<p>Need attachment-sized output instead? Switch to <a href="/compress-pdf-for-gmail/">Gmail (25 MB)</a> or <a href="/compress-pdf-for-outlook/">Outlook (20 MB)</a>. For Dropbox-style sharing compare <a href="/compress-pdf-for-dropbox/">Compress PDF for Dropbox</a>.</p>
<p>Chapter archives with <a href="/split-pdf/">Split PDF</a>, refine on <a href="/compress-pdf/">Compress PDF</a>, and find related utilities under <a href="/pdf-tools/">PDF tools</a>.</p>
<p>After downloading, upload only into your Google account — compression never logged into Drive for you.</p>`,
    faqH2: 'Google Drive PDF size and sync FAQ',
    faq: [
      {
        q: 'Do I need to compress a PDF before uploading to Google Drive?',
        a: 'Not always, but files near or above 100 MB sync and preview slowly on phones. A milder local compress makes shared Drive folders feel faster.',
      },
      {
        q: 'Will Drive still show a preview after I compress?',
        a: 'Yes. You get a normal PDF. Very heavy scans may become page images, so text search can weaken — keep a text original when search matters.',
      },
      {
        q: 'Does this tool upload into my Drive automatically?',
        a: 'No. Compression is local. You upload the download to Drive yourself.',
      },
      {
        q: 'Can I replace the Drive file without losing share links?',
        a: 'In Drive, use Manage versions / replace on the existing item when possible so the link stays stable. This page only creates the smaller local file.',
      },
      {
        q: 'Is Drive better than attaching in Gmail?',
        a: 'For huge packets, yes — links dodge the 25 MB attachment cap. Compressing still helps recipients who download the file later on mobile data.',
      },
    ],
  },

  'compress-pdf-for-dropbox': {
    securityH2: 'Shrink for Dropbox sharing without a compress middleman',
    securityHtml: `<p>Dropbox link sharing is only as kind as the file behind it. Prepare a lighter PDF in your browser first — VeloTools never hosts the document; Dropbox only receives the upload you perform afterward.</p>
<p>Client folders full of marked-up contracts should not visit a public compressor on the way to Dropbox.</p>
<p>Local processing keeps the chain short: compress on device, then upload under your Dropbox account policies.</p>`,
    problemH2: 'Dropbox links that time out on mobile downloads',
    problemHtml: `<p>Dropbox can store large files, but shared links past roughly <strong>50 MB</strong> of dense PDF routinely frustrate phone users: slow progress bars, canceled downloads, and “just email it” replies.</p>
<p>Teams respond by posting multiple screenshot images instead of one PDF — worse for versioning. A practical ~50 MB compress keeps a single document while respecting how Dropbox sharing is actually used on cellular networks.</p>
<p>If you only share with desktop fiber users, you can stay larger; this URL targets the mixed audience case where phones and laptops both open the same shared link.</p>`,
    stepsH2: 'Make a Dropbox-shared PDF download-friendly',
    steps: [
      'Drop the PDF you plan to share via Dropbox — the ~50 MB practical guidance is locked on this page.',
      'Compress All until the size feels safe for mobile link downloads, then save the lighter copy locally.',
      'Upload to Dropbox and share the link. Keep the print master offline if quality still matters later.',
    ],
    specsH2: 'Dropbox sharing compress profile',
    specs: [
      ['Problem it solves', 'Dropbox shared PDF too slow to download'],
      ['Practical check', '~50 MB for comfortable link downloads'],
      ['Preset', 'Balanced office quality, color kept'],
      ['Privacy', 'Browser-only before Dropbox upload'],
      ['Link tip', 'Replace-in-place when possible to keep URLs'],
      ['Compare', 'Drive mode milder near ~100 MB'],
    ],
    presetH2: 'Balanced office quality for Dropbox links',
    presetHtml: `<p>We aim between harsh LMS Screen modes and untouched print masters: enough re-encode to clear the ~50 MB practical line without gray-forcing diagrams. Metadata bloat is removed; annotations may be stripped when they only add weight.</p>
<p>For Gmail-sized needs after Dropbox hosting, run a second pass on the Gmail page — do not expect one file to be both a 50 MB share and a 25 MB attachment forever.</p>`,
    deepH2: 'Dropbox at ~50 MB practical vs Drive’s milder ~100 MB feel',
    deepHtml: `<p>Dropbox sharing often feels painful past about <strong>50 MB</strong> of PDF on phones, even when the account can store more. That is a tighter human target than <a href="/compress-pdf-for-google-drive/">Google Drive’s milder ~100 MB guidance</a> on this site.</p>
<p>Emailing the same packet? Use <a href="/compress-pdf-for-gmail/">Gmail</a> or <a href="/compress-pdf-for-outlook/">Outlook</a> with their stricter attachment ceilings. Huge binders should hit <a href="/split-pdf/">Split PDF</a> before a refine on <a href="/compress-pdf/">Compress PDF</a>.</p>
<p>More utilities are listed under <a href="/pdf-tools/">PDF tools</a>. After you download, only your Dropbox client performs the cloud upload.</p>`,
    faqH2: 'Dropbox PDF sharing size FAQ',
    faq: [
      {
        q: 'How small should a PDF be for a Dropbox shared link?',
        a: 'Aim near or under about 50 MB for comfortable mobile downloads. Larger can work on Wi-Fi and still fail for phone users.',
      },
      {
        q: 'Does compressing here put my file into Dropbox for me?',
        a: 'No. The shrink is local. You upload the result to Dropbox yourself.',
      },
      {
        q: 'Will comment markups survive the compress?',
        a: 'Visible page content stays. Some annotation streams are stripped to save space — keep a marked-up original if review bubbles are critical.',
      },
      {
        q: 'Can I keep the same Dropbox link after replacing the file?',
        a: 'Yes if you replace the file in place inside Dropbox. This page only creates the smaller local PDF.',
      },
      {
        q: 'Is WeTransfer better for huge one-off sends?',
        a: 'For multi-hundred-megabyte one-shots, WeTransfer can be easier. For ongoing folders, Dropbox plus a ~50 MB practical compress is usually cleaner.',
      },
    ],
  },

  'compress-pdf-for-notion': {
    securityH2: 'Notion embeds without uploading drafts to a compress site',
    securityHtml: `<p>Notion pages bog down when someone embeds a 40 MB scan. Shrink the PDF in your browser toward a practical <strong>~5 MB</strong> embed target first — VeloTools never receives the file; Notion only sees the upload you add later.</p>
<p>Internal wikis with HR and roadmap PDFs should skip public compress hosts on the way into a workspace.</p>
<p>Local compression keeps drafts private until you choose the Notion upload yourself.</p>`,
    problemH2: 'Why Notion PDF blocks feel stuck on “loading”',
    problemHtml: `<p>Notion can attach larger files, but embedded PDFs past roughly <strong>5 MB</strong> routinely stall in the editor preview, especially on laptops with many open pages. Teammates open the block, wait, and give up.</p>
<p>People then paste screenshots into the page — which destroys search and version clarity. A Canvas-adjacent practical ~5 MB compress keeps a real PDF embed that opens inside Notion without the harsh assumption that everything must be grayscale homework scans.</p>
<p>If your workspace only links out to Drive, you can stay larger; this URL is for in-page embeds and quick file blocks that teammates actually open during standup reviews.</p>`,
    stepsH2: 'Get a PDF light enough to embed in Notion',
    steps: [
      'Drop the PDF that hangs Notion’s embed preview — the ~5 MB practical embed check is locked here.',
      'Compress All until the size clears for in-page preview, then download the lighter file to disk.',
      'Upload or embed in Notion. Prefer Drive links only when the audience needs the full print master.',
    ],
    specsH2: 'Notion embed-oriented profile',
    specs: [
      ['Problem it solves', 'Notion PDF embed loading forever / too heavy'],
      ['Practical check', '~5 MB for comfortable in-page embeds'],
      ['Preset', 'Screen-leaning wiki quality'],
      ['Color', 'Kept when diagrams matter'],
      ['Privacy', 'Browser-only before Notion upload'],
      ['Alternative', 'Link out to Drive for full masters'],
    ],
    presetH2: 'Screen-leaning for Notion, not print archives',
    presetHtml: `<p>Wiki reading happens in a narrow column. We bias Screen-leaning quality so embeds open quickly, while trying to keep color diagrams usable — unlike Canvas mode, we do not assume every page is a gray worksheet photo.</p>
<p>Archive the print master elsewhere. Notion should hold the readable copy, not your only lossless export.</p>`,
    deepH2: 'Notion’s ~5 MB embed feel vs LMS and Drive targets',
    deepHtml: `<p>Notion embeds feel broken past about <strong>5 MB</strong> of dense PDF even when the workspace can store more. That practical number matches <a href="/compress-pdf-for-canvas/">Canvas’s 5 MB homework ceiling</a> in size, but the quality bias here stays wiki-friendly rather than forced grayscale-only.</p>
<p>Hosting the full master? Prefer <a href="/compress-pdf-for-google-drive/">Drive’s milder ~100 MB guidance</a> and link out. For chat shares see <a href="/compress-pdf-for-slack/">Slack</a>.</p>
<p>Split long specs with <a href="/split-pdf/">Split PDF</a>, refine on <a href="/compress-pdf/">Compress PDF</a>, and browse <a href="/pdf-tools/">PDF tools</a> for cleanup before you embed.</p>`,
    faqH2: 'Notion PDF embed size questions',
    faq: [
      {
        q: 'Why is my PDF stuck loading inside Notion?',
        a: 'Embedded files over roughly 5 MB often stall the preview. Compress toward that practical size here, then re-upload or replace the block.',
      },
      {
        q: 'What is Notion’s maximum PDF upload size?',
        a: 'Notion’s formal limits can exceed 5 MB, but embeds feel usable near that practical target. This page optimizes for preview speed, not the marketing ceiling.',
      },
      {
        q: 'Does compressing upload my file into Notion automatically?',
        a: 'No. Everything runs locally. You add the download to Notion yourself.',
      },
      {
        q: 'Should I embed the PDF or just paste a Drive link?',
        a: 'Embed a compressed copy for quick reading. Link to Drive when people need the full-fidelity master.',
      },
      {
        q: 'Will Notion AI still summarize a compressed PDF?',
        a: 'If text remains selectable, summarization tools can still read it. Heavy scans that become page images may summarize poorly — keep a text original when AI search matters.',
      },
    ],
  },

  'compress-pdf-for-linkedin': {
    securityH2: 'Portfolio PDFs for LinkedIn without a public compress hop',
    securityHtml: `<p>Case-study PDFs and media kits going onto LinkedIn should be trimmed on your device first. Processing stays in the browser — VeloTools never hosts your portfolio — then you upload the lighter file to LinkedIn yourself.</p>
<p>Unreleased product shots inside a pitch PDF do not belong on a random compress website’s temporary storage.</p>
<p>Local shrink, local download, LinkedIn upload only when you choose.</p>`,
    problemH2: 'LinkedIn media that looks sharp but never finishes uploading',
    problemHtml: `<p>LinkedIn can accept large documents — formal ceilings often land near <strong>100 MB</strong> — yet recruiters on phones abandon downloads past a much smaller practical size. A milder compress keeps color brand pages intact while trimming export waste from InDesign and Figma PDF dumps.</p>
<p>People respond by posting ten image slides instead of one PDF, which fragments the story. One well-sized PDF still works better for “download my case study” CTAs.</p>
<p>This URL is intentionally milder than email crush modes: LinkedIn viewing is not a 25 MB Gmail attach, and it is not a 5 MB LMS panic.</p>`,
    stepsH2: 'Prepare a case-study PDF for LinkedIn upload',
    steps: [
      'Drop the portfolio or media-kit PDF — milder guidance near a 100 MB practical LinkedIn ceiling is locked here.',
      'Compress All until the file feels light enough for mobile recruiter downloads, then save it locally.',
      'Upload to LinkedIn yourself. Keep the print master if you still need press-quality pages later.',
    ],
    specsH2: 'LinkedIn document sharing profile',
    specs: [
      ['Problem it solves', 'LinkedIn PDF upload slow / portfolio too heavy'],
      ['Practical guidance', '~100 MB milder professional target'],
      ['Preset', 'Mild office/web quality, color kept'],
      ['Privacy', 'Browser-only before LinkedIn upload'],
      ['Brand tip', 'Check cover page at 100% zoom after'],
      ['Not for', 'Email — use Gmail/Outlook pages for attach caps'],
    ],
    presetH2: 'Milder brand-safe preset for LinkedIn portfolios',
    presetHtml: `<p>We avoid grayscale and ultra-low Screen quality that would muddy brand color. The goal is stripping export bloat and oversized embedded images while keeping a recruiter-friendly PDF.</p>
<p>If you also email the same deck, create a second, smaller pass on the Gmail URL — LinkedIn’s milder target is not the same as a 25 MB mailbox attach.</p>`,
    deepH2: 'LinkedIn’s roomy ~100 MB feel vs strict email caps',
    deepHtml: `<p>LinkedIn document uploads often tolerate up to about <strong>100 MB</strong>, similar in spirit to <a href="/compress-pdf-for-google-drive/">Drive’s milder guidance</a>, but recruiters still prefer leaner files. This page trims without the harshness of <a href="/compress-pdf-for-gmail/">Gmail’s 25 MB mode</a>.</p>
<p>Posting into chat instead? See <a href="/compress-pdf-for-slack/">Slack</a> or <a href="/compress-pdf-for-teams/">Teams</a>. Split multi-chapter portfolios with <a href="/split-pdf/">Split PDF</a>, then refine on <a href="/compress-pdf/">Compress PDF</a>.</p>
<p>More helpers live at <a href="/pdf-tools/">PDF tools</a>. After download, only LinkedIn receives the upload you initiate.</p>`,
    faqH2: 'LinkedIn PDF upload questions professionals ask',
    faq: [
      {
        q: 'What size PDF should I upload to LinkedIn?',
        a: 'Stay comfortably under about 100 MB, and smaller still if you expect phone downloads. This page uses a milder compress so brand pages stay in color.',
      },
      {
        q: 'Why does my LinkedIn document upload fail near the end?',
        a: 'Large exports with huge embedded images often time out. Compress locally here, then retry. Check your connection and LinkedIn’s current media limits too.',
      },
      {
        q: 'Will my brand colors look washed out after compressing?',
        a: 'This URL keeps color and avoids LMS-style grayscale. Spot-check the cover at 100% zoom; recompress milder on the main tool if a logo looks soft.',
      },
      {
        q: 'Does VeloTools publish the PDF to my LinkedIn profile?',
        a: 'No. There is no LinkedIn login here. You upload the finished file in LinkedIn yourself.',
      },
      {
        q: 'Can I use the same file for Gmail and LinkedIn?',
        a: 'You can, but Gmail’s 25 MB cap usually needs a stronger second pass. Keep a LinkedIn-mild copy and an email-sized copy when audiences differ.',
      },
    ],
  },

  'compress-pdf-for-zoom': {
    securityH2: 'Meeting handouts for Zoom without uploading to compress SaaS',
    securityHtml: `<p>Zoom chat and file shares during meetings should not require parking the deck on a public compressor first. Shrink locally toward a practical <strong>~20 MB</strong> handout size — formal ceilings can be far higher — then share in Zoom yourself. VeloTools never sees the PDF.</p>
<p>Unreleased roadmaps in a customer call deserve a short chain of custody: browser compress, local download, Zoom upload.</p>
<p>Close the tab when the meeting copy is ready. Nothing is retained on our servers because nothing was sent.</p>`,
    problemH2: 'Zoom’s huge formal limit vs what attendees can download live',
    problemHtml: `<p>Zoom documentation can cite very large file allowances — figures near <strong>512 MB</strong> appear in product materials — yet live meeting attendees on hotel Wi-Fi abandon anything past roughly <strong>20 MB</strong> of PDF.</p>
<p>Hosts paste the giant export into chat, nobody finishes the download, and the presenter screenshares blurry slides instead. A practical ~20 MB compress before the call fixes the human problem without pretending everyone has fiber.</p>
<p>Keep the 512 MB master offline if you need it; share the lean handout in Zoom.</p>`,
    stepsH2: 'Share a PDF in Zoom chat that people actually open',
    steps: [
      'Drop the meeting handout PDF — practical ~20 MB guidance sits under Zoom’s much larger formal ceiling.',
      'Compress All until the size is comfortable for live chat downloads during the call.',
      'Download, then upload in Zoom. Screenshare from the original if you still need pixel-perfect presenter view.',
    ],
    specsH2: 'Zoom meeting handout profile',
    specs: [
      ['Problem it solves', 'Zoom chat PDF too large for live attendees'],
      ['Formal ballpark', 'Up to ~512 MB cited in product limits'],
      ['Practical check', '~20 MB for live meeting downloads'],
      ['Preset', 'Email-like Web quality for handouts'],
      ['Privacy', 'Browser-only before Zoom share'],
      ['Presenter tip', 'Screenshare original; chat the lean copy'],
    ],
    presetH2: 'Handout Web quality under a 20 MB live-meeting target',
    presetHtml: `<p>We lock an email-like Web path so attendees can open the PDF on phones during the call. It is far gentler than LMS grayscale, and far stricter than uploading a 200 MB print export into chat just because Zoom “allows” it.</p>
<p>Presenter view can still use your local original via screenshare. Chat gets the downloadable handout — two jobs, two files.</p>`,
    deepH2: '512 MB on paper, ~20 MB in a live Zoom room',
    deepHtml: `<p>Zoom may advertise ceilings near <strong>512 MB</strong>, but live attendees behave like email users: past about <strong>20 MB</strong> downloads die mid-call. This page targets that practical handout size.</p>
<p>Compare <a href="/compress-pdf-for-outlook/">Outlook’s ~20 MB mailbox habit</a> and <a href="/compress-pdf-for-teams/">Teams’ ~25 MB chat feel</a>. For post-meeting archival hosting use <a href="/compress-pdf-for-google-drive/">Drive</a>.</p>
<p>Split appendix packs with <a href="/split-pdf/">Split PDF</a>, refine on <a href="/compress-pdf/">Compress PDF</a>, and see <a href="/pdf-tools/">PDF tools</a> for cleanup before the invite goes out.</p>`,
    faqH2: 'Zoom PDF sharing questions before meetings',
    faq: [
      {
        q: 'What size PDF should I share in Zoom chat?',
        a: 'Aim near or under about 20 MB so attendees on weak Wi-Fi can finish downloading during the call. Zoom may allow much more — practical limits are tighter.',
      },
      {
        q: 'Is Zoom’s file limit really around 512 MB?',
        a: 'Product materials cite very large allowances, but that does not mean attendees will download a half-gigabyte PDF live. Use this page for the practical handout.',
      },
      {
        q: 'Can I compress without uploading the deck to Zoom yet?',
        a: 'Yes. Compression is local. You only upload into Zoom when you are ready to share.',
      },
      {
        q: 'Should I screenshare or send the PDF?',
        a: 'Screenshare the sharp original for presenting. Send a compressed ~20 MB copy in chat for people who want to keep the file.',
      },
      {
        q: 'Does this integrate with Zoom Apps?',
        a: 'No. There is no Zoom login or app bridge — just a local PDF shrink and a download.',
      },
    ],
  },

  'compress-pdf-for-wetransfer': {
    securityH2: 'Prep WeTransfer sends without a second compress upload',
    securityHtml: `<p>WeTransfer already moves the file once. Do not upload the same PDF to a random compressor beforehand. Shrink in your browser toward a practical <strong>~25 MB</strong> email-like experience when recipients will re-download on phones — then send via WeTransfer yourself. VeloTools never hosts the payload.</p>
<p>Legal productions and design drops stay on your machine during compression.</p>
<p>Local first, WeTransfer second: one intentional cloud hop, not two.</p>`,
    problemH2: 'WeTransfer’s 2 GB room vs recipients who hate huge PDFs',
    problemHtml: `<p>WeTransfer’s free tier can move on the order of <strong>2 GB</strong>, which tempts people to send untouched 400 MB scans. Recipients then fail on mobile data and ask for “a smaller version” two days later.</p>
<p>A practical ~25 MB compress — Gmail-adjacent — is often the right courtesy copy even when WeTransfer would accept more. Keep the giant master for archive; send the lean PDF for reading on the go.</p>
<p>If you truly must send hundreds of megabytes of raw scans, WeTransfer is fine — just do not expect phone users on cellular data to celebrate the wait.</p>`,
    stepsH2: 'Create a WeTransfer-friendly PDF before you send',
    steps: [
      'Drop the oversized PDF — practical ~25 MB guidance helps even though WeTransfer allows up to ~2 GB.',
      'Compress All until the courtesy copy is easy to re-download on phones, then save it locally.',
      'Upload that lighter file to WeTransfer. Keep the full master only when the recipient explicitly needs it.',
    ],
    specsH2: 'WeTransfer courtesy-copy profile',
    specs: [
      ['Problem it solves', 'WeTransfer PDF too huge for recipients on mobile'],
      ['Formal ballpark', 'Up to ~2 GB on common free sends'],
      ['Practical check', '~25 MB courtesy reading copy'],
      ['Preset', 'Email-like Web quality'],
      ['Privacy', 'Browser-only before WeTransfer upload'],
      ['Strategy', 'Master offline · lean copy in the transfer'],
    ],
    presetH2: 'Email-like courtesy quality under a 25 MB practical line',
    presetHtml: `<p>We mirror Gmail-adjacent Web quality so the WeTransfer download feels like a normal attachment people can open quickly. It is not trying to preserve press-ready CMYK masters inside a free transfer.</p>
<p>When the recipient needs the master, send two transfers or a Drive link for the archive file — do not force one compromise file to be both things.</p>`,
    deepH2: '2 GB WeTransfer capacity, ~25 MB human patience',
    deepHtml: `<p>WeTransfer’s roughly <strong>2 GB</strong> free-style capacity solves uploading; it does not invent patience for a 400 MB PDF on LTE. This page builds a <strong>~25 MB</strong> courtesy copy similar in spirit to <a href="/compress-pdf-for-gmail/">Gmail’s attachment world</a>.</p>
<p>Ongoing folders may fit <a href="/compress-pdf-for-dropbox/">Dropbox</a> or <a href="/compress-pdf-for-google-drive/">Drive</a> better than one-shot transfers. Split giant packs with <a href="/split-pdf/">Split PDF</a> and refine on <a href="/compress-pdf/">Compress PDF</a>.</p>
<p>See <a href="/pdf-tools/">PDF tools</a> for related utilities. After you download, only WeTransfer performs the cloud send you start.</p>`,
    faqH2: 'WeTransfer PDF size FAQ',
    faq: [
      {
        q: 'Should I compress a PDF before sending it with WeTransfer?',
        a: 'If recipients will read on phones, yes — aim near 25 MB even though WeTransfer may allow up to about 2 GB. Keep the master for archive when needed.',
      },
      {
        q: 'Does this upload my file to WeTransfer for me?',
        a: 'No. Compression is local. You upload the download to WeTransfer yourself.',
      },
      {
        q: 'Can I send the full 500 MB master and a small copy?',
        a: 'Yes. Use two transfers or host the master on Drive/Dropbox and WeTransfer only the lean reading copy.',
      },
      {
        q: 'Will WeTransfer expire affect the compressed file?',
        a: 'Expiration follows WeTransfer’s rules for whatever you uploaded. Compression does not change link expiry — it only changes the local file size before you send.',
      },
      {
        q: 'Is WeTransfer more private than a free online compressor?',
        a: 'You still choose a cloud hop with WeTransfer. The point of this page is avoiding a second, unknown compress host before that hop.',
      },
    ],
  },

  'compress-pdf-for-github': {
    securityH2: 'Repo PDFs stay on your machine while you shrink them',
    securityHtml: `<p>Design specs and scanned notes headed for GitHub should clear the common <strong>25 MB</strong> file warning locally first. Compression runs in your browser only — VeloTools never hosts the PDF; GitHub only receives the commit or release asset you push later.</p>
<p>Internal architecture diagrams do not need a public compress SaaS in the supply chain.</p>
<p>Shrink locally, review the diff size, then add the file to your repo or release yourself.</p>`,
    problemH2: 'GitHub’s 25 MB warning and repos that should not store scans',
    problemHtml: `<p>GitHub warns and blocks oversized blobs around <strong>25 MB</strong> for normal files in repositories. People still try to commit 80 MB PDF exports from design tools, then fight LFS setup at midnight.</p>
<p>Often the better fix is not LFS — it is a leaner PDF plus linking out to Drive for the print master. A Gmail-adjacent 25 MB compress makes the “small enough to commit” path real when documentation truly belongs in the repo.</p>
<p>Binary PDFs still bloat clones; compress first, and ask whether the file should be in git at all.</p>`,
    stepsH2: 'Get a PDF under GitHub’s 25 MB file comfort zone',
    steps: [
      'Drop the PDF that GitHub rejected or warned about — the 25 MB checker matches common repo limits here.',
      'Compress All until you are under 25 MB, then save the file where your project expects documentation assets.',
      'Add or commit in Git yourself. Prefer Git LFS or external hosting if the master must stay huge.',
    ],
    specsH2: 'GitHub documentation PDF profile',
    specs: [
      ['Problem it solves', 'GitHub file over 25 MB / push rejected'],
      ['Size check', '25 MB common repository file warning'],
      ['Preset', 'Email-like Web quality for docs'],
      ['Privacy', 'Browser-only before your git push'],
      ['Repo hygiene', 'Avoid committing print masters'],
      ['Alternative', 'LFS or Drive link for huge binaries'],
    ],
    presetH2: 'Docs-oriented Web quality under GitHub’s 25 MB line',
    presetHtml: `<p>We use an email-like Web preset so README-linked PDFs stay readable without preserving press DPI inside git. Metadata bloat goes away; color diagrams remain when possible.</p>
<p>If the file is a build artifact, consider releasing it on a Releases page or external storage instead of committing it — compression helps, architecture helps more.</p>`,
    deepH2: 'GitHub at 25 MB vs email and chat compress siblings',
    deepHtml: `<p>GitHub’s everyday file warning near <strong>25 MB</strong> aligns numerically with <a href="/compress-pdf-for-gmail/">Gmail</a> and <a href="/compress-pdf-for-teams/">Teams</a>, but the goal differs: smaller clones and fewer LFS emergencies, not mailbox Send buttons.</p>
<p>For design handoff outside git, prefer <a href="/compress-pdf-for-google-drive/">Drive</a> or <a href="/compress-pdf-for-dropbox/">Dropbox</a>. Split long appendices with <a href="/split-pdf/">Split PDF</a>, refine on <a href="/compress-pdf/">Compress PDF</a>, and browse <a href="/pdf-tools/">PDF tools</a>.</p>
<p>After download, only your git client / GitHub upload path moves the bytes — this page never authenticates to GitHub.</p>`,
    faqH2: 'GitHub PDF file size questions for docs',
    faq: [
      {
        q: 'Why does GitHub say my PDF is too large?',
        a: 'Normal repository files warn and block around 25 MB. Compress here, use Git LFS, or host the large master outside the repo.',
      },
      {
        q: 'Should documentation PDFs live in git at all?',
        a: 'Short, lean PDFs can. Huge scans usually belong in Drive/Dropbox with a link from the README. Compressing makes the “small enough” path possible when you truly need the file in-repo.',
      },
      {
        q: 'Does this tool open a pull request for me?',
        a: 'No. There is no GitHub login. You add the compressed file and commit yourself.',
      },
      {
        q: 'Will compressing break PDF links in my markdown?',
        a: 'Not if you replace the file at the same path. Update the path only if you rename the asset.',
      },
      {
        q: 'Is Git LFS better than compressing?',
        a: 'LFS helps when the binary must stay huge. Compressing is better when readers only need a lean doc and you want to avoid LFS complexity.',
      },
    ],
  },

  'compress-pdf-for-icloud-mail': {
    securityH2: 'Shrink for iCloud Mail without uploading to a compress site',
    securityHtml: `<p>iCloud Mail attachment failures should not send you to a random web compressor with your passport scan. Shrink locally toward the common <strong>20 MB</strong> ceiling — processing stays in Safari or Chrome on your device — then attach in Mail yourself. VeloTools never receives the PDF.</p>
<p>Apple IDs already guard the mailbox; adding another upload hop for compression is unnecessary risk.</p>
<p>Browser-only compress, local download, iCloud Mail attach when you choose.</p>`,
    problemH2: 'iCloud Mail’s 20 MB wall on iPhone and Mac',
    problemHtml: `<p>iCloud Mail commonly refuses attachments past roughly <strong>20 MB</strong> — in the same neighborhood as Outlook’s consumer habit, tighter than Gmail’s everyday 25 MB. iPhone camera scans of multi-page forms trip it constantly.</p>
<p>Mail Drop / iCloud links can bypass the attach cap, but recipients outside Apple’s ecosystem sometimes struggle. A compressed attached PDF remains the most compatible path when the other person expects a simple file.</p>
<p>This URL keeps color for forms and tickets while aiming under that 20 MB warning before you hit Send.</p>`,
    stepsH2: 'Fix iCloud Mail “attachment too large” on Apple devices',
    steps: [
      'Drop the PDF Mail refused — the 20 MB iCloud-oriented checker is already locked on this page.',
      'Compress All until the size status shows under 20 MB, then download to Files or your Mac disk.',
      'Attach in iCloud Mail or the Mail app. Still blocked? Split pages or use Mail Drop only if the recipient can open the link.',
    ],
    specsH2: 'iCloud Mail attachment profile',
    specs: [
      ['Problem it solves', 'iCloud Mail attachment too large / over 20 MB'],
      ['Size check', '20 MB common iCloud Mail ceiling'],
      ['Preset', 'Email Web quality, color kept'],
      ['Privacy', 'Browser-only before Mail attach'],
      ['Compare', 'Gmail ~25 MB · Outlook ~20 MB'],
      ['iOS tip', 'Save download to Files, then attach'],
    ],
    presetH2: 'Email Web preset aligned with iCloud’s 20 MB cap',
    presetHtml: `<p>We lock a Web-quality email path similar in spirit to Outlook mode: enough compression to clear 20 MB while keeping tickets and form color readable on iPhone Mail preview.</p>
<p>Mail Drop remains an escape hatch for true giants, but a compressed attach is still better when the recipient just wants a PDF in their inbox.</p>`,
    deepH2: 'iCloud Mail at 20 MB vs Gmail and Outlook siblings',
    deepHtml: `<p>iCloud Mail’s everyday attachment ceiling near <strong>20 MB</strong> matches <a href="/compress-pdf-for-outlook/">Outlook’s common consumer cap</a> and sits under <a href="/compress-pdf-for-gmail/">Gmail’s ~25 MB</a>. That is why this preset is a bit firmer than Gmail mode while keeping color for Apple Mail previews.</p>
<p>Chat sharing instead? See <a href="/compress-pdf-for-whatsapp/">WhatsApp</a> or <a href="/compress-pdf-for-telegram/">Telegram</a>. Split long packets with <a href="/split-pdf/">Split PDF</a>, refine on <a href="/compress-pdf/">Compress PDF</a>, and browse <a href="/pdf-tools/">PDF tools</a>.</p>
<p>After you download, only Mail / iCloud performs the send — this page never signs into your Apple ID.</p>`,
    faqH2: 'iCloud Mail PDF attachment FAQ',
    faq: [
      {
        q: 'Why won’t iCloud Mail send my PDF?',
        a: 'Most often the attachment is over about 20 MB. Compress it here, then attach again. Mail Drop links are an alternative when both sides can open them.',
      },
      {
        q: 'Is iCloud Mail’s limit smaller than Gmail’s?',
        a: 'For many accounts, yes — roughly 20 MB vs Gmail’s ~25 MB. Use this page for iCloud Mail and the Gmail page when sending from Gmail.',
      },
      {
        q: 'Can I compress a PDF on iPhone without uploading it?',
        a: 'Yes. Open this page in Safari, compress in the browser, save the download to Files, then attach in Mail. Nothing is sent to VeloTools.',
      },
      {
        q: 'Should I use Mail Drop instead of compressing?',
        a: 'Mail Drop helps for huge files, but some recipients struggle with the link. Compressing is better when they expect a normal attached PDF.',
      },
      {
        q: 'Do you need my Apple ID to compress?',
        a: 'No. There is no Apple login. You only attach the finished PDF in Mail yourself.',
      },
    ],
  },

  'compress-pdf-for-yahoo-mail': {
    "securityH2": "Trim a Yahoo Mail PDF entirely on your own device",
    "securityHtml": "<p>Yahoo Mail throws a “message too large” banner at the worst moment, and the reflex is to paste the file into whatever compressor the search engine surfaces first. That reflex hands a tax return or a signed lease to a stranger. This page removes the stranger: the browser reads the PDF, applies a locked email Web preset, and hands you a smaller file to attach.</p>\n<p>Because the re-encode happens in tab memory, VeloTools never receives a single byte. The working copy exists only while the tab is open, which is the same Zero-Backend promise behind the rest of our PDF suite.</p>\n<p>Once the size gauge turns green, switch to Yahoo Mail and attach the download yourself. Compression already finished on your machine, so Yahoo only ever handles the copy you deliberately choose to send.</p>",
    "problemH2": "What actually pushes a Yahoo attachment past the wall",
    "problemHtml": "<p>Consumer Yahoo Mail behaves like a roughly <strong>25 MB</strong> total-message budget rather than a clean per-file cap. The quoted reply chain, inline logos, and your PDF all draw from the same pool, so a document that measures “only 22 MB” can still bounce once the thread carries a few earlier messages.</p>\n<p>The heavy files are almost always camera exports and slide decks. Twelve-megapixel phone photos of a multi-page form, saved at full colour and high DPI, balloon far beyond what the page count suggests, and a PowerPoint-to-PDF conversion drags embedded raster images along for the ride.</p>\n<p>This URL is tuned for that specific dead end: land comfortably under a practical 25 MB line while keeping the pages legible in Yahoo’s own preview on an older phone.</p>",
    "stepsH2": "Clearing a Yahoo Mail “attachment too large” bounce",
    "steps": [
      "Drop in the PDF that Yahoo refused; the Web preset at 96 DPI and 61% JPEG is already locked so you do not touch a single slider.",
      "Press Compress All and wait for the on-screen gauge to confirm you are under the 25 MB mark before you save anything.",
      "Download the result, reopen Yahoo Mail, and attach it manually; if the thread is still heavy, trim quoted history or split the packet."
    ],
    "specsH2": "What the Yahoo Mail preset pins down for you",
    "specs": [
      [
        "Problem it solves",
        "Yahoo Mail message / attachment too large"
      ],
      [
        "Size check",
        "25 MB before download"
      ],
      [
        "Preset",
        "Web · 96 DPI · 61% JPEG"
      ],
      [
        "Colour",
        "Kept for contracts, tickets, and slides"
      ],
      [
        "Privacy",
        "No upload to VeloTools"
      ],
      [
        "Related tools",
        "Gmail sibling · Split PDF"
      ]
    ],
    "presetH2": "Reasoning behind Yahoo’s gentle Web quality target",
    "presetHtml": "<p>Yahoo’s ceiling lives in the same class as Gmail’s, so there is no reason to reach for the brutal grayscale Screen crush that a 5 MB course portal demands. A Web path near 96 DPI keeps body copy sharp inside Yahoo’s reader while shedding the export bulk that never needed to travel.</p>\n<p>Metadata that only pads the file is discarded, and the JPEG quality is set at 61 rather than something lower because Yahoo previews on ageing Android mail apps expose compression ringing on scanned text. If one pass is not enough, split the document before you crank the quality down and wreck readability.</p>",
    "deepH2": "Choosing between Yahoo, Gmail, and an Apple mailbox",
    "deepHtml": "<p>Yahoo’s failure mode resembles Gmail’s classic ceiling, yet quoted HTML in a long reply chain quietly steals headroom you assumed was free. Leaving a little margin under the gauge is the difference between a clean Send and a second bounce.</p>\n<p>Set against <a href=\"/compress-pdf-for-gmail/\">the Gmail 25 MB page</a>, this URL runs a marginally firmer JPEG quality because Yahoo’s mobile preview forgives less artefacting on dense scans. When your recipient lives in Apple’s world instead, hand the job to <a href=\"/compress-pdf-for-onedrive/\">the OneDrive mail-path checker</a> only if the file is destined for a cloud link; for a private Proton inbox, use <a href=\"/compress-pdf-for-proton-mail/\">the Proton Mail page</a>.</p>\n<p>When a single packet stays stubborn, break it apart with <a href=\"/split-pdf/\">Split PDF</a> and send two lighter messages, or run one careful pass on <a href=\"/compress-pdf/\">Compress PDF</a> with a stronger preset.</p>\n<p>Everything else — merge, reorder, unlock — is catalogued under <a href=\"/pdf-tools/\">PDF tools</a> once the Yahoo send finally clears.</p>",
    "faqH2": "Yahoo Mail PDF size questions people search",
    "faq": [
      {
        "q": "Why does Yahoo Mail claim my PDF is too large to send?",
        "a": "Consumer accounts fail near a 25 MB total-message budget. The reply body and every attachment share that pool, so a PDF that looks almost fine still blocks Send when the thread is long."
      },
      {
        "q": "Can I shrink a PDF for Yahoo without a website seeing it?",
        "a": "Yes. This page re-encodes in your browser only. You download the smaller file and attach it inside Yahoo yourself, so nothing reaches VeloTools."
      },
      {
        "q": "Will my recipient still be able to read the compressed pages?",
        "a": "You receive a standard PDF that opens in Yahoo preview and desktop readers. Very heavy scans become page images, so selectable text may weaken."
      },
      {
        "q": "What should I try if the file is still above 25 MB?",
        "a": "Split the packet, delete unused photo pages, or run a firmer Screen pass on the main Compress PDF tool. One full-bleed image page is usually the culprit."
      },
      {
        "q": "Is a shared Drive link better than compressing for Yahoo?",
        "a": "A link dodges the attachment budget but only helps when the recipient can open the folder. Compression wins whenever they expect a plain attached file."
      }
    ]
  },

  'compress-pdf-for-proton-mail': {
    "securityH2": "Keep the compress step private before Proton takes over",
    "securityHtml": "<p>Proton Mail encrypts a message on its own infrastructure after you attach, which is excellent — right up until you realise you fed the same PDF to a public “free compressor” minutes earlier. That first upload quietly creates a processor who was never supposed to touch the exhibit. This page deletes that hop entirely.</p>\n<p>Signed agreements, medical letters, and evidence bundles are re-encoded in tab memory and never transit our servers. You download the trimmed copy, then attach it inside Proton like any other file.</p>\n<p>Annotations remain switched on by default so counsel comments and redline notes survive the shrink. Close the tab afterwards and there is nothing on our side to close.</p>",
    "problemH2": "Encrypted mail still runs into hard attachment physics",
    "problemHtml": "<p>Encryption does not repeal file-size reality. Free and many Plus workflows still feel a practical <strong>25 MB</strong> comfort zone for everyday attachments, so a dense scanned exhibit will refuse to attach no matter how private the mailbox is.</p>\n<p>Faced with that, privacy-conscious users often defeat their own choice by pasting the document into a random compress host — the exact behaviour Proton was chosen to avoid. A local Web preset with a live gauge keeps the whole chain on the device.</p>\n<p>This page exists to resolve that contradiction: privacy-preserving compression feeding a privacy-preserving inbox, with no third party in the middle.</p>",
    "stepsH2": "Attaching a lighter exhibit inside Proton Mail",
    "steps": [
      "Add the oversized PDF; the Web preset at 59% JPEG with annotations preserved is already locked for review-heavy sends.",
      "Run Compress All until the 25 MB gauge clears, then download the trimmed exhibit to your own disk.",
      "Attach the download in Proton Mail, and for genuine archives reach for a Proton Drive share instead of forcing one giant attachment."
    ],
    "specsH2": "Proton-oriented locks on this compress page",
    "specs": [
      [
        "Problem it solves",
        "Proton attachment too large / privacy-safe shrink"
      ],
      [
        "Size check",
        "25 MB before download"
      ],
      [
        "Preset",
        "Web · 96 DPI · 59% JPEG"
      ],
      [
        "Annotations",
        "Preserved for counsel markup"
      ],
      [
        "Privacy",
        "Local only before the Proton attach"
      ],
      [
        "Related tools",
        "Yahoo Mail · Box"
      ]
    ],
    "presetH2": "Why the Proton profile refuses to strip comments",
    "presetHtml": "<p>Legal and security reviewers annotate before they send, so wiping comment streams by default would quietly destroy the point of the message. This profile keeps every annotation intact while still shedding the image bulk that inflates scanned bundles.</p>\n<p>The JPEG quality sits at 59, a touch firmer than a plain webmail target, because Proton correspondents tend to ship dense exhibit scans that need a little extra squeeze. It stops short of grayscale homework mode so seals and signatures stay convincing to a human reviewer.</p>",
    "deepH2": "Compression before attach versus encryption after attach",
    "deepHtml": "<p>Proton’s guarantees begin the instant a message leaves your client. Anything you did to the file beforehand — including a detour through an unknown compressor — sits outside that shield, which is why the shrink belongs on your own machine.</p>\n<p>Reach for <a href=\"/compress-pdf-for-yahoo-mail/\">the Yahoo Mail page</a> only when the destination is actually a Yahoo inbox, since its preview quirks differ from Proton’s. For enterprise reviewers who need a hosted copy after mail proves too tight, hand the bundle to <a href=\"/compress-pdf-for-box/\">the Box page</a> and keep annotations attached.</p>\n<p>Truly archival packets should stay untouched offline; send a Proton Drive link rather than grinding vector text into mush with repeated passes. When one exhibit alone is enormous, isolate it with <a href=\"/split-pdf/\">Split PDF</a> first.</p>\n<p>For a one-off manual quality tweak, the unlocked <a href=\"/compress-pdf/\">Compress PDF</a> hub and the wider <a href=\"/pdf-tools/\">PDF tools</a> catalogue cover the rest.</p>",
    "faqH2": "Proton Mail compression questions answered",
    "faq": [
      {
        "q": "Does this page upload my PDF before Proton encrypts anything?",
        "a": "No. The re-encode runs in your browser, and only you upload the finished exhibit into Proton Mail, so no outside processor ever sees it."
      },
      {
        "q": "Why does the Proton preset keep annotations instead of stripping them?",
        "a": "Reviewer markup is frequently the reason for the send. The profile trims image weight while leaving comment and redline streams untouched."
      },
      {
        "q": "What attachment size should I aim for with Proton?",
        "a": "Treat roughly 25 MB as a practical comfort zone for free and Plus workflows unless your specific plan documents a different hard limit."
      },
      {
        "q": "Can I force grayscale for monochrome scanned exhibits?",
        "a": "Switch to the main Compress PDF tool when the pages are pure monochrome and you need deeper savings than this colour-safe profile provides."
      },
      {
        "q": "Is Proton Drive a better route than compressing large bundles?",
        "a": "For multi-hundred-megabyte archives, yes. Compress here whenever the other side simply expects a normal attached PDF in their inbox."
      }
    ]
  },

  'compress-pdf-for-google-classroom': {
    "securityH2": "Submit to Classroom without a detour through a compress host",
    "securityHtml": "<p>A Google Classroom deadline is stressful enough without also trusting a graded worksheet to a random online shrinker. This page keeps the assignment on the student’s device: the browser rewrites the pages with a Screen grayscale preset, and the file goes straight from the download folder into Classroom.</p>\n<p>Handwritten homework, quiz photos, and lab notes never pass through our servers. They live in tab memory until the tab closes, which matters when a phone holds a child’s name on every page.</p>\n<p>Because Classroom rides on Drive-sized ceilings, the goal here is not a hard byte cap but openability: a copy light enough that the teacher’s phone actually renders it in the Classroom app instead of spinning.</p>",
    "problemH2": "Why Classroom homework opens slowly even when it uploads",
    "problemHtml": "<p>Classroom will happily accept a large Drive-backed file, so students rarely see a blunt “too large” error. The failure surfaces later, when a teacher grading on a phone taps a full-colour, high-DPI scan and watches it crawl toward a <strong>~15 MB</strong> practical wall before rendering.</p>\n<p>The camera is the villain again. A worksheet shot at twelve megapixels and left in colour is enormous relative to its information, and a stack of those pages turns one homework set into a sluggish download for everyone in the class.</p>\n<p>This URL assumes that quiet failure on purpose: grayscale plus a lower resolution so tonight’s submission opens quickly in the app, not so it survives as a print portfolio.</p>",
    "stepsH2": "Making a Classroom submission open on a teacher’s phone",
    "steps": [
      "Drop in the homework scan; Screen mode with grayscale is already locked because worksheet photos rarely need colour.",
      "Run Compress All and watch the gauge settle toward the practical ~15 MB openability target before you download.",
      "Submit the download in Classroom, and if it still drags, delete blank pages or split a long lab appendix into parts."
    ],
    "specsH2": "Classroom-oriented defaults on this URL",
    "specs": [
      [
        "Problem it solves",
        "Classroom PDF slow to open on phones"
      ],
      [
        "Practical target",
        "~15 MB for app openability"
      ],
      [
        "Preset",
        "Screen + grayscale · 72 DPI"
      ],
      [
        "Colour",
        "Dropped to cut worksheet-photo bulk"
      ],
      [
        "Privacy",
        "Local only — you submit to Classroom"
      ],
      [
        "Sibling pages",
        "Brightspace · Schoology · Canvas"
      ]
    ],
    "presetH2": "Why Classroom mode forces Screen plus grayscale",
    "presetHtml": "<p>Pencil homework reads perfectly well in gray, so forcing monochrome and a Screen DPI target removes the camera’s colour bloat while keeping strokes legible when a teacher zooms in to grade. The result is a file that renders almost instantly in the Classroom mobile app.</p>\n<p>If an instructor explicitly asked for colour figures and confirmed the class can handle larger files, this is the wrong page — reach for a milder colour preset elsewhere rather than fighting a phone-openability goal with rainbow scans.</p>",
    "deepH2": "Classroom sits on Drive ceilings but grades on phones",
    "deepHtml": "<p>The tension on this page is that Classroom inherits generous <strong>Drive</strong> storage limits while the actual reader is a teacher thumbing through submissions on a handset. Optimising for the app, not the marketing ceiling, is what keeps a grade queue moving.</p>\n<p>Other learning platforms enforce blunt caps instead, so match the URL to the system: <a href=\"/compress-pdf-for-brightspace/\">Brightspace’s ~10 MB page</a>, <a href=\"/compress-pdf-for-schoology/\">Schoology’s harsh ~5 MB page</a>, or the classic <a href=\"/compress-pdf-for-canvas/\">Canvas</a> route. Exam-style bubble scans belong on <a href=\"/compress-pdf-for-gradescope/\">the Gradescope page</a> where contrast is preserved.</p>\n<p>When a single lab report is enormous, break it up with <a href=\"/split-pdf/\">Split PDF</a> before submitting, or run one more pass on <a href=\"/compress-pdf/\">Compress PDF</a>.</p>\n<p>The rest of the classroom toolkit — reorder, merge, unlock — lives under <a href=\"/pdf-tools/\">PDF tools</a>.</p>",
    "faqH2": "Google Classroom PDF submission questions",
    "faq": [
      {
        "q": "Classroom accepted my PDF but the teacher says it will not open — why?",
        "a": "Classroom rides on Drive ceilings, so upload succeeds while a heavy colour scan still crawls on a grading phone. Compressing to the practical openability target fixes the render, not the upload."
      },
      {
        "q": "Will my teacher mind that the homework turned grayscale?",
        "a": "For handwritten worksheets, almost never. If the assignment needs colour diagrams, ask first and use a colour preset on a platform with room to spare."
      },
      {
        "q": "Does submitting here send my homework to VeloTools?",
        "a": "No. The shrink is entirely in your browser. Only you submit the finished file into Google Classroom afterward."
      },
      {
        "q": "Can I hand in several smaller PDFs instead of one big file?",
        "a": "If the assignment allows multiple attachments, split first and submit the parts. Otherwise keep one file light enough to open quickly."
      },
      {
        "q": "The scan looks faint after compressing — what now?",
        "a": "Zoom a sample page after download. If pencil is too light, recompress once at slightly higher quality on Compress PDF while watching the openability target."
      }
    ]
  },

  'compress-pdf-for-brightspace': {
    "securityH2": "Trim a Desire2Learn submission without a middleman shrink site",
    "securityHtml": "<p>Graded coursework belongs inside the Brightspace submission folder, never idling on some anonymous shrink site on the way there. This page rebuilds a lighter PDF entirely on the learner's own laptop, using a monochrome Screen profile calibrated for the <strong>10 MB</strong> dropbox ceiling most Desire2Learn courses publish.</p>\n<p>Handwritten tablet notes, inked worksheet layers, and camera captures stay in local memory throughout the pass. You save the trimmed copy and hand it to the D2L Assignments tool yourself.</p>\n<p>Because nothing transits our machines, a learner's marked pages never surface in an unfamiliar vendor log while you race whatever allowance the term happens to post.</p>",
    "problemH2": "Why a D2L folder bounces an inked worksheet",
    "problemHtml": "<p>Desire2Learn, the platform many campuses still call D2L, usually posts a <strong>10 MB</strong> submission ceiling that a site administrator can lift per course. That allowance runs roomier than the tightest district limits yet stays cramped for a colour capture stack dense with pen overlays.</p>\n<p>The silent bulk is almost always the digital-ink layer. Tablet pen strokes and handwriting overlays ride invisibly above already-plump page rasters, so a report that feels like a handful of pages refuses the folder on byte weight alone.</p>\n<p>Flattening to monochrome while discarding that ink layer is the manoeuvre that satisfies the size gauge, and it is precisely what this profile pins by default.</p>",
    "stepsH2": "When D2L flags your submission as over the ceiling",
    "steps": [
      "Drop the bounced PDF here; a monochrome Screen profile for inked coursework is already pinned on this Desire2Learn route.",
      "Press Compress All until the size gauge falls under 10 MB, then eyeball one page to confirm the handwriting stays legible.",
      "Send the saved copy into the Brightspace Assignments folder, and divide long appendices or re-check the course ceiling if a bounce repeats."
    ],
    "specsH2": "Desire2Learn submission profile at a glance",
    "specs": [
      [
        "Problem it solves",
        "Brightspace / D2L submission over the byte ceiling"
      ],
      [
        "Ceiling check",
        "10 MB common course allowance"
      ],
      [
        "Profile",
        "Monochrome Screen · 72 DPI downsample"
      ],
      [
        "Ink layer",
        "Handwriting overlay discarded to shed weight"
      ],
      [
        "Privacy",
        "Local trim → you post to Desire2Learn"
      ],
      [
        "Neighbouring routes",
        "Schoology · Gradescope"
      ]
    ],
    "presetH2": "Monochrome Screen suits D2L worksheets, not lab colour plates",
    "presetHtml": "<p>Nearly every bounced Brightspace worksheet reads perfectly in flat gray, so this profile drops colour and downsamples at a Screen DPI that drains the phone camera's colour budget. Handwriting overlays from pen apps are discarded so the copy stops lugging ink data it no longer references.</p>\n<p>A colour lab plate for a chemistry or design brief is a separate errand: confirm the course lifted its allowance, then choose a colour-keeping profile, because forcing spectrum diagrams through a 10 MB monochrome gauge is a losing battle over legibility.</p>",
    "deepH2": "Tight allowances, dense pen layers, and everyday D2L friction",
    "deepHtml": "<p>The chronic friction on Desire2Learn is the clash between a modest <strong>10 MB</strong> folder and coursework stuffed with tablet pen layers. Monochrome conversion plus ink discarding usually settles it in a single pass, which is why the profile pins both rather than leaving them to a slider.</p>\n<p>Pair the destination with its ceiling: <a href=\"/compress-pdf-for-schoology/\">Schoology's tighter ~5 MB route</a> for K-12 districts, <a href=\"/compress-pdf-for-google-classroom/\">the Classroom openability route</a> for phone grading, or the familiar <a href=\"/compress-pdf-for-canvas/\">Canvas</a> and <a href=\"/compress-pdf-for-blackboard/\">Blackboard</a> paths. Bubble-sheet exams that must retain contrast belong on <a href=\"/compress-pdf-for-gradescope/\">Gradescope</a>.</p>\n<p>Layered multi-part reports get friendlier once you slice them with <a href=\"/split-pdf/\">Split PDF</a>, then polish on <a href=\"/compress-pdf/\">Compress PDF</a> should one part still weigh heavy.</p>\n<p>Want the pages sequenced into the exact order a professor requested? Begin at <a href=\"/pdf-tools/\">PDF tools</a>.</p>",
    "faqH2": "Student questions about D2L submission limits",
    "faq": [
      {
        "q": "Desire2Learn says my PDF is over the maximum size — how do I clear it?",
        "a": "Trim it on this page, save, and retry the folder. When the assignment accepts several attachments, slice the PDF and post the parts separately instead."
      },
      {
        "q": "Is 10 MB the fixed D2L ceiling at every campus?",
        "a": "No. Each site administrator sets the allowance per course. Ten megabytes is the common real-world default this route targets, so open the assignment details for your exact figure."
      },
      {
        "q": "My tablet handwriting bloats the file — does this profile help?",
        "a": "Yes. It discards the digital-ink overlay and rebuilds pages in monochrome, which usually clears pen-driven bloat outright."
      },
      {
        "q": "Will Turnitin still analyse a trimmed capture?",
        "a": "Graders can still open and read it, though automated matching may find less selectable text after raster trimming. Ask whether a text-based source file is expected."
      },
      {
        "q": "Should I reach for the Gradescope route instead?",
        "a": "Only when you submit to Gradescope, which preserves exam contrast. This route is tuned for the looser ~10 MB Desire2Learn folder."
      }
    ]
  },

  'compress-pdf-for-schoology': {
    "securityH2": "Beat a Schoology district cap without uploading elsewhere first",
    "securityHtml": "<p>K-12 work carries a child’s name on every sheet, which is the last thing to feed to an unknown compress website. This page prepares a smaller PDF on the family device with a deliberately harsh grayscale Screen pass aimed at the tight <strong>5 MB</strong> ceilings many school districts push onto Schoology.</p>\n<p>Worksheet photos and permission forms are rewritten in tab memory and never reach our servers. The download goes straight into the Schoology assignment from your own device.</p>\n<p>That local-only path keeps student data out of third-party logs while still squeezing hard enough to clear a district’s stingy quota before the deadline banner appears.</p>",
    "problemH2": "Why a Schoology worksheet blows past five megabytes",
    "problemHtml": "<p>Schoology assignments frequently inherit a district-wide upload ceiling near <strong>5 MB</strong>, one of the tightest caps in mainstream education software. A single colour photo of a worksheet, shot at full phone resolution, can consume that entire quota by itself.</p>\n<p>Parents and students then ricochet between a red “file too large” banner and compress sites that demand an account just to try. The dependable answer is an aggressive local grayscale pass tuned for tonight’s submission rather than a keepsake print.</p>\n<p>This page assumes that stingy cap on purpose, forcing quality down far enough that a multi-page worksheet set still fits without a login or an outside upload.</p>",
    "stepsH2": "Squeezing a worksheet under the Schoology limit",
    "steps": [
      "Drop the rejected worksheet; a harsh grayscale Screen pass at 38% JPEG is already locked for tight district caps.",
      "Run Compress All until the gauge drops under 5 MB, then glance at a page to confirm the writing is still legible.",
      "Submit the download in Schoology, and photograph one page at a time or split the packet if it remains too large."
    ],
    "specsH2": "Schoology K-12 upload preset",
    "specs": [
      [
        "Problem it solves",
        "Schoology assignment over the district cap"
      ],
      [
        "Size check",
        "5 MB common district ceiling"
      ],
      [
        "Preset",
        "Harsh Screen + grayscale · 38% JPEG"
      ],
      [
        "Colour",
        "Forced off to survive the tiny cap"
      ],
      [
        "Privacy",
        "Local only — you submit to Schoology"
      ],
      [
        "Sibling pages",
        "Brightspace · Canvas"
      ]
    ],
    "presetH2": "Why Schoology mode squeezes harder than other schools",
    "presetHtml": "<p>A 5 MB gate leaves no room for politeness, so this profile drives JPEG quality down to 38 and locks grayscale outright. Handwriting stays readable for a teacher zooming in, which is the only fidelity a district worksheet actually needs.</p>\n<p>If a specific assignment genuinely requires a colour chart, that submission does not belong behind this harsh gate — confirm a larger allowance with the teacher and use a colour preset instead of blaming the scan when a diagram turns muddy.</p>",
    "deepH2": "District caps make Schoology the strictest school target",
    "deepHtml": "<p>Because districts, not Schoology itself, set the ceiling, the practical <strong>5 MB</strong> wall is both common and unforgiving. This page leans into that reality with the most aggressive education preset in the batch, trading colour and resolution for a submission that simply fits.</p>\n<p>Sister LMS pages ease off as their caps loosen: <a href=\"/compress-pdf-for-brightspace/\">Brightspace’s ~10 MB page</a> and the familiar <a href=\"/compress-pdf-for-canvas/\">Canvas</a> route both keep a little more quality. When a teacher grades on a phone rather than enforcing a byte cap, <a href=\"/compress-pdf-for-google-classroom/\">the Classroom openability page</a> is the better fit.</p>\n<p>A long worksheet set is easier to tame once you split it with <a href=\"/split-pdf/\">Split PDF</a>, then finish on <a href=\"/compress-pdf/\">Compress PDF</a> if one page is still stubborn.</p>\n<p>More classroom helpers, including page reordering, sit under <a href=\"/pdf-tools/\">PDF tools</a>.</p>",
    "faqH2": "Schoology upload questions parents ask",
    "faq": [
      {
        "q": "Schoology keeps rejecting my child’s worksheet for size — what fixes it fastest?",
        "a": "Compress on this page with the 5 MB gauge on, download, and resubmit. Full-resolution phone photos almost always fit after the harsh grayscale pass."
      },
      {
        "q": "Why is the Schoology limit so much smaller than other platforms?",
        "a": "The cap usually comes from the school district rather than Schoology, and many districts set it near 5 MB, the tightest common education ceiling."
      },
      {
        "q": "Does compressing here upload my child’s homework anywhere?",
        "a": "No. Everything runs in the browser, and only you submit the finished file into Schoology afterward."
      },
      {
        "q": "The writing looks rough after this squeeze — is that expected?",
        "a": "At 38% quality some softness is normal. If pencil is too faint, recompress once at slightly higher quality on Compress PDF while keeping under 5 MB."
      },
      {
        "q": "Can I submit two smaller files instead of one over-cap PDF?",
        "a": "If the assignment allows multiple attachments, split the worksheet and submit the parts. Otherwise keep a single file under the district cap."
      }
    ]
  },

  'compress-pdf-for-gradescope': {
    "securityH2": "Keep exam scans on your machine while they slim down",
    "securityHtml": "<p>Exam pages hold names, student IDs, and graded answers, so routing them through an anonymous compressor before Gradescope is a needless exposure. This page rewrites the scan in the browser with a Web grayscale preset aimed at a practical <strong>20 MB</strong> upload, and the file never leaves the device.</p>\n<p>Bubble sheets and handwritten proofs are processed in tab memory only. You download the result and upload it into Gradescope yourself, so no outside service ever holds the exam.</p>\n<p>Unlike a homework crush, this profile is careful to preserve the contrast that graders and autograders rely on, because a smudged answer box helps no one even when the file is small.</p>",
    "problemH2": "Multi-page exam scans that refuse to upload",
    "problemHtml": "<p>Gradescope accepts long, multi-page exam bundles, but a stack of full-resolution phone photos quickly climbs past a comfortable <strong>20 MB</strong>, and the upload stalls or times out on campus Wi-Fi. Every extra colour page makes it worse.</p>\n<p>The instinct to force a deep homework-style crush backfires here. Flatten the contrast too far and a shaded bubble or a faint pencil digit becomes ambiguous, which turns a size problem into a grading dispute.</p>\n<p>This URL threads that needle: grayscale to shed colour weight, but a Web-quality target that keeps ink and bubble edges crisp enough for both a human grader and Gradescope’s answer detection.</p>",
    "stepsH2": "Fitting an exam scan into Gradescope cleanly",
    "steps": [
      "Drop the multi-page exam scan; Web grayscale at 71% JPEG is locked to protect bubble and ink contrast.",
      "Run Compress All until the gauge lands near or under 20 MB while a sample answer box stays sharp.",
      "Upload the download to Gradescope, and rescan at lower phone resolution or split by question groups if it stalls."
    ],
    "specsH2": "Gradescope exam-scan preset",
    "specs": [
      [
        "Problem it solves",
        "Gradescope scan too large / upload stalls"
      ],
      [
        "Size check",
        "~20 MB practical target"
      ],
      [
        "Preset",
        "Web + grayscale · 96 DPI · 71% JPEG"
      ],
      [
        "Contrast",
        "Preserved for bubbles and handwriting"
      ],
      [
        "Privacy",
        "Local only — you upload to Gradescope"
      ],
      [
        "Sibling pages",
        "Schoology · Canvas"
      ]
    ],
    "presetH2": "Grayscale that still guards exam contrast",
    "presetHtml": "<p>Colour rarely carries meaning on an exam sheet, so grayscale is safe and removes the bulk of a phone photo’s weight. What is not safe is a low JPEG quality, so this profile holds at 71 to keep bubble outlines and pencil strokes distinct where detection and grading depend on them.</p>\n<p>If a bundle is still too heavy after one pass, the right lever is fewer megapixels at scan time, not a harsher quality setting — rescanning a page at a saner resolution beats crushing every answer into ambiguity.</p>",
    "deepH2": "Why exam scans need a gentler hand than homework",
    "deepHtml": "<p>The whole reason this page differs from a coursework crush is that Gradescope reads answers, not just words. A <strong>20 MB</strong> target with protected contrast keeps both the human grader and the autograder confident, where a 5 MB homework pass would blur the very marks being scored.</p>\n<p>For ordinary submissions bound by blunt caps, the LMS pages are a better fit: <a href=\"/compress-pdf-for-schoology/\">Schoology’s ~5 MB page</a> or the classic <a href=\"/compress-pdf-for-canvas/\">Canvas</a> route. When a teacher simply grades on a phone, <a href=\"/compress-pdf-for-google-classroom/\">the Classroom openability page</a> applies instead.</p>\n<p>Break a very long exam into question groups with <a href=\"/split-pdf/\">Split PDF</a>, then run a careful pass on <a href=\"/compress-pdf/\">Compress PDF</a> if a single section stays heavy.</p>\n<p>Reordering or merging scanned sheets before upload is covered under <a href=\"/pdf-tools/\">PDF tools</a>.</p>",
    "faqH2": "Gradescope scan upload questions",
    "faq": [
      {
        "q": "My Gradescope exam scan is too large to upload — how do I shrink it safely?",
        "a": "Use this page: grayscale Web compression runs in your browser toward roughly 20 MB while preserving the contrast Gradescope needs, then you upload it yourself."
      },
      {
        "q": "Will compressing blur my bubble sheet answers?",
        "a": "The preset holds JPEG quality at 71 precisely to protect bubbles and ink. If a page is still too heavy, rescan it at lower resolution rather than crushing quality."
      },
      {
        "q": "Is grayscale a problem for exam scans?",
        "a": "No. Colour rarely carries meaning on an exam sheet, so grayscale removes weight without affecting how answers are read or graded."
      },
      {
        "q": "Does this page send my exam to VeloTools?",
        "a": "No. Processing stays in the browser. Only you upload the finished scan into Gradescope afterward."
      },
      {
        "q": "What if the full exam bundle is still over 20 MB?",
        "a": "Split the scan by question groups, rescan the worst pages at lower phone resolution, or run one more measured pass on Compress PDF."
      }
    ]
  },

  'compress-pdf-for-jira': {
    "securityH2": "Attach a design PDF to Jira without a middleman upload",
    "securityHtml": "<p>Product specs, log dumps, and design exports headed for a Jira ticket often contain roadmap details that should not sit on a stranger’s compress server for “an hour.” This page shrinks the file in the browser with a Web preset aimed at Atlassian Cloud’s common <strong>10 MB</strong> per-file limit.</p>\n<p>The document is re-encoded in tab memory and never reaches VeloTools. You download the trimmed PDF and attach it on the issue yourself, keeping internal work off unknown SaaS.</p>\n<p>Annotations are stripped by default here because a Jira attachment is usually a snapshot for the ticket, not a live review thread — a deliberate contrast with review-oriented mail presets.</p>",
    "problemH2": "The 10 MB bounce that stalls a ticket",
    "problemHtml": "<p>Atlassian Cloud commonly caps a single Jira attachment near <strong>10 MB</strong>, though site admins can change it. Export a few Figma frames or a verbose log-to-PDF and the ticket rejects the upload just as you are trying to unblock a teammate.</p>\n<p>People respond by pasting screenshots into the description, which scatters the detail and makes the issue harder to search later. A locked Web pass keeps the artefact as one attached PDF that reviewers can open in context.</p>\n<p>Because the cap is per file rather than a message budget, the fix is straightforward: trim the export under 10 MB before it ever touches the issue.</p>",
    "stepsH2": "Getting a design export under the Jira attachment cap",
    "steps": [
      "Drop the oversized export; the Web preset at 57% JPEG with annotations stripped is already locked for tickets.",
      "Run Compress All until the gauge clears 10 MB, then download the trimmed PDF to your working folder.",
      "Attach the file on the Jira issue, and export fewer frames or split the doc if the cap still bounces it."
    ],
    "specsH2": "Jira ticket attachment preset",
    "specs": [
      [
        "Problem it solves",
        "Jira attachment over the 10 MB limit"
      ],
      [
        "Size check",
        "10 MB common Atlassian Cloud cap"
      ],
      [
        "Preset",
        "Web · 96 DPI · 57% JPEG"
      ],
      [
        "Annotations",
        "Stripped for a clean ticket snapshot"
      ],
      [
        "Privacy",
        "Local only before the issue attach"
      ],
      [
        "Sibling pages",
        "Confluence · Asana"
      ]
    ],
    "presetH2": "Why Jira mode strips annotations by default",
    "presetHtml": "<p>A ticket attachment is typically evidence — a rendered spec or a captured log — rather than a document people redline in place. Dropping the annotation stream shaves weight that would only pad the file and rarely carries meaning inside the issue.</p>\n<p>If a particular attachment really is a review artefact, keep the markup by compressing on a preset that preserves annotations instead, such as the Confluence or Box routes, and attach that copy to the ticket.</p>",
    "deepH2": "Where Jira attachments fit among Atlassian tools",
    "deepHtml": "<p>The <strong>10 MB</strong> per-file ceiling makes Jira a per-attachment problem rather than a mailbox one, so the tactic is simply to land each export under the line before upload. Fewer exported frames often beats a harsher quality setting.</p>\n<p>Its closest sibling is <a href=\"/compress-pdf-for-confluence/\">the Confluence page</a>, which shares the ~10 MB neighbourhood but tunes for embeds that must not stall the editor. For task boards where mobile openability matters more than a hard cap, <a href=\"/compress-pdf-for-asana/\">the Asana page</a> is the better match.</p>\n<p>When a spec is genuinely large, divide it with <a href=\"/split-pdf/\">Split PDF</a> and attach the relevant section, or run one more pass on <a href=\"/compress-pdf/\">Compress PDF</a> with a firmer preset.</p>\n<p>Everything else — merge, reorder, unlock — sits under <a href=\"/pdf-tools/\">PDF tools</a> once the ticket accepts the file.</p>",
    "faqH2": "Jira attachment size questions",
    "faq": [
      {
        "q": "Why does Jira reject my PDF attachment?",
        "a": "Atlassian Cloud usually limits a single file to around 10 MB, and admins can adjust it. Compress under that line here, then attach on the issue again."
      },
      {
        "q": "Does this page keep my ticket details private?",
        "a": "Yes. The re-encode runs in your browser and nothing reaches VeloTools. You attach the finished PDF to Jira yourself."
      },
      {
        "q": "Why are annotations stripped for Jira?",
        "a": "A ticket attachment is normally a snapshot, so dropping the annotation stream trims weight. If you need markup preserved, compress on an annotation-keeping preset instead."
      },
      {
        "q": "What if the export is still above 10 MB?",
        "a": "Export fewer Figma frames, split the document by section, or run a stronger Screen pass on the main Compress PDF tool."
      },
      {
        "q": "Can I raise the Jira limit instead of compressing?",
        "a": "A site admin can change per-file limits, but compressing is faster for one attachment and keeps ticket history lean for everyone loading the issue."
      }
    ]
  },

  'compress-pdf-for-confluence': {
    "securityH2": "Embed in Confluence without parking the file on a compressor",
    "securityHtml": "<p>Architecture docs and design PDFs pinned to a Confluence page often describe systems that should not visit an outside compressor first. This page trims the file in the browser with a mild Web preset so a <strong>10 MB</strong> embed stops stalling the editor, and the document never leaves your session.</p>\n<p>The re-encode happens in tab memory and never touches our servers. You download the lighter PDF and attach or embed it in Confluence yourself.</p>\n<p>Annotations are stripped by default because a wiki embed is usually a reference artefact rather than a live redline, keeping the attached copy lean for everyone who loads the page.</p>",
    "problemH2": "Why a heavy PDF makes a Confluence page crawl",
    "problemHtml": "<p>Confluence Cloud pages feel sluggish once an attached or embedded PDF pushes past roughly <strong>10 MB</strong>, especially when a space is full of macros and the editor tries to render a preview. Readers open the page, wait, and lose the thread.</p>\n<p>Teams work around it by pasting screenshots into the body, which fragments the diagram and defeats page search. A mild Web pass keeps a single embeddable PDF that opens without freezing the editor.</p>\n<p>The issue is preview responsiveness rather than a hard rejection, so the goal is a file light enough that the macro renders promptly on a colleague’s laptop.</p>",
    "stepsH2": "Keeping a Confluence embed responsive",
    "steps": [
      "Drop the heavy PDF; the mild Web preset at 55% JPEG is already locked so embeds render without stalling.",
      "Run Compress All until the gauge clears the ~10 MB embed target, then download the lighter file.",
      "Attach or embed the download in Confluence, and split long chapters into separate attachments if a page still lags."
    ],
    "specsH2": "Confluence embed-oriented preset",
    "specs": [
      [
        "Problem it solves",
        "Confluence page slow / embed too heavy"
      ],
      [
        "Size check",
        "~10 MB embed target"
      ],
      [
        "Preset",
        "Web · 96 DPI · 55% JPEG"
      ],
      [
        "Annotations",
        "Stripped for a lean wiki artefact"
      ],
      [
        "Privacy",
        "Browser-only before the Confluence attach"
      ],
      [
        "Sibling pages",
        "Jira · Notion"
      ]
    ],
    "presetH2": "Mild Web quality tuned for wiki reading",
    "presetHtml": "<p>Wiki content is read in a narrow column, so a mild Web preset that empties export bloat is enough to make an embed feel instant. The quality sits slightly softer than a mailbox target because on-page rendering, not print fidelity, is the job.</p>\n<p>Keep the pristine master elsewhere and let Confluence hold the readable copy. Overwriting your only lossless export with a wiki-optimised embed is the kind of shortcut that hurts a diagram later.</p>",
    "deepH2": "Confluence embeds versus other document surfaces",
    "deepHtml": "<p>The practical <strong>10 MB</strong> line on Confluence is about editor responsiveness rather than a blunt cap, so the aim is a prompt-rendering embed, not the smallest possible file. That focus separates it from a mailbox or LMS crush.</p>\n<p>Its Atlassian sibling is <a href=\"/compress-pdf-for-jira/\">the Jira page</a>, which shares the ~10 MB neighbourhood but targets ticket attachments. For product-doc embeds in a different wiki, <a href=\"/compress-pdf-for-notion/\">the Notion page</a> tunes for a tighter in-page preview.</p>\n<p>Long architecture specs embed more smoothly once you divide them with <a href=\"/split-pdf/\">Split PDF</a>, and one measured pass on <a href=\"/compress-pdf/\">Compress PDF</a> handles a stubborn chapter.</p>\n<p>Reorder or merge sections before embedding from the wider <a href=\"/pdf-tools/\">PDF tools</a> catalogue.</p>",
    "faqH2": "Confluence PDF embed questions",
    "faq": [
      {
        "q": "Why does my Confluence page load slowly after I add a PDF?",
        "a": "Embedded files past roughly 10 MB make the editor and preview crawl. Compress toward that target here, then re-attach the lighter copy."
      },
      {
        "q": "Does compressing here upload my architecture doc anywhere?",
        "a": "No. The shrink is entirely in your browser, and you attach or embed the finished PDF in Confluence yourself."
      },
      {
        "q": "Why does the Confluence preset drop annotations?",
        "a": "A wiki embed is usually a reference artefact, so stripping the annotation stream keeps it lean. Use an annotation-keeping preset if you need markup preserved."
      },
      {
        "q": "What if the page still lags with a big spec?",
        "a": "Split the document into separate attachments per chapter, or run a firmer pass on Compress PDF before embedding."
      },
      {
        "q": "Should I embed the PDF or link out to it?",
        "a": "Embed a compressed copy for quick reading and link out to a hosted master when readers need full fidelity beyond the page."
      }
    ]
  },

  'compress-pdf-for-asana': {
    "securityH2": "Attach to an Asana task without a public compress hop",
    "securityHtml": "<p>Design briefs and creative exports dropped onto an Asana task often carry unreleased work, which has no business sitting on an anonymous compressor first. This page trims the file in the browser with a Web preset so it opens smoothly in the mobile task view, and the export never leaves your device.</p>\n<p>The document is re-encoded in tab memory and never reaches our servers. You download the lighter PDF and attach it on the task yourself.</p>\n<p>Annotations are stripped by default because a task attachment is usually a reference for collaborators, and shedding that stream helps the file open quickly on a phone during standup.</p>",
    "problemH2": "When an Asana task PDF stalls on a phone",
    "problemHtml": "<p>Asana allows large task attachments on paid plans, so the failure is rarely a hard rejection. Instead, a bloated design export sits at the top of a task and refuses to render promptly in the mobile app, even inside a comfortable <strong>50 MB</strong> allowance.</p>\n<p>The weight comes from InDesign and Figma exports that carry oversized embedded images and unused artboards. Collaborators tap the attachment, wait, and give up before the preview loads.</p>\n<p>This URL optimises for that phone-openability moment: a Web pass with annotation stripping that keeps colour brand pages intact while cutting the export waste that makes mobile crawl.</p>",
    "stepsH2": "Making an Asana attachment open on mobile",
    "steps": [
      "Drop the design export; the Web preset at 69% JPEG with annotations stripped is already locked for task views.",
      "Run Compress All until the file feels light within the ~50 MB comfort zone, then download the trimmed copy.",
      "Attach the download on the Asana task, and remove unused artboards or split the brief if it still drags on phones."
    ],
    "specsH2": "Asana task attachment profile",
    "specs": [
      [
        "Problem it solves",
        "Asana task PDF slow to open on mobile"
      ],
      [
        "Comfort zone",
        "~50 MB before mobile stalls"
      ],
      [
        "Preset",
        "Web · 96 DPI · 69% JPEG"
      ],
      [
        "Annotations",
        "Stripped for faster task previews"
      ],
      [
        "Privacy",
        "Browser-only before the task attach"
      ],
      [
        "Sibling pages",
        "Jira · Confluence"
      ]
    ],
    "presetH2": "Web quality that keeps brand colour on a task",
    "presetHtml": "<p>Design collaborators expect their colour to survive, so this profile keeps colour and re-encodes at a Web quality high enough that brand pages still read well while the export bloat disappears. The goal is a phone-friendly preview, not a print master.</p>\n<p>Unused artboards and oversized embedded images are the usual weight, so trimming those at export time pairs well with this pass. If fidelity truly matters more than mobile speed, keep the master and attach only the compressed reference copy.</p>",
    "deepH2": "Asana openability versus hard-cap platforms",
    "deepHtml": "<p>The distinctive thing about Asana is that its generous <strong>50 MB</strong>-class allowance means the real limit is human patience on a phone, not a byte ceiling. Optimising for the task preview, not a marketing cap, is what keeps a board moving.</p>\n<p>Its productivity siblings enforce firmer caps: <a href=\"/compress-pdf-for-jira/\">the Jira page</a> targets a ~10 MB per-file limit, and <a href=\"/compress-pdf-for-confluence/\">the Confluence page</a> tunes for editor-responsive embeds. For a hosted design master that reviewers download later, <a href=\"/compress-pdf-for-box/\">the Box page</a> keeps annotations and a larger comfort zone.</p>\n<p>Multi-brief packets open faster once split with <a href=\"/split-pdf/\">Split PDF</a>, and a single heavy export can take one more pass on <a href=\"/compress-pdf/\">Compress PDF</a>.</p>\n<p>Reorder or merge artboards before attaching from <a href=\"/pdf-tools/\">PDF tools</a>.</p>",
    "faqH2": "Asana attachment questions from teams",
    "faq": [
      {
        "q": "Why does my Asana task PDF take forever to open on my phone?",
        "a": "Bloated design exports render slowly in the mobile task view even under Asana’s large allowance. Compressing here trims the export waste so the preview loads quickly."
      },
      {
        "q": "Does Asana reject files, or just open them slowly?",
        "a": "Paid plans allow large attachments, so the pain is usually slow mobile rendering rather than a hard rejection. This page targets openability, not a byte cap."
      },
      {
        "q": "Will my brand colours survive the compression?",
        "a": "Yes. The preset keeps colour and uses a fairly high Web quality, so brand pages stay readable while oversized embedded images are trimmed."
      },
      {
        "q": "Does attaching here send my design to VeloTools?",
        "a": "No. Everything runs in your browser, and you attach the finished PDF on the Asana task yourself."
      },
      {
        "q": "What if the export is still slow after compressing?",
        "a": "Remove unused artboards at export time, split the brief into parts, or run one more pass on Compress PDF before attaching."
      }
    ]
  },

  'compress-pdf-for-box': {
    "securityH2": "Prepare a Box share without a second upload to a compressor",
    "securityHtml": "<p>Client files headed for a Box shared link are only as pleasant as the PDF behind them, and parking that PDF on an anonymous compressor first adds a needless processor. This page trims the file in the browser toward a practical <strong>50 MB</strong> share comfort zone, and the document never leaves your device.</p>\n<p>Contracts and creative masters are re-encoded in tab memory and never reach our servers. You download the lighter copy and upload it to Box under your own account.</p>\n<p>Annotations are preserved here because Box shares are frequently sent to external reviewers who need the markup, so this profile keeps comments intact while shedding raster bloat.</p>",
    "problemH2": "Why a 200 MB art PDF punishes a Box preview",
    "problemHtml": "<p>Enterprise Box quotas are large, so storage is rarely the blocker. The friction shows up in the browser preview and the upload itself: a 200 MB print-quality art PDF crawls in the shared-link viewer and frustrates an external reviewer who just wanted a quick look.</p>\n<p>Teams then fall back to desktop-sync-only workflows or fire off screenshots, both of which undercut the point of a clean shared link. A Web pass toward a practical <strong>50 MB</strong> keeps the file previewable in a browser without forcing anyone to install a sync client.</p>\n<p>The target is reviewer comfort on a shared link, not a hard cap, so the aim is a copy that previews smoothly for someone outside your organisation.</p>",
    "stepsH2": "Sizing a PDF for a comfortable Box link",
    "steps": [
      "Drop the heavy art or contract PDF; the Web preset at 73% JPEG with annotations kept is already locked for shares.",
      "Run Compress All until the gauge sits near or under the ~50 MB comfort line, then download the lighter copy.",
      "Upload the download to Box and generate the link, keeping the print master offline for anyone who needs full fidelity."
    ],
    "specsH2": "Box shared-link compress profile",
    "specs": [
      [
        "Problem it solves",
        "Box shared-link preview slow / upload heavy"
      ],
      [
        "Comfort zone",
        "~50 MB for browser preview"
      ],
      [
        "Preset",
        "Web · 96 DPI · 73% JPEG"
      ],
      [
        "Annotations",
        "Kept for external reviewers"
      ],
      [
        "Privacy",
        "Browser-only before the Box upload"
      ],
      [
        "Sibling pages",
        "OneDrive · Google Drive"
      ]
    ],
    "presetH2": "Higher-quality Web preset for external reviewers",
    "presetHtml": "<p>Because a Box link often lands in front of a client, the JPEG quality is held at a generous 73 and annotations stay attached. The result previews cleanly in a browser and preserves the review context that external stakeholders expect.</p>\n<p>This is deliberately gentler than a mailbox crush: the goal is a smooth shared-link preview, not the smallest attachment. Keep the untouched print master in a separate folder so a compressed share never becomes your only copy.</p>",
    "deepH2": "Box comfort versus tighter cloud and mail targets",
    "deepHtml": "<p>Box sits in the roomy cloud tier where a practical <strong>50 MB</strong> keeps previews and uploads pleasant rather than fighting a hard ceiling. That places it between mailbox caps and the very largest storage services.</p>\n<p>Its cloud siblings tune differently: <a href=\"/compress-pdf-for-onedrive/\">the OneDrive page</a> aims a mild pass at a 25 MB mail-path checker for people who still demand a direct attachment, while <a href=\"/compress-pdf-for-google-drive/\">the Google Drive page</a> stays milder near a ~100 MB office target. When a private mailbox is the destination instead, <a href=\"/compress-pdf-for-proton-mail/\">the Proton Mail page</a> keeps annotations too.</p>\n<p>Very large binders share more comfortably once divided with <a href=\"/split-pdf/\">Split PDF</a>, and a single heavy master can take one more pass on <a href=\"/compress-pdf/\">Compress PDF</a>.</p>\n<p>The rest of the suite, including merge and reorder, lives under <a href=\"/pdf-tools/\">PDF tools</a>.</p>",
    "faqH2": "Box shared-link size questions",
    "faq": [
      {
        "q": "Do I need to compress a PDF before sharing it on Box?",
        "a": "Not for storage, but a 200 MB art PDF previews slowly on a shared link. A ~50 MB compress keeps the browser preview smooth for external reviewers."
      },
      {
        "q": "Will comment markup survive on a Box share?",
        "a": "Yes. This profile keeps annotations because Box links often go to reviewers who need the markup, while still trimming raster bloat."
      },
      {
        "q": "Does compressing here upload my file to Box automatically?",
        "a": "No. The shrink is local. You upload the download to Box and create the shared link yourself."
      },
      {
        "q": "Can external reviewers preview the file without desktop sync?",
        "a": "That is the goal. Sizing toward ~50 MB keeps the browser shared-link preview responsive without forcing anyone to install a sync client."
      },
      {
        "q": "Should I keep the original print master?",
        "a": "Yes. Store the untouched master in a separate folder so the compressed share copy never becomes your only version."
      }
    ]
  },

  'compress-pdf-for-onedrive': {
    "securityH2": "Trim a OneDrive PDF before a mail cap rejects it",
    "securityHtml": "<p>OneDrive and SharePoint store enormous files without complaint, so the real trouble starts when someone insists on a direct attachment and a mail ceiling bounces it. This page runs a mild Web pass toward a <strong>25 MB</strong> mail-path check, all in the browser, so the document never visits an outside compressor.</p>\n<p>The file is re-encoded in tab memory and never reaches our servers. You download the lighter copy and either re-upload to OneDrive or attach it wherever the mail cap applies.</p>\n<p>Annotations are preserved here because these office documents frequently carry review comments, and the mild profile keeps them while shedding export bloat.</p>",
    "problemH2": "Storage is fine — the attachment path is the problem",
    "problemHtml": "<p>Nobody hits a wall putting a PDF into OneDrive; the service will hold it comfortably. The failure appears one step later, when a recipient refuses a link and demands a direct file, and the mail client rejects anything past a common <strong>25 MB</strong> attachment ceiling.</p>\n<p>Export bloat is what pushes an otherwise ordinary office PDF over that mail line. A mild Web pass trims the waste so the same document can travel as a plain attachment when a link simply will not do.</p>\n<p>This URL is built for that specific hand-off: OneDrive keeps the master, and a lightly compressed copy satisfies the person who wants a file in their inbox rather than a shared link.</p>",
    "stepsH2": "Getting a OneDrive PDF under a mail attachment cap",
    "steps": [
      "Drop the office PDF; the mild Web preset at 74% JPEG with annotations kept is already locked for the mail path.",
      "Run Compress All until the gauge clears the 25 MB mail check, then download the lighter attachment copy.",
      "Attach the download or re-upload to OneDrive, and share a link or split the deck if it stays over the mail cap."
    ],
    "specsH2": "OneDrive mail-path compress profile",
    "specs": [
      [
        "Problem it solves",
        "OneDrive file fine but mail attach rejected"
      ],
      [
        "Size check",
        "25 MB mail-path check"
      ],
      [
        "Preset",
        "Web · 96 DPI · 74% JPEG"
      ],
      [
        "Annotations",
        "Kept for office review comments"
      ],
      [
        "Privacy",
        "Browser-only before share or attach"
      ],
      [
        "Sibling pages",
        "Box · Outlook"
      ]
    ],
    "presetH2": "A mild pass for the awkward direct-attach request",
    "presetHtml": "<p>Since storage is never the issue, this profile stays mild — quality 74 with annotations intact — because the only job is clearing a mail ceiling for someone who refuses a link. There is no reason to crush an office document that OneDrive would host untouched.</p>\n<p>If the recipient will accept a shared link after all, skip the attachment entirely and send the OneDrive URL. The compressed copy exists purely for the case where a direct file is non-negotiable.</p>",
    "deepH2": "OneDrive links versus the stubborn direct attachment",
    "deepHtml": "<p>The quirk this page solves is social as much as technical: OneDrive can store the file, but a recipient sometimes insists on a direct attachment, and mail caps near <strong>25 MB</strong> then bite. A mild pass bridges that gap without degrading the office original.</p>\n<p>For the actual mailbox send, pair this with <a href=\"/compress-pdf-for-outlook/\">the Outlook page</a>, whose ~20 MB consumer habit is even tighter. Its cloud sibling <a href=\"/compress-pdf-for-box/\">the Box page</a> keeps a larger comfort zone for hosted shares, and <a href=\"/compress-pdf-for-google-drive/\">the Google Drive page</a> stays milder near ~100 MB.</p>\n<p>Oversized decks travel better once split with <a href=\"/split-pdf/\">Split PDF</a>, and a firmer squeeze is available on <a href=\"/compress-pdf/\">Compress PDF</a> when a mail cap is unusually strict.</p>\n<p>Reorder or merge before sharing from <a href=\"/pdf-tools/\">PDF tools</a>.</p>",
    "faqH2": "OneDrive attachment and sharing questions",
    "faq": [
      {
        "q": "My file is fine in OneDrive but the email attach fails — why?",
        "a": "OneDrive stores large files easily, yet mail clients reject attachments past roughly 25 MB. A mild compress here clears that mail cap when a link will not do."
      },
      {
        "q": "Should I just send a OneDrive link instead of compressing?",
        "a": "If the recipient accepts links, yes — that is simplest. Compress only when they insist on a direct attached PDF that must fit under a mail ceiling."
      },
      {
        "q": "Will review comments survive this compression?",
        "a": "Yes. The mild profile keeps annotations because office documents often carry review markup, while trimming export bloat."
      },
      {
        "q": "Does this page sign into my Microsoft account?",
        "a": "No. There is no Microsoft login. The shrink runs in your browser and you handle the OneDrive upload or the attachment yourself."
      },
      {
        "q": "What if the file is still over the mail cap?",
        "a": "Send a OneDrive link, split the deck into parts, or run a firmer pass on Compress PDF before attaching."
      }
    ]
  },

  'compress-pdf-for-messenger': {
    "securityH2": "Send a PDF in Messenger without a compress site in the middle",
    "securityHtml": "<p>Receipts, forms, and travel documents shared in a Facebook Messenger chat should not detour through an unknown compressor before they reach the conversation. This page shrinks the file in the browser toward a practical <strong>25 MB</strong> chat comfort zone, and the document never leaves your device.</p>\n<p>The PDF is re-encoded in tab memory and never reaches our servers. You download the lighter file and attach it in Messenger yourself, so only Meta’s chat sees what you choose to send.</p>\n<p>That local-only step matters when a receipt carries a name or an address you would rather not hand to a random “free compressor” that quietly retains uploads.</p>",
    "problemH2": "The Messenger document send that never finishes",
    "problemHtml": "<p>Mobile Messenger document sends grow unreliable once a PDF climbs past a practical <strong>25 MB</strong> zone, a threshold that shifts with client and version. The upload spinner hangs, the recipient sees nothing arrive, and the chat stalls.</p>\n<p>People then fall back to a burst of page screenshots, which smears fine print and scatters a single document across the thread. A Web pass that lands under the practical chat line keeps the file as one clean attachment.</p>\n<p>Because the ceiling is fuzzy and client-dependent, aiming comfortably under 25 MB is the reliable way to make a send actually complete on cellular data.</p>",
    "stepsH2": "Getting a PDF through a Messenger chat cleanly",
    "steps": [
      "Drop the heavy PDF; the Web preset at 56% JPEG is already locked for the practical Messenger chat zone.",
      "Run Compress All until the gauge sits comfortably under 25 MB for a reliable mobile send.",
      "Attach the download in Messenger, and switch to Screen on Compress PDF or send a Drive link if it still hangs."
    ],
    "specsH2": "Messenger chat document profile",
    "specs": [
      [
        "Problem it solves",
        "Messenger PDF send hangs / never delivers"
      ],
      [
        "Comfort zone",
        "~25 MB for reliable chat sends"
      ],
      [
        "Preset",
        "Web · 96 DPI · 56% JPEG"
      ],
      [
        "Colour",
        "Kept for receipts and forms"
      ],
      [
        "Privacy",
        "Browser-only before the chat attach"
      ],
      [
        "Sibling pages",
        "WhatsApp · Telegram"
      ]
    ],
    "presetH2": "Chat-readable Web quality under a fuzzy ceiling",
    "presetHtml": "<p>Messenger’s document limit wobbles with the app version, so this profile aims a firm-but-readable Web quality under a practical 25 MB line rather than chasing a number the client will not confirm. Colour stays on for receipts and forms while metadata bloat is discarded.</p>\n<p>If a send still hangs on a weak connection, the fix is a stronger pass or a link rather than another retry. A file that comfortably clears the practical zone is far more likely to deliver on the first attempt.</p>",
    "deepH2": "Messenger among the messaging comfort bands",
    "deepHtml": "<p>Like other chat apps, Messenger’s real limit is delivery reliability on mobile data, not a published cap. Aiming under a practical <strong>25 MB</strong> zone is what turns “sending…” into an attachment the other person can actually open.</p>\n<p>Its messaging siblings lock different comfort bands: <a href=\"/compress-pdf-for-whatsapp/\">the WhatsApp page</a> steers near a ~16 MB comfort band with the paperclip Document path, and <a href=\"/compress-pdf-for-telegram/\">the Telegram page</a> targets a ~20 MB Files-tray band. When the audience is an inbox rather than a chat, <a href=\"/compress-pdf-for-gmail/\">the Gmail page</a> handles the 25 MB attachment world.</p>\n<p>A long packet sends more reliably once split with <a href=\"/split-pdf/\">Split PDF</a>, and a firmer squeeze is available on <a href=\"/compress-pdf/\">Compress PDF</a> when a send keeps stalling.</p>\n<p>The wider catalogue, including merge and reorder, sits under <a href=\"/pdf-tools/\">PDF tools</a>.</p>",
    "faqH2": "Messenger PDF sending questions",
    "faq": [
      {
        "q": "Why does my Messenger PDF send hang and never deliver?",
        "a": "Document sends grow unreliable past a practical ~25 MB zone that varies by app version. Compress comfortably under that line here, then attach again."
      },
      {
        "q": "Is there an official Messenger PDF size limit?",
        "a": "The ceiling is fuzzy and client-dependent, so aiming under a practical 25 MB comfort zone is the reliable way to make a mobile send complete."
      },
      {
        "q": "Will receipts and forms stay readable after compressing?",
        "a": "Yes. The preset keeps colour and a readable Web quality, so receipts and forms remain legible while metadata bloat is removed."
      },
      {
        "q": "Does compressing here post my file to Facebook?",
        "a": "No. The shrink runs in your browser and nothing reaches VeloTools. You attach the finished PDF in Messenger yourself."
      },
      {
        "q": "What if the send still fails on a weak connection?",
        "a": "Run a stronger Screen pass on Compress PDF, split the document, or share a Drive link instead of retrying the same heavy file."
      }
    ]
  },
};
