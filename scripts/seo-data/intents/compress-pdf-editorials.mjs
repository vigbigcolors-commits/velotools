/**
 * Handcrafted compress-pdf PSEO editorials — unique per slug.
 * SEO pass: human search phrasing, softer tone, intentional internal links.
 */
export const COMPRESS_PDF_EDITORIALS = {
  'compress-pdf-for-gmail': {
    securityH2: 'Shrink for Gmail without uploading your PDF',
    securityHtml: `<p>If Gmail says the attachment is too large, you do not need a website that asks you to “upload to compress.” On this page the file never leaves your laptop: the browser reads it, shrinks pages with a locked email preset, and you download a smaller PDF to attach yourself.</p>
<p>That is the difference between convenience and privacy. Contracts, tax packets, and medical letters stay in tab memory until you close the tab.</p>`,
    stepsH2: 'How to fix “attachment too large” in Gmail',
    steps: [
      'Drop the PDF that Gmail rejected — the 25 MB email preset is already locked on this page.',
      'Tap Compress All and wait for the green size check under 25 MB.',
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
    deepH2: 'Why Gmail stops at 25 MB — and what to do next',
    deepHtml: `<p>Gmail’s well-known ceiling is about <strong>25 MB per message</strong> for everyday accounts. Workspace admins can raise it, but most people still hit the classic wall with scanned packets and slide decks.</p>
<p>This page is tuned for that moment: keep the file readable in Gmail’s preview, strip bulky metadata, and show a warning before you waste time on a failed Send. It is not meant for print-shop masters — keep your original if you still need perfect vector text later.</p>
<p>Compared with <a href="/compress-pdf-for-outlook/">Outlook’s tighter 20 MB habit</a>, Gmail gives a little more room, so we use a gentler email preset here. If one file is still huge after compressing, <a href="/split-pdf/">split the PDF</a> or run a second pass on <a href="/compress-pdf/">Compress PDF</a> with the Screen preset.</p>
<p>Also leave a little headroom: embedded images in the email body count toward the same message size.</p>`,
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
<p>Student IDs and handwritten pages never transit through our servers — you download, then upload into Canvas yourself.</p>`,
    stepsH2: 'What to do when Canvas rejects your PDF',
    steps: [
      'Add the file Canvas marked too large — Screen + grayscale for homework scans is already on.',
      'Compress All until the checker shows under 5 MB.',
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
    deepH2: 'The real reason Canvas homework PDFs explode in size',
    deepHtml: `<p>Students photograph worksheets in full color at 12 megapixels. Canvas courses often still use a small default upload cap near <strong>5 MB</strong>. One photo page can burn the whole quota.</p>
<p>This URL assumes that failure mode on purpose: grayscale + lower resolution for “get it submitted tonight,” not for a printed portfolio. If your instructor raised the limit and you need color figures, use <a href="/compress-pdf/">Compress PDF</a> with a milder preset instead.</p>
<p>Need a smaller sibling for another LMS? See <a href="/compress-pdf-for-blackboard/">Blackboard</a> or <a href="/compress-pdf-for-moodle/">Moodle</a> — each locks a different tradeoff. To break a giant scan into parts, open <a href="/split-pdf/">Split PDF</a>.</p>`,
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
    securityHtml: `<p>When Outlook refuses to send, people often try a web compressor that stores the file for “an hour.” Skip that. This Outlook page shrinks the PDF in the browser, keeps review comments when you need them, and checks the common <strong>20 MB</strong> attachment ceiling before you hit Send.</p>`,
    stepsH2: 'Fix Outlook attachment size errors',
    steps: [
      'Drop the PDF Outlook would not send — the 20 MB preset is locked here.',
      'Compress All; comments/annotations stay unless you strip them elsewhere.',
      'Attach the download in Outlook. Still blocked? Split the deck or ask IT if a transport rule (not size) is the real cause.',
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
    deepH2: 'Outlook vs Gmail size limits (why this page exists)',
    deepHtml: `<p>Many Outlook.com and Outlook on the web mailboxes still behave like a <strong>20 MB</strong> attachment cap — five megabytes tighter than everyday Gmail. That is why this preset is a bit more aggressive than <a href="/compress-pdf-for-gmail/">Compress PDF for Gmail</a>, while still aiming for readable slides on a phone.</p>
<p>Desktop Outlook follows whatever your Exchange admin configured. If Send fails even under 20 MB, look for DLP or transport rules. Size compression cannot bypass a policy that blocks certain content types.</p>
<p>Sharing a huge appendix? <a href="/split-pdf/">Split PDF</a> into parts, or host the full file and send a link. For a second, stronger pass use <a href="/compress-pdf/">Compress PDF</a> unlocked.</p>`,
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
    securityHtml: `<p>Graded work belongs in Blackboard, not on a third-party compress server. This page prepares a smaller PDF on your computer with a homework preset (grayscale Screen) aimed at the <strong>~10 MB</strong> ceiling many Ultra courses still use.</p>`,
    stepsH2: 'When Blackboard says the file exceeds the limit',
    steps: [
      'Drop the rejected PDF — grayscale Screen mode for scans is already locked.',
      'Compress All until you clear the 10 MB check.',
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
    deepH2: 'Scans, stylus pens, and Blackboard’s small quotas',
    deepHtml: `<p>Tablet markups and camera scans inflate PDFs fast. Blackboard Learn / Ultra courses frequently sit near a <strong>10 MB</strong> assignment cap — larger than Canvas’s harsh 5 MB default, still small for color photo packets.</p>
<p>We force grayscale here because most rejected Blackboard homework is readable in gray. Need color schematics? Prefer <a href="/compress-pdf-for-moodle/">Moodle mode</a> (color kept) or unlocked <a href="/compress-pdf/">Compress PDF</a> after you confirm a higher course limit.</p>
<p>Canvas users with a stricter cap should use <a href="/compress-pdf-for-canvas/">Compress PDF for Canvas</a>. Giant multi-lab PDFs belong in <a href="/split-pdf/">Split PDF</a> before a second compress.</p>`,
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
    securityHtml: `<p>Shipping labels, ID scans, and signed affidavits should not be uploaded to a random compress site. Use this page to shrink toward a practical <strong>~10 MB</strong> form limit while keeping color so stamps and ink still look intentional — everything runs offline in the browser.</p>`,
    stepsH2: 'Portal rejected your PDF for size — try this',
    steps: [
      'Drop the form or scan the portal refused — color is kept on purpose.',
      'Compress All and confirm you are under the 10 MB warning.',
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
    deepH2: 'Readable seals beat maximum compression',
    deepHtml: `<p>Unlike homework modes, this URL refuses forced grayscale. A muddy stamp can fail a human review even when the file is small enough. We trade a bit of size for color fidelity at email-like resolution, then warn around <strong>10 MB</strong> — a ceiling many USPS-related and municipal fields still hint at.</p>
<p>Always read the form’s own help text; some legacy fields sit at 5 MB. When that happens, try Screen on <a href="/compress-pdf/">Compress PDF</a> and zoom the signature before submitting.</p>
<p>For school portals instead of government forms, use <a href="/compress-pdf-for-canvas/">Canvas</a>, <a href="/compress-pdf-for-blackboard/">Blackboard</a>, or <a href="/compress-pdf-for-moodle/">Moodle</a>. Multi-page evidence packets can be divided with <a href="/split-pdf/">Split PDF</a>.</p>`,
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
    securityHtml: `<p>When Moodle blocks a submit on maximum file size, compress locally first. This page targets a conservative <strong>10 MB</strong> working default many sites use, keeps color for plots and screenshots, and never uploads your coursework to us.</p>`,
    stepsH2: 'Clear a Moodle “file is too large” message',
    steps: [
      'Drop the PDF Moodle rejected — Screen preset with color kept is locked here.',
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
    deepH2: 'Your Moodle site picks maxbytes — we pick a safe middle',
    deepHtml: `<p>Moodle limits are local configuration, often anywhere from a few megabytes to tens of megabytes. Publishing a honest <strong>10 MB</strong> working target helps the common case without pretending we can read your server settings.</p>
<p>Color stays on because STEM uploads die in forced grayscale. That is the intentional opposite of <a href="/compress-pdf-for-blackboard/">Blackboard mode</a>. Canvas courses with a brutal 5 MB cap should use <a href="/compress-pdf-for-canvas/">Compress PDF for Canvas</a> instead.</p>
<p>If your activity allows 50 MB, lighten up on <a href="/compress-pdf/">Compress PDF</a>. If it allows only 2 MB, plan on <a href="/split-pdf/">splitting</a> or a stronger grayscale pass after this one.</p>`,
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
    securityH2: 'Chat-ready PDFs without uploading them first',
    securityHtml: `<p>Leases, tickets, and lab results shared on WhatsApp should be compressed on your phone or laptop — not on a stranger’s website. This mode aims for a practical <strong>~16 MB</strong> document size so the chat does not stall on mobile data, then you send the file as a Document.</p>`,
    stepsH2: 'Send a PDF on WhatsApp without the endless spinner',
    steps: [
      'Drop the heavy PDF — quality is locked for readable tickets and QR codes.',
      'Compress All until you are near or under the 16 MB practical check.',
      'Download, open WhatsApp, attach as Document (not Photo). Photos re-compress and blur codes.',
    ],
    specsH2: 'WhatsApp document preset',
    specs: [
      ['Problem it solves', 'PDF too large / slow to send on WhatsApp'],
      ['Practical check', '~16 MB for comfortable mobile delivery'],
      ['Send as', 'Document (never Gallery/Photo)'],
      ['Quality bias', 'Sharper than email modes for QR and fine print'],
      ['Privacy', 'Local compress before the chat upload'],
      ['Related', 'Split PDF for multi-chapter packets'],
    ],
    deepH2: 'Document beats Photo — and why ~16 MB feels right',
    deepHtml: `<p>WhatsApp may accept larger documents on paper, but real chats on cellular bog down past roughly <strong>16 MB</strong>. Recipients cancel downloads; you resend as grainy photos; everyone loses. This page optimizes for “opens on the first try.”</p>
<p>Always choose <strong>Document</strong> after downloading. The Photo path treats pages like camera images and often ruins QR codes on boarding passes.</p>
<p>Need email instead of chat? Use <a href="/compress-pdf-for-gmail/">Gmail</a> (25 MB) or <a href="/compress-pdf-for-outlook/">Outlook</a> (20 MB). Huge binders should go through <a href="/split-pdf/">Split PDF</a> first, then a light pass on <a href="/compress-pdf/">Compress PDF</a> if a single chapter must stay crystal sharp.</p>`,
    faqH2: 'WhatsApp PDF sharing — common questions',
    faq: [
      {
        q: 'How do I compress a PDF to send on WhatsApp?',
        a: 'Compress it here until it is around 16 MB or less, download it, then in WhatsApp choose the Document attachment — not the photo picker.',
      },
      {
        q: 'Why does my PDF look blurry when I share it in the chat?',
        a: 'You probably sent it as a photo. Send the downloaded PDF as a Document so WhatsApp does not re-encode the pages.',
      },
      {
        q: 'WhatsApp allowed a bigger file before — why cap at 16 MB?',
        a: 'Bigger can work technically and still fail for the recipient on slow data. Sixteen megabytes is a delivery target for fewer failed downloads.',
      },
      {
        q: 'Will a boarding-pass QR code still scan?',
        a: 'This preset keeps higher JPEG quality for that reason. If a code fails, compress that single page hotter on the main tool and keep the file small by splitting.',
      },
      {
        q: 'Does Meta or VeloTools see the file while I compress?',
        a: 'VeloTools does not. WhatsApp only receives what you attach afterward in the app.',
      },
    ],
  },
};
