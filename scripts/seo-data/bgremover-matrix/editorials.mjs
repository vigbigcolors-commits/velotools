/**
 * Unique editorial per BG Remover PSEO id — anti-doorway.
 * No shared SEO essay cloned from /bgremover/.
 */
/** @typedef {{ eyebrow: string, h2: string, lead: string, whyPreset: string, workflowTip: string, privacyNote: string, faqs: { question: string, answer: string }[] }} Editorial */

/** @type {Record<string, Editorial>} */
export const EDITORIALS = {
  'bgremover-ecommerce': {
    eyebrow: 'Catalog privacy',
    h2: 'Product cutouts that never hit a cloud bucket',
    lead:
      'Ecommerce teams lose hours uploading hero shots to SaaS removers that store files for model training. This page locks a white preview and PNG-first export so catalog QA matches storefront reality while every pixel stays in the tab.',
    whyPreset:
      'White preview surfaces leftover fringe that looks fine on checkers but fails on PDP white. Suggest Refine once so silhouettes meet marketplace cleanliness without a second tool.',
    workflowTip:
      'Shoot with subject filling most of the frame. After AI, click Refine, zoom to 200 percent on seams and labels, then export PNG for design or JPG-white for channel uploads.',
    privacyNote:
      'Supplier and unreleased product photos often sit under NDA. Local WebAssembly inference means those frames never transit a third-party API — only the public model weights download once.',
    faqs: [
      {
        question: 'Will white preview match Shopify PDP backgrounds?',
        answer:
          'Yes for flat white storefronts. Use the white swatch during QA, then export PNG if you composite later, or JPG-white when the channel rejects transparency. The preset does not upload the file either way.',
      },
      {
        question: 'Can I batch hundreds of SKUs here?',
        answer:
          'This page processes one image at a time for memory safety on laptops. For large catalogs, run sequentially; the model stays cached so later SKUs skip the download tax. No account queue exists because there is no server quota.',
      },
    ],
  },
  'bgremover-portraits': {
    eyebrow: 'Hair-safe cutouts',
    h2: 'Portrait edges without shipping faces to a server',
    lead:
      'Portrait work fails when tools shave flyaways or smear skin into the matte. This preset keeps a transparent checker so you judge alpha honestly, then nudges Refine before you touch brushes.',
    whyPreset:
      'Transparent preview plus Refine-first guidance matches how photographers inspect hair against busy plates. Cloud removers cannot offer the same inspect loop without uploading the face.',
    workflowTip:
      'Run AI, hit Refine once, zoom to 200 to 400 percent along the hairline. Restore at about 40 percent opacity for missing strands; Erase softly where halo remains.',
    privacyNote:
      'Faces are biometric-adjacent data in many jurisdictions. Keeping inference on-device removes the need to trust a remover SaaS with identity photos for marketing or casting.',
    faqs: [
      {
        question: 'Does Refine destroy curly hair detail?',
        answer:
          'One Refine peels roughly two pixels of fringe and feathers the band. Curly stacks usually need Restore afterward, not more Refine. Undo with Ctrl plus Z if a pass feels aggressive.',
      },
      {
        question: 'What export should I use for compositing?',
        answer:
          'PNG preserves partial alpha for hair tips. Avoid JPG until the composite is final. WebP is fine for web delivery after you approve the matte on checkers.',
      },
    ],
  },
  'bgremover-etsy': {
    eyebrow: 'Handmade listings',
    h2: 'Etsy-ready cutouts that stay on your craft desk',
    lead:
      'Makers photographing jewelry, ceramics, and textiles should not upload unfinished work to random removers. This page defaults to white preview and JPG-white export language common in listing guides.',
    whyPreset:
      'Etsy buyers expect clean white or soft studio looks. Locking white preview plus JPG-white guidance reduces listing rejections without forcing a cloud hop for every SKU photo.',
    workflowTip:
      'Use natural window light, remove the stand with Smart Erase if needed, confirm no colored fringe on white, then Download JPG on white for the main listing image.',
    privacyNote:
      'Workshop photos can reveal private addresses, kids, or unreleased designs in the background. Local removal lets you scrub those risks before anything public is published.',
    faqs: [
      {
        question: 'Does Etsy require pure white JPEG?',
        answer:
          'Policies vary by category, but white backgrounds photograph cleaner in search grids. This preset previews white and points export to JPG-white so you can match common listing advice without leaving the browser.',
      },
      {
        question: 'Can I keep a transparent file for mockups?',
        answer:
          'Yes. Switch the swatch to transparent and Download PNG anytime. The preset only sets the default QA background; it does not block other exports.',
      },
    ],
  },
  'bgremover-amazon': {
    eyebrow: 'Marketplace main image',
    h2: 'Amazon-style white silhouettes without an upload',
    lead:
      'Main images fail when fringe or gray mats sneak in. This preset combines pure white preview, JPG-white export hint, and a Refine suggestion so the first pass closer matches marketplace expectations.',
    whyPreset:
      'Amazon main images typically demand a pure white field. Suggesting Refine after AI reduces soft gray rings that get flagged in automated checks, while still never leaving the device.',
    workflowTip:
      'Fill the frame with the product, remove AI debris with Smart Erase on leftover table edges, Refine once, then export JPG-white. Keep PNG only for internal design.',
    privacyNote:
      'Brand assets and packaging proofs are competitive secrets. On-device cutouts avoid parking those files on remover CDNs that retain uploads for weeks.',
    faqs: [
      {
        question: 'Is this an Amazon-certified tool?',
        answer:
          'No certification claim. It is a local editor that helps you produce white-background masters. Always re-check the current Seller Central image rules for your category before publishing.',
      },
      {
        question: 'What if my product is white on white?',
        answer:
          'Shoot with a contrasting temporary backdrop, cut out locally, then place on pure white via JPG-white export. Soft Erase along the silhouette prevents the subject from dissolving into the fill.',
      },
    ],
  },
  'bgremover-pets': {
    eyebrow: 'Fur and whiskers',
    h2: 'Pet cutouts that keep whiskers without a cloud hop',
    lead:
      'Fur fails on hard mattes. A black preview reveals white and colored halo instantly. This page starts dark so you can Refine and Restore with honest contrast before any share.',
    whyPreset:
      'Dark preview is the fastest way to see leftover studio paper in fur tips. Refine is suggested because soft peels recover whiskers better than a second full AI run.',
    workflowTip:
      'After AI, switch mentally to halo hunting on black. Refine once, Restore thin whiskers, Erase paper crumbs in the coat, then flip to transparent for final PNG.',
    privacyNote:
      'Pet photos often include home interiors. Local processing keeps household details off remover logs that could otherwise retain EXIF-adjacent context.',
    faqs: [
      {
        question: 'Why start on black instead of white?',
        answer:
          'Light fur fringe hides on white and screams on black. Starting dark forces you to clean the matte before export. You can still switch to white anytime for client proofs.',
      },
      {
        question: 'Will long fur always need manual work?',
        answer:
          'Often yes for show-quality results. AI gets you 80 to 90 percent; Restore and Erase at low opacity finish the last strands. That is expected for any serious fur pipeline.',
      },
    ],
  },
  'bgremover-headshots': {
    eyebrow: 'Identity-safe headshots',
    h2: 'LinkedIn-ready heads without a face-upload API',
    lead:
      'Professional headshots should not be a free ticket for cloud removers to store biometric-looking imagery. Soft blush preview keeps skin tones readable while you tidy hair and collars locally.',
    whyPreset:
      'Blush preview is gentler than stark white for skin QA and still shows dark jacket fringing. Refine stays on so suit edges and flyaways get a controlled peel.',
    workflowTip:
      'Crop tight before upload into the tool, run AI, Refine once around hair, Restore glasses frames if needed, export PNG, then drop onto a studio backdrop in your editor.',
    privacyNote:
      'Recruiting and executive portraits are identity assets. Keeping the ISNet pass inside the browser eliminates a third-party retention surface for those faces.',
    faqs: [
      {
        question: 'Can I make a solid color corporate backdrop here?',
        answer:
          'Yes. Pick a swatch or custom color after the cutout, then export JPG with background. For maximum flexibility keep a PNG master and composite in design software.',
      },
      {
        question: 'Does the model change my skin tone?',
        answer:
          'The matte path edits alpha, not a beauty filter. Edge decontamination may slightly pull fringe colors toward nearby foreground; Undo if a collar looks muddy and Refine more gently.',
      },
    ],
  },
  'bgremover-jewelry': {
    eyebrow: 'Macro metalwork',
    h2: 'Jewelry macros without uploading sparkle IP',
    lead:
      'Reflective stands and glitter backgrounds confuse cloud removers and leak design IP. This preset keeps transparency and points you to Smart Erase for stands, with WebP for light gallery pages.',
    whyPreset:
      'Transparent checkers reveal whether metal edges still carry stand color. Skipping auto Refine avoids chewing micro highlights; Smart Erase is the better first cleanup.',
    workflowTip:
      'AI first, Smart Erase the stand and labels, zoom to inspect prongs, optional light Erase on glitter dust, export WebP for site grids or PNG for print comps.',
    privacyNote:
      'Unreleased collections are high-value IP. Local cutouts mean those macros never sit in a remover bucket waiting for a breach narrative.',
    faqs: [
      {
        question: 'Why suggest WebP for jewelry?',
        answer:
          'Product grids load faster with WebP while PNG remains available for lossless edits. Choose PNG when a retoucher will reopen the file.',
      },
      {
        question: 'Glass and gems look incomplete — now what?',
        answer:
          'Semi-transparent stones are hard for any salient model. Restore at low opacity along gem edges, accepting partial alpha. For museum-grade glass, combine with a manual path elsewhere.',
      },
    ],
  },
  'bgremover-apparel': {
    eyebrow: 'Flat lay apparel',
    h2: 'Apparel flats ready for lookbook mocks',
    lead:
      'Hangers, pins, and table paper ruin ghost-mannequin pipelines. Gradient preview helps you judge silhouette drama while Refine cleans hems before PNG handoff to design tools.',
    whyPreset:
      'Gradient mock backgrounds expose leftover table tones better than pure white for fashion comps. Refine on hems reduces stairsteps before Figma.',
    workflowTip:
      'Remove hangers with Smart Erase, Refine along hems and sleeves, Move the garment for crop balance, export PNG into your ghost-mannequin or lookbook file.',
    privacyNote:
      'Seasonal samples are confidential. Processing on-device keeps sample photography out of shared remover histories used across unrelated brands.',
    faqs: [
      {
        question: 'Is this a full ghost-mannequin tool?',
        answer:
          'It removes the backdrop and hanger clutter. Neck joining and internal garment fill still happen in your retouching app. This page accelerates the privacy-sensitive cutout stage.',
      },
      {
        question: 'What about wrinkled fabric edges?',
        answer:
          'AI follows the outer silhouette. Use soft Erase for fabric crumbs and Restore if a cuff disappears. Ironing before shoot still beats any brush later.',
      },
    ],
  },
  'bgremover-social': {
    eyebrow: 'Sticker velocity',
    h2: 'Story stickers without another cloud app',
    lead:
      'Creators churn cutouts for Stories and Reels. Black preview plus WebP keeps contrast high and files light, while Refine prevents crunchy sticker edges on busy video frames.',
    whyPreset:
      'Black preview mimics dark story canvases so halo shows early. WebP export hint matches social upload budgets better than giant PNG stickers.',
    workflowTip:
      'Cut out, Refine once for a clean sticker lip, Move to center if needed, export WebP, import into your story tool. Keep PNG only when a designer will reuse the asset.',
    privacyNote:
      'Selfie-based stickers are personal. Local AI avoids stacking another social-adjacent SaaS that mirrors your face into training sets.',
    faqs: [
      {
        question: 'Will WebP work in every story app?',
        answer:
          'Most modern mobile apps accept WebP. If an app rejects it, re-export PNG from the same session — the matte is already done and still local.',
      },
      {
        question: 'How do I avoid jagged sticker edges?',
        answer:
          'One Refine pass plus a soft Erase along high-contrast boundaries usually fixes jaggies. Zoom in; social viewers see edges more than you expect.',
      },
    ],
  },
  'bgremover-transparent-png': {
    eyebrow: 'Alpha-first design',
    h2: 'True transparent PNG for design systems',
    lead:
      'Designers need honest alpha, not a JPEG pretending to be cut out. Checkerboard preview and PNG-lossless export make this page a local drop-in for Figma, Photoshop, and Canva pipelines.',
    whyPreset:
      'Leaving Refine off by default avoids over-peeling hard graphic shapes. Designers can still Refine manually when photos need it; vectors and logos often should not.',
    workflowTip:
      'Drop the asset, confirm checkers show clean alpha, skip Refine for hard logos, use Refine only on photo subjects, then Download PNG into your design file.',
    privacyNote:
      'Brand kits and unreleased UI chrome should not train a public remover. On-device mattes keep those system assets inside the laptop.',
    faqs: [
      {
        question: 'Does PNG stay lossless here?',
        answer:
          'Yes. The PNG export path writes standard lossless PNG with the computed alpha channel. We do not recompress with a lossy step on that button.',
      },
      {
        question: 'Can I use this for logo cleanup?',
        answer:
          'For photo-based marks, yes. For already-vector logos, prefer editing the source SVG. This tool shines when you only have a raster with a busy plate.',
      },
    ],
  },
};
