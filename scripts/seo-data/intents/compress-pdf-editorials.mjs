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
};
