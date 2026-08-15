/**
 * Unique editorial per BG Remover PSEO id — anti-doorway.
 * Depth: scenario + edges sections; ≥5 FAQs; ≥600 words combined per entry.
 * No shared SEO essay cloned from /bgremover/.
 */
/** @typedef {{ eyebrow: string, h2: string, lead: string, whyPreset: string, workflowTip: string, privacyNote: string, scenarioH2: string, scenarioBody: string, edgesH2: string, edgesBody: string, faqs: { question: string, answer: string }[] }} Editorial */

/** @type {Record<string, Editorial>} */
export const EDITORIALS = {
  'bgremover-ecommerce': {
    eyebrow: 'Catalog privacy',
    h2: 'Product cutouts that never hit a cloud bucket',
    lead:
      'Ecommerce teams lose hours uploading hero shots to SaaS removers that store files for model training. This page locks a white preview and PNG-first export so catalog QA matches storefront reality while every pixel stays in the tab. Merchandisers working under supplier NDAs can process seasonal drops without parking unfinished packaging on a third-party CDN. The widget state is baked at build time so the client never invents marketplace defaults from a query string. That keeps Zero-Backend privacy intact even when you deep-link a preset from your internal wiki. Use this route when Shopify, BigCommerce, or custom PDP white fields are the acceptance criteria, not when you need a social sticker lip.',
    whyPreset:
      'White preview surfaces leftover fringe that looks fine on checkers but fails on PDP white. Suggest Refine once so silhouettes meet marketplace cleanliness without a second tool. PNG as the primary export preserves alpha for design handoff while you still can switch to JPG-white for channels that reject transparency. The tip label reminds operators to judge edges on the same field customers will see. Together these defaults form a catalog fingerprint distinct from Amazon main-image or Etsy handmade routes.',
    workflowTip:
      'Shoot with subject filling most of the frame. After AI, click Refine, zoom to 200 percent on seams and labels, then export PNG for design or JPG-white for channel uploads. Keep a short checklist: remove stand debris with Smart Erase, confirm barcode stickers are not floating in alpha holes, and Move the crop so the product sits on the optical center your theme expects. Cache the model once per browser profile so SKU queues skip the download tax on later frames.',
    privacyNote:
      'Supplier and unreleased product photos often sit under NDA. Local WebAssembly inference means those frames never transit a third-party API — only the public model weights download once. Catalog ops should still strip EXIF before publishing, but the cutout stage itself no longer creates an upload retention surface. That matters when legal teams ask where sample photography lived during pre-launch week.',
    scenarioH2: 'When catalog QA should start on pure white',
    scenarioBody:
      'Open this preset when a merchandiser is clearing a drop for a white PDP template. Drop one hero frame, let AI run, accept the white swatch as the truth surface, and treat Refine as a mandatory single pass before anyone debates shadows. If the channel later wants transparency for a lifestyle composite, switch swatches and re-export PNG from the same matte — you do not re-upload. For multi-SKU mornings, process sequentially; memory safety on laptops beats a fake batch queue that would require a server. When packaging text must stay crisp, avoid extra Refine passes that can chew micro type on labels.',
    edgesH2: 'Catalog silhouettes: labels, seams, and stand crumbs',
    edgesBody:
      'Ecommerce edges fail in three boring ways: gray rings on white, stand feet still attached, and label corners bitten by an aggressive peel. Zoom along seams first, then along barcode stickers. Soft Erase removes paper crumbs without digging into carton graphics. Restore at low opacity if a soft pack corner vanished. Finish by flipping between white and transparent once so you catch fringe that only appears on one field. Export only after that dual check.',
    faqs: [
      {
        question: 'Will white preview match Shopify PDP backgrounds?',
        answer:
          'Yes for flat white storefronts. Use the white swatch during QA, then export PNG if you composite later, or JPG-white when the channel rejects transparency. The preset does not upload the file either way. If your theme uses off-white, pick a custom color after cutout and export JPG with background instead of assuming pure white.',
      },
      {
        question: 'Can I batch hundreds of SKUs here?',
        answer:
          'This page processes one image at a time for memory safety on laptops. For large catalogs, run sequentially; the model stays cached so later SKUs skip the download tax. No account queue exists because there is no server quota. Pair with a simple local folder script if you need renaming discipline — the cutout itself remains private.',
      },
      {
        question: 'Does Refine change product color accuracy?',
        answer:
          'Refine peels fringe alpha; it is not a color grade. Slight decontamination near edges can shift a thin halo toward foreground hues. If a logo stripe looks muddy, Undo and use softer Erase instead of a second Refine. Always judge final color on your calibrated monitor after export.',
      },
      {
        question: 'PNG or JPG-white for marketplace uploads?',
        answer:
          'Prefer JPG-white when the portal forbids transparency and expects a solid field. Prefer PNG when design will composite or when you need partial alpha on soft packs. This preset defaults PNG because many ecommerce teams hand off to design before channel upload.',
      },
      {
        question: 'What if my product is already on white paper?',
        answer:
          'AI may still leave paper texture in corners. Smart Erase the table plane, then confirm on white preview that no soft gray remains. For nearly white subjects, shoot on a contrasting temporary backdrop first so the matte has contrast to learn from.',
      },
    ],
  },
  'bgremover-portraits': {
    eyebrow: 'Hair-safe cutouts',
    h2: 'Portrait edges without shipping faces to a server',
    lead:
      'Portrait work fails when tools shave flyaways or smear skin into the matte. This preset keeps a transparent checker so you judge alpha honestly, then nudges Refine before you touch brushes. Photographers, casting teams, and boutique studios get an inspect loop that never requires uploading a face to a remover SaaS. The baked widget state prefers PNG so partial alpha on hair tips survives into composites. Use this route for people-first frames, not for rigid product silhouettes that hate soft peels.',
    whyPreset:
      'Transparent preview plus Refine-first guidance matches how photographers inspect hair against busy plates. Cloud removers cannot offer the same inspect loop without uploading the face. Suggest Refine is on because one controlled peel recovers fringe better than re-running the full model. The tip pushes a 200 percent zoom so operators actually see flyaways before export.',
    workflowTip:
      'Run AI, hit Refine once, zoom to 200 to 400 percent along the hairline. Restore at about 40 percent opacity for missing strands; Erase softly where halo remains. Keep brush sizes small near ears and glasses. Export PNG for compositing; only flatten to JPG after the final plate is approved. If curly stacks collapse, prefer Restore over a second Refine.',
    privacyNote:
      'Faces are biometric-adjacent data in many jurisdictions. Keeping inference on-device removes the need to trust a remover SaaS with identity photos for marketing or casting. Studio contracts that forbid third-party processing can cite local WebAssembly as the technical control. Still obtain subject consent for the shoot itself; privacy here covers the cutout hop, not the entire production chain.',
    scenarioH2: 'Casting and client portrait days without a face-upload hop',
    scenarioBody:
      'Use this page when a retoucher needs a clean alpha for a new backdrop but legal already banned cloud removers. Import the select, run AI, accept the checkerboard as the honesty surface, and Refine once before any brush ego. Deliver PNG masters to the art director; keep JPG proofs only for email previews that must stay tiny. For kids or talent still under embargo, local processing means the matte never appears in a SaaS dashboard. If you later need a solid color for social, add the fill in your design tool from the PNG master.',
    edgesH2: 'Hairlines, glasses, and collar junctions on portraits',
    edgesBody:
      'Portrait edges live or die at the hairline, eyeglass rims, and where collars meet skin. After Refine, Restore thin flyaways with short strokes. Soft Erase any backdrop color clinging to dark jackets. For glasses, Restore the frame if AI punched a hole, then Erase lens reflections that belong to the old room. Do not chase every translucent strand to perfection if the composite plate is busy — match edge softness to the final background, not to a studio white fantasy.',
    faqs: [
      {
        question: 'Does Refine destroy curly hair detail?',
        answer:
          'One Refine peels roughly two pixels of fringe and feathers the band. Curly stacks usually need Restore afterward, not more Refine. Undo with Ctrl plus Z if a pass feels aggressive. Work in short Restore strokes following curl direction rather than spraying opacity everywhere.',
      },
      {
        question: 'What export should I use for compositing?',
        answer:
          'PNG preserves partial alpha for hair tips. Avoid JPG until the composite is final. WebP is fine for web delivery after you approve the matte on checkers. Keep the PNG master in your archive even if the client only asked for a flattened proof.',
      },
      {
        question: 'Can I replace the backdrop with a studio color here?',
        answer:
          'Yes. After the cutout, pick a swatch or custom color and export JPG with background. For maximum reuse, still save a transparent PNG first. Blush or soft gray fills are gentler for skin QA than stark white when the deliverable is a corporate plate.',
      },
      {
        question: 'Why is transparent the default instead of white?',
        answer:
          'Checkers reveal dishonest mattes that white can hide. Portrait comps rarely stay on pure white forever, so alpha honesty beats marketplace white QA. Switch to white anytime if a client insists on that proof style.',
      },
      {
        question: 'Will beards and peach fuzz need manual work?',
        answer:
          'Often yes. AI gets the major silhouette; Restore at low opacity recovers fuzz that Refine may have peeled. Dark preview can help, but this preset starts on checkers so you can flip to black manually when hunting halo on light hair.',
      },
    ],
  },
  'bgremover-etsy': {
    eyebrow: 'Handmade listings',
    h2: 'Etsy-ready cutouts that stay on your craft desk',
    lead:
      'Makers photographing jewelry, ceramics, and textiles should not upload unfinished work to random removers. This page defaults to white preview and JPG-white export language common in listing guides. The suggest-Refine flag stays off so delicate handmade textures are not over-peeled by default. You still can Refine manually when a ceramic rim needs it. Privacy here protects workshop context — kids, addresses, and unreleased glaze tests in the background — before anything public is published.',
    whyPreset:
      'Etsy buyers expect clean white or soft studio looks. Locking white preview plus JPG-white guidance reduces listing rejections without forcing a cloud hop for every SKU photo. Skipping auto Refine protects soft yarn and uneven pottery edges that benefit from Smart Erase instead. The tip label points straight at the listing export, not at a designer PNG handoff.',
    workflowTip:
      'Use natural window light, remove the stand with Smart Erase if needed, confirm no colored fringe on white, then Download JPG on white for the main listing image. Keep a PNG on the side for mockups and lifestyle composites. Shoot slightly tighter than your final crop so Move can recenter after cutout. For textiles, flatten wrinkles before you fight edges in software.',
    privacyNote:
      'Workshop photos can reveal private addresses, kids, or unreleased designs in the background. Local removal lets you scrub those risks before anything public is published. That is especially useful for home-based sellers who cannot build a dedicated seamless paper corner. The model weights are public; your craft photos are not sent anywhere during inference.',
    scenarioH2: 'Listing week for handmade SKUs without a SaaS queue',
    scenarioBody:
      'Open this preset when you are clearing ten to forty handmade photos for a shop update. Process one piece at a time on white, export JPG-white for the primary listing image, and only switch to transparent when you need a mockup for social. If a category guide mentions soft shadows, add them later in your editor on the JPG — do not fake shadows inside the matte. For collaborative shops, each maker can run cutouts on their own laptop so raw frames never pool in a shared remover account.',
    edgesH2: 'Handmade rims, yarn fuzz, and prop stands on Etsy shots',
    edgesBody:
      'Handmade edges are irregular on purpose. Prefer Smart Erase for stands and tape over automatic peels that shave intentional texture. On yarn, Restore soft fuzz rather than refining twice. On ceramics, zoom the rim where glaze meets backdrop and Erase color fringing gently. Confirm on white that no table tone remains in recessed bases. Export JPG-white only after that check.',
    faqs: [
      {
        question: 'Does Etsy require pure white JPEG?',
        answer:
          'Policies vary by category, but white backgrounds photograph cleaner in search grids. This preset previews white and points export to JPG-white so you can match common listing advice without leaving the browser. Always re-read the current seller handbook for your niche before assuming a hard rule.',
      },
      {
        question: 'Can I keep a transparent file for mockups?',
        answer:
          'Yes. Switch the swatch to transparent and Download PNG anytime. The preset only sets the default QA background; it does not block other exports. Many makers keep PNG for Canva mockups and JPG-white for the live listing.',
      },
      {
        question: 'Why is Refine not suggested on this page?',
        answer:
          'Handmade textures often look worse after an automatic peel. We leave Refine optional so you choose when a rim truly needs it. Product photography with hard manufactured edges may prefer the Amazon or ecommerce presets instead.',
      },
      {
        question: 'What about lifestyle photos with props?',
        answer:
          'If the listing should show props, do not cut them out. Use this tool when the subject should stand alone on white. For lifestyle frames, crop and color-correct without a full matte, or cut only the hero object for a collage layout.',
      },
      {
        question: 'Will watermark-free exports stay local?',
        answer:
          'Yes. There is no account watermark pipeline because there is no upload. Your browser writes the file from the in-memory canvas. Clear site data only if you also want to drop the cached model weights.',
      },
    ],
  },
  'bgremover-amazon': {
    eyebrow: 'Marketplace main image',
    h2: 'Amazon-style white silhouettes without an upload',
    lead:
      'Main images fail when fringe or gray mats sneak in. This preset combines pure white preview, JPG-white export hint, and a Refine suggestion so the first pass closer matches marketplace expectations. Brand teams can produce submission candidates without parking packaging proofs on a remover CDN. The route is intentionally stricter than general ecommerce: it assumes the deliverable is a pure white main image, not a transparent design master. Always re-check Seller Central category rules before you treat any local export as final.',
    whyPreset:
      'Amazon main images typically demand a pure white field. Suggesting Refine after AI reduces soft gray rings that get flagged in automated checks, while still never leaving the device. JPG-white as the highlighted export matches how most sellers submit. The tip language calls out shadow fringe explicitly because that is a common rejection reason.',
    workflowTip:
      'Fill the frame with the product, remove AI debris with Smart Erase on leftover table edges, Refine once, then export JPG-white. Keep PNG only for internal design. Avoid decorative shadows in the main image unless your category explicitly allows them. For white-on-white products, shoot on a contrasting temporary backdrop first so the model has an edge to find.',
    privacyNote:
      'Brand assets and packaging proofs are competitive secrets. On-device cutouts avoid parking those files on remover CDNs that retain uploads for weeks. If your brand security policy lists approved vendors, local processing removes the cutout tool from that negotiation entirely. Still secure the laptop and shared drives where masters live after export.',
    scenarioH2: 'Main-image submission week for Seller Central',
    scenarioBody:
      'Use this page when ASIN main images are due and legal already blocked consumer removers. Process each hero on white, Refine once, export JPG-white, and archive PNG only if design needs composites for A-plus modules. Do not reuse lifestyle shadows from secondary images on the main slot. If automated checks still flag fringe, zoom 300 percent and soft-Erase the ring rather than running Refine again. For variations, keep lighting consistent so cutouts feel like one catalog family.',
    edgesH2: 'Pure white mains: fringe rings and floating crumbs',
    edgesBody:
      'Amazon-style edges should look almost boring: hard enough to read in a search grid, soft enough to avoid jaggies. After Refine, hunt gray rings on white at zoom. Erase table crumbs that AI left as dust islands. Restore any clipped corner of packaging. Avoid painting fake contact shadows into the matte if the channel wants a pure field. Export JPG-white only when the silhouette survives a full-screen white stare test.',
    faqs: [
      {
        question: 'Is this an Amazon-certified tool?',
        answer:
          'No certification claim. It is a local editor that helps you produce white-background masters. Always re-check the current Seller Central image rules for your category before publishing. Treat exports as candidates until your own compliance checklist passes.',
      },
      {
        question: 'What if my product is white on white?',
        answer:
          'Shoot with a contrasting temporary backdrop, cut out locally, then place on pure white via JPG-white export. Soft Erase along the silhouette prevents the subject from dissolving into the fill. Slight underexposure on the temporary backdrop often helps the model more than raising ISO.',
      },
      {
        question: 'Can secondary images stay lifestyle?',
        answer:
          'Yes. This preset targets the main image workflow. Lifestyle and detail shots can use other routes or no cutout at all. Keep naming clear so the white main never gets swapped with a transparent design export by accident.',
      },
      {
        question: 'How many Refine passes are safe?',
        answer:
          'Usually one. A second pass can chew packaging type and thin plastic edges. Prefer Undo plus localized Erase if a ring remains. Zoom is cheaper than another global peel.',
      },
      {
        question: 'Does JPG-white strip metadata?',
        answer:
          'Export behavior focuses on pixels and the white field. Strip EXIF with your usual publishing pipeline if policy requires it. Local cutout does not replace your broader asset hygiene checklist.',
      },
    ],
  },
  'bgremover-pets': {
    eyebrow: 'Fur and whiskers',
    h2: 'Pet cutouts that keep whiskers without a cloud hop',
    lead:
      'Fur fails on hard mattes. A black preview reveals white and colored halo instantly. This page starts dark so you can Refine and Restore with honest contrast before any share. Pet businesses, shelters, and owners avoid uploading home interiors that often appear behind the animal. PNG export keeps soft whisker alpha for later composites on bright sites. This is not a product-white marketplace preset; it is a fur-first inspection loop.',
    whyPreset:
      'Dark preview is the fastest way to see leftover studio paper in fur tips. Refine is suggested because soft peels recover whiskers better than a second full AI run. PNG preserves the partial alpha those whiskers need. The tip tells operators to hunt halo on black before they trust a white client proof.',
    workflowTip:
      'After AI, switch mentally to halo hunting on black. Refine once, Restore thin whiskers, Erase paper crumbs in the coat, then flip to transparent for final PNG. Keep opacity low on Restore so you do not paint solid blobs. For dark fur on dark floors, temporarily flip to white to spot missing chunks, then return to black for halo.',
    privacyNote:
      'Pet photos often include home interiors. Local processing keeps household details off remover logs that could otherwise retain EXIF-adjacent context. Shelters handling adoptable animals can process photos on volunteer laptops without creating a shared cloud album of cutouts. Still blur identifiable addresses in the original if the frame will be published widely.',
    scenarioH2: 'Adoption and pet-brand shoots with fur-first QA',
    scenarioBody:
      'Open this preset when whiskers and coat edges matter more than marketplace white. Run AI, stay on black until halo is gone, then export PNG for the designer who will place the pet on a colorful landing section. If a client insists on white proofs, flip swatches only after the matte is clean. For multi-pet days, cache the model and keep a naming scheme that includes animal ID so files do not mix. Avoid over-refining curly coats; Restore is usually the better second move.',
    edgesH2: 'Whiskers, ear tufts, and coat halo on dark preview',
    edgesBody:
      'Pet edges are soft by nature. On black, white paper halo screams along the outline — erase it gently. Restore whiskers with single-pixel-minded strokes. Ear tufts often need a mix of Restore inside and Erase outside. Do not chase every translucent hair if the final plate is busy foliage; match softness to the destination. Export PNG so those decisions survive into the composite.',
    faqs: [
      {
        question: 'Why start on black instead of white?',
        answer:
          'Light fur fringe hides on white and screams on black. Starting dark forces you to clean the matte before export. You can still switch to white anytime for client proofs. Many retouchers flip between both several times before they trust the edge.',
      },
      {
        question: 'Will long fur always need manual work?',
        answer:
          'Often yes for show-quality results. AI gets you 80 to 90 percent; Restore and Erase at low opacity finish the last strands. That is expected for any serious fur pipeline, cloud or local. Budget time accordingly instead of expecting a one-click miracle.',
      },
      {
        question: 'Can I use this for pet product packs too?',
        answer:
          'If the subject is a rigid package, prefer the ecommerce or marketplace-white presets. Use pets when the living animal is the silhouette. Mixed frames with both animal and pack may need two cutouts composited later.',
      },
      {
        question: 'Does black preview affect the exported colors?',
        answer:
          'No. Preview swatches are QA backgrounds. PNG export carries the subject colors and alpha, not the black field, unless you intentionally export JPG with background while black is selected.',
      },
      {
        question: 'How do I handle leash and collar hardware?',
        answer:
          'Decide whether hardware stays in the story. If it should go, Smart Erase the leash and Restore fur behind where possible. If it stays, Refine carefully around metal so you do not leave a backdrop ring on chrome tags.',
      },
    ],
  },
  'bgremover-headshots': {
    eyebrow: 'Identity-safe headshots',
    h2: 'LinkedIn-ready heads without a face-upload API',
    lead:
      'Professional headshots should not be a free ticket for cloud removers to store biometric-looking imagery. Soft blush preview keeps skin tones readable while you tidy hair and collars locally. Recruiters, coaches, and corporate comms teams get a PNG master for any studio backdrop without a face-upload API. Suggest Refine stays on so suit edges and flyaways get a controlled peel. This route is for people in professional context, not for passport-form hard white rules — use the ID photo preset when a document field is the goal.',
    whyPreset:
      'Blush preview is gentler than stark white for skin QA and still shows dark jacket fringing. Refine stays on so suit edges and flyaways get a controlled peel. PNG export keeps flexibility for designers who will drop the head onto brand plates. The tip states the privacy promise plainly because that is the reason many teams open this URL.',
    workflowTip:
      'Crop tight before upload into the tool, run AI, Refine once around hair, Restore glasses frames if needed, export PNG, then drop onto a studio backdrop in your editor. Keep a secondary JPG with a corporate color only after stakeholders pick the plate. Avoid beauty-filter expectations; this path edits alpha, not skin retouching.',
    privacyNote:
      'Recruiting and executive portraits are identity assets. Keeping the ISNet pass inside the browser eliminates a third-party retention surface for those faces. Enterprises can document local inference in their vendor review and skip the data-protection addendum fight for a remover SaaS. Still control who has the laptop and where PNG masters are stored afterward.',
    scenarioH2: 'Executive and coach headshot batches on a locked laptop',
    scenarioBody:
      'Use this preset when a communications team must cut fifty heads for a site refresh and security forbids uploads. Process each select on blush, Refine once, export PNG into the brand library, and composite onto approved backdrops in design tools. For contractors working offsite, local processing means faces never sit in a shared remover inbox. If someone needs a quick white proof for email, flip swatches temporarily without changing the archived PNG master.',
    edgesH2: 'Suit lapels, flyaways, and eyeglass rims on blush',
    edgesBody:
      'Headshot edges concentrate on hair, glasses, and dark lapels against the old room. After Refine, Restore flyaways sparingly. Soft Erase backdrop color on navy jackets. Rebuild eyeglass rims if AI carved notches, then Erase room reflections in the lenses that betray the old location. Blush preview helps you see muddy skin-edge decontamination; Undo if a jawline looks stained and prefer localized Erase.',
    faqs: [
      {
        question: 'Can I make a solid color corporate backdrop here?',
        answer:
          'Yes. Pick a swatch or custom color after the cutout, then export JPG with background. For maximum flexibility keep a PNG master and composite in design software. Matching exact brand hex values is often easier in Figma than inside the remover UI.',
      },
      {
        question: 'Does the model change my skin tone?',
        answer:
          'The matte path edits alpha, not a beauty filter. Edge decontamination may slightly pull fringe colors toward nearby foreground; Undo if a collar looks muddy and Refine more gently. Final skin work belongs in your retouching app if the brief requires it.',
      },
      {
        question: 'Is blush required for LinkedIn uploads?',
        answer:
          'No. Blush is a QA preview. Export transparent PNG or a corporate fill as needed. LinkedIn accepts a wide range of backgrounds; your brand guidelines matter more than this swatch.',
      },
      {
        question: 'How should I handle group photos?',
        answer:
          'This page is optimized for single-subject headshots. For groups, cut individuals separately when possible, or use the all-purpose tool and accept more manual Erase between people. Overlapping shoulders are hard for any salient model.',
      },
      {
        question: 'Can HR store the PNG on a server after export?',
        answer:
          'Yes — that is your organization choice after the local cutout. The privacy win is avoiding a remover vendor. Apply your normal access controls to the exported masters.',
      },
    ],
  },
  'bgremover-jewelry': {
    eyebrow: 'Macro metalwork',
    h2: 'Jewelry macros without uploading sparkle IP',
    lead:
      'Reflective stands and glitter backgrounds confuse cloud removers and leak design IP. This preset keeps transparency and points you to Smart Erase for stands, with WebP for light gallery pages. Suggest Refine stays off so micro highlights on metal are not chewed by default. Independent jewelers and brand studios can process unreleased collections without parking macros in a remover bucket. Use PNG when a retoucher will reopen the file; WebP when the site grid only needs speed.',
    whyPreset:
      'Transparent checkers reveal whether metal edges still carry stand color. Skipping auto Refine avoids chewing micro highlights; Smart Erase is the better first cleanup. WebP as the highlighted export matches jewelry category pages that load dozens of thumbs. The tip steers operators toward stand removal without a destructive peel.',
    workflowTip:
      'AI first, Smart Erase the stand and labels, zoom to inspect prongs, optional light Erase on glitter dust, export WebP for site grids or PNG for print comps. For gemstones with partial transparency, Restore at low opacity and accept imperfect glass rather than inventing pixels. Keep a polarized original when possible; it reduces specular chaos before you ever cut.',
    privacyNote:
      'Unreleased collections are high-value IP. Local cutouts mean those macros never sit in a remover bucket waiting for a breach narrative. NDA shoots for retailers can finish mattes on the same laptop that tethered the camera. Still watermark public comps if your contract requires it; local processing does not replace contractual controls.',
    scenarioH2: 'Pre-launch jewelry grids without a cloud gallery leak',
    scenarioBody:
      'Open this preset when a lookbook grid needs clean silhouettes but the collection is still embargoed. Cut each macro on checkers, erase stands, export WebP for the staging site, and keep PNG for print partners. If a retailer demands white, flip the swatch only for that export — do not destroy the transparent master. For mixed metal and softbox reflections, prefer careful Erase over Refine so highlight shape survives.',
    edgesH2: 'Prongs, chains, and stand color on metal edges',
    edgesBody:
      'Jewelry edges fail when stand color stains gold or when chains break into dashed alpha. Zoom prongs and clasp tips first. Smart Erase the stand, then soft-Erase color fringing along metal. Restore broken chain links carefully. Avoid Refine unless a fur-like fringe of glitter dust needs a peel. Confirm on checkers that specular peaks still look like metal, not matte plastic.',
    faqs: [
      {
        question: 'Why suggest WebP for jewelry?',
        answer:
          'Product grids load faster with WebP while PNG remains available for lossless edits. Choose PNG when a retoucher will reopen the file. If a CMS rejects WebP, re-export PNG from the same session without re-running AI.',
      },
      {
        question: 'Glass and gems look incomplete — now what?',
        answer:
          'Semi-transparent stones are hard for any salient model. Restore at low opacity along gem edges, accepting partial alpha. For museum-grade glass, combine with a manual path elsewhere. Shooting against a contrasting seamless still helps more than any brush.',
      },
      {
        question: 'Should I Refine sparkly dust automatically?',
        answer:
          'Usually no on this preset. Dust often looks like part of the sparkle story. Erase only what is clearly backdrop paper. If dust is truly unwanted, soft Erase beats a global Refine that also dulls metal.',
      },
      {
        question: 'Can I cut jewelry on a model’s hand?',
        answer:
          'You can isolate hand plus jewelry as one subject, but separating ring from skin is a different retouching problem. This tool removes the backdrop behind the hand. For floating product-only shots, photograph on a stand instead.',
      },
      {
        question: 'Does transparent preview hide warm color casts?',
        answer:
          'Checkers show alpha, not white balance. Correct color before or after cutout in your raw pipeline. A green stand reflection on yellow gold is an edge contamination issue — Erase the fringe after AI.',
      },
    ],
  },
  'bgremover-apparel': {
    eyebrow: 'Flat lay apparel',
    h2: 'Apparel flats ready for lookbook mocks',
    lead:
      'Hangers, pins, and table paper ruin ghost-mannequin pipelines. Gradient preview helps you judge silhouette drama while Refine cleans hems before PNG handoff to design tools. Apparel brands can process seasonal samples without uploading confidential fits to a shared remover. This page accelerates the privacy-sensitive cutout stage; neck joining and interior fills still happen in your retouching app. Use it for flats and hangers, not for on-model full fashion editorials with complex overlaps.',
    whyPreset:
      'Gradient mock backgrounds expose leftover table tones better than pure white for fashion comps. Refine on hems reduces stairsteps before Figma. PNG is the handoff format designers expect. The tip sequences Smart Erase for hangers before Refine so you do not peel the wrong object first.',
    workflowTip:
      'Remove hangers with Smart Erase, Refine along hems and sleeves, Move the garment for crop balance, export PNG into your ghost-mannequin or lookbook file. Iron before you shoot; software cannot invent crisp fabric. For asymmetrical hems, zoom both sides so left and right softness match.',
    privacyNote:
      'Seasonal samples are confidential. Processing on-device keeps sample photography out of shared remover histories used across unrelated brands. Agencies juggling multiple labels can keep each cutout on the correct client laptop. Apply your usual watermark policy on external proofs after export.',
    scenarioH2: 'Lookbook flat lays before ghost-mannequin assemble',
    scenarioBody:
      'Use this preset when a stack of hanger shots must become clean PNGs for the mannequin team. Cut on gradient so leftover table paper shows, erase hardware, Refine hems once, export PNG, and hand off. If e-commerce also needs white, generate a second JPG-white from the same matte rather than re-uploading to another tool. For knitwear, prefer Restore on fuzzy hems instead of a second Refine that collapses the halo you want. Seasonal sample rooms often forbid cloud tools; this route keeps embargoed fits on the same laptop that tethered the camera, which matters when multiple labels share one agency floor.',
    edgesH2: 'Hems, sleeve cuffs, and hanger hardware on apparel',
    edgesBody:
      'Apparel edges concentrate on hems, cuffs, and stray pins. Smart Erase hangers and clips first. Refine once along long hem curves. Restore any cuff that vanished into alpha. Soft Erase paper crumbs in lace holes without punching through the fabric pattern. Gradient preview helps you see whether the silhouette feels campaign-ready before you drop it on a typed layout. Match left and right sleeve softness so the garment does not look lopsided in a lookbook grid, and check belt loops for leftover table tone before you call the matte done.',
    faqs: [
      {
        question: 'Is this a full ghost-mannequin tool?',
        answer:
          'It removes the backdrop and hanger clutter. Neck joining and internal garment fill still happen in your retouching app. This page accelerates the privacy-sensitive cutout stage. Pair with your existing mannequin SOP rather than replacing it.',
      },
      {
        question: 'What about wrinkled fabric edges?',
        answer:
          'AI follows the outer silhouette. Use soft Erase for fabric crumbs and Restore if a cuff disappears. Ironing before shoot still beats any brush later. Steam on set is cheaper than an hour of edge cleanup.',
      },
      {
        question: 'Can I cut garments on a live model?',
        answer:
          'You can remove the room behind a model, but hair and fingers overlapping fabric need portrait-style care. For clean pack shots, prefer flats or invisible mannequin photography. Mixed fashion editorials may need manual path work beyond this tool.',
      },
      {
        question: 'Why gradient instead of white for fashion?',
        answer:
          'Gradient reveals leftover table tone and helps art directors judge drama. White is still one click away for marketplace exports. Starting on gradient reduces the chance you approve a muddy edge that only shows on colored plates.',
      },
      {
        question: 'PNG for Canva and Figma — any limits?',
        answer:
          'PNG with alpha imports cleanly into both. Mind file size for large apparel frames; downsample for layout comps and keep a full-res master for print. WebP is optional if your design tool accepts it.',
      },
    ],
  },
  'bgremover-social': {
    eyebrow: 'Sticker velocity',
    h2: 'Story stickers without another cloud app',
    lead:
      'Creators churn cutouts for Stories and Reels. Black preview plus WebP keeps contrast high and files light, while Refine prevents crunchy sticker edges on busy video frames. Influencers and social teams avoid stacking another face-adjacent SaaS that might train on selfies. This route optimizes for sticker lips and upload budgets, not for marketplace pure white. Keep PNG only when a designer will reuse the asset in a larger campaign system.',
    whyPreset:
      'Black preview mimics dark story canvases so halo shows early. WebP export hint matches social upload budgets better than giant PNG stickers. Refine is suggested because sticker edges are judged harshly on motion backgrounds. The tip reminds creators that file weight matters when posting from mobile later.',
    workflowTip:
      'Cut out, Refine once for a clean sticker lip, Move to center if needed, export WebP, import into your story tool. Keep PNG only when a designer will reuse the asset. Crop tighter before AI if the subject is small in frame — social stickers should read at phone scale. Avoid ten Refine passes; one plus soft Erase is enough.',
    privacyNote:
      'Selfie-based stickers are personal. Local AI avoids stacking another social-adjacent SaaS that mirrors your face into training sets. Creator collectives can process on personal devices without a shared brand remover login. Still think twice before publishing faces of minors or private events even after a clean cutout.',
    scenarioH2: 'Same-day Reel sticker packs from phone selects',
    scenarioBody:
      'Open this preset when you need five to twenty stickers before a premiere. Airdrop or cable selects to the laptop, cut on black, Refine once, export WebP, and drop into the story editor. If an app rejects WebP, re-export PNG without redoing the matte. For branded emoji-style stickers, prefer hard edges and less Restore than you would use on a portrait composite. Keep a simple naming pattern with episode or drop codes so collaborators do not paste yesterday’s face pack into tonight’s premiere story by mistake.',
    edgesH2: 'Sticker lips against dark story canvases',
    edgesBody:
      'Social edges should read as a deliberate sticker lip. After Refine, zoom high-contrast boundaries like hats and phone cases. Soft Erase jaggy stair steps. On black, leftover studio gray glows — remove it. Do not over-Restore translucent hair if the sticker will sit on chaotic video; slightly cleaner edges often survive motion better. Export WebP when the lip looks good at 50 percent zoom, the size viewers actually see. If the sticker will bounce or spin in a Reel, slightly thicker edges usually hold up better than ultra-soft portrait mattes.',
    faqs: [
      {
        question: 'Will WebP work in every story app?',
        answer:
          'Most modern mobile apps accept WebP. If an app rejects it, re-export PNG from the same session — the matte is already done and still local. Test one sample in your target app before batching twenty exports.',
      },
      {
        question: 'How do I avoid jagged sticker edges?',
        answer:
          'One Refine pass plus a soft Erase along high-contrast boundaries usually fixes jaggies. Zoom in; social viewers see edges more than you expect. Match edge softness to the final video background brightness.',
      },
      {
        question: 'Can I animate the cutout after export?',
        answer:
          'Yes. Export PNG or WebP and animate in your motion tool. This page only builds the matte. Keep a higher-resolution PNG if you will scale the sticker up in 4K timelines.',
      },
      {
        question: 'Is black preview mandatory for colorful subjects?',
        answer:
          'It is the default for halo hunting. Flip to white or transparent if black swallows a dark hoodie edge. The export does not embed the black field unless you choose JPG with that background active.',
      },
      {
        question: 'What about meme formats with text already in frame?',
        answer:
          'If text is part of the subject photo, it will stay inside the silhouette. For clean stickers, shoot or crop text separately and add typography in the story tool after cutout.',
      },
    ],
  },
  'bgremover-transparent-png': {
    eyebrow: 'Alpha-first design',
    h2: 'True transparent PNG for design systems',
    lead:
      'Designers need honest alpha, not a JPEG pretending to be cut out. Checkerboard preview and PNG-lossless export make this page a local drop-in for Figma, Photoshop, and Canva pipelines. Suggest Refine stays off by default so hard graphic shapes and logos are not over-peeled. Brand teams can matte unreleased UI chrome and marketing stills without training a public remover on system assets. Use other presets when marketplace white or sticker lips are the primary job.',
    whyPreset:
      'Leaving Refine off by default avoids over-peeling hard graphic shapes. Designers can still Refine manually when photos need it; vectors and logos often should not. Checkerboard plus PNG is the classic alpha-honest pair. The tip equates checkers with true alpha so juniors do not mistake a white JPG for a cutout.',
    workflowTip:
      'Drop the asset, confirm checkers show clean alpha, skip Refine for hard logos, use Refine only on photo subjects, then Download PNG into your design file. Name files with @2x discipline if they feed a design system. For mixed photo and UI, cut pieces separately rather than forcing one matte to do everything.',
    privacyNote:
      'Brand kits and unreleased UI chrome should not train a public remover. On-device mattes keep those system assets inside the laptop. Agencies can process client A on a machine that never logs into a shared SaaS used for client B. Version control the PNG masters like any other design source.',
    scenarioH2: 'Design-system stills that must stay lossless alpha',
    scenarioBody:
      'Use this preset when a designer needs a true transparent master for Figma components or Photoshop comps. Import, verify checkers, avoid Refine on hard edges, export PNG, and place into the library. If a photo subject needs a peel, Refine manually once and document it in the file name. For marketing sites that prefer WebP delivery, generate WebP later from the PNG master in your build pipeline rather than skipping the lossless archive. Treat the PNG like source code: version it, review it, and never replace it with a flattened JPG that only looked fine in one mock.',
    edgesH2: 'Hard logos versus photo subjects on checkers',
    edgesBody:
      'Design edges split into two families. Hard logos want crisp alpha and almost never want Refine. Photo subjects may need one peel plus Restore on hair or fabric. On checkers, look for semi-transparent sludge that will muddy typed layouts. Erase sludge; do not paint white into the alpha and call it done. Export PNG only when the checker pattern reads clean at 100 and 200 percent zoom. If the asset will sit on both light and dark app themes, flip proof swatches once so fringe does not only look acceptable on a single plate.',
    faqs: [
      {
        question: 'Does PNG stay lossless here?',
        answer:
          'Yes. The PNG export path writes standard lossless PNG with the computed alpha channel. We do not recompress with a lossy step on that button. Downstream tools might recompress if you re-export again elsewhere — archive the first PNG.',
      },
      {
        question: 'Can I use this for logo cleanup?',
        answer:
          'For photo-based marks, yes. For already-vector logos, prefer editing the source SVG. This tool shines when you only have a raster with a busy plate. Recreating a clean vector later still beats forever shipping a soft photo logo.',
      },
      {
        question: 'Why is Refine off by default for designers?',
        answer:
          'Hard edges and UI chrome often look worse after an automatic peel. Photo cutouts can still use Refine manually. Other presets turn the suggestion on when their audience expects it.',
      },
      {
        question: 'Will Canva preserve the alpha?',
        answer:
          'Modern Canva imports respect PNG transparency. If a project unexpectedly shows a white box, re-download PNG and confirm you did not flatten earlier. Keep originals outside Canva when brand archives matter.',
      },
      {
        question: 'How do I handle shadows I want to keep?',
        answer:
          'Natural contact shadows may be removed with the backdrop. Recreate soft shadows in your design tool under the PNG for consistency across a system. Trying to preserve dirty floor shadows usually fights the matte.',
      },
    ],
  },
  'bgremover-cars': {
    eyebrow: 'Vehicle inventory',
    h2: 'Dealership cutouts without lot-camera uploads',
    lead:
      'Vehicle photos arrive cluttered with lot cones, rival badges, and messy sky. This preset starts on navy so chrome trim and mirror edges show halo before you export a filled JPG for inventory cards. Dealership marketing teams keep unreleased allocations and VIN plates off cloud removers. Suggest Refine helps once along body lines without chasing every antenna wire into oblivion. Use marketplace-white when a portal demands pure white; use cars when navy QA and JPG-with-background match your brochure system.',
    whyPreset:
      'Navy preview exposes chrome halo that white sometimes hides on silver paint. JPG-bg export matches inventory cards that already assume a solid studio field. Refine is suggested because car silhouettes benefit from one controlled peel along mirrors and spoilers. The tip names chrome deliberately so operators know what to inspect first.',
    workflowTip:
      'Shoot three-quarter angles with the car filling the frame. Run AI, inspect mirrors and grille on navy, Refine once, Smart Erase lot debris, then export JPG with the chosen fill. Keep a PNG if design will place the car on a lifestyle plate later. For wrap details, zoom decals so Refine does not shave lettering.',
    privacyNote:
      'Lot photography can reveal inventory counts, dealer compounds, and plate-like stickers. Local cutouts keep those frames off remover CDNs used by random staff accounts. Still blur plates if public marketing policy requires it — the matte tool does not replace plate hygiene. OEM preview cars under embargo especially benefit from on-device processing.',
    scenarioH2: 'Inventory card batches for dealer sites and print',
    scenarioBody:
      'Open this preset when a weekend arrival batch needs clean heroes for the dealer site. Process each three-quarter shot on navy, erase cones and rival signs, Refine once on mirrors, export JPG-bg into the inventory CMS, and archive PNG only for campaign comps. Keep lighting direction consistent across the batch so cutouts feel like one studio day. If a marketplace listing needs pure white, regenerate from the same matte with the white swatch rather than re-uploading elsewhere.',
    edgesH2: 'Chrome mirrors, grilles, and antenna tips on navy',
    edgesBody:
      'Car edges fail around mirrors, grille mesh, and thin antennas. On navy, bright halo on chrome is obvious — Erase it without eating the highlight shape. Refine once along the body shoulder. Restore grille gaps if AI filled them incorrectly, or Erase sky holes carefully. Wheel arches often hide lot gravel; soft-Erase stones without nicking tires. Export JPG-bg when the silhouette survives a full-screen navy stare and a quick white flip check.',
    faqs: [
      {
        question: 'Should dealership mains always be pure white?',
        answer:
          'Many portals prefer white, but brochure systems often use branded fills. This preset QA starts on navy and exports JPG with background so you can pick a fill that matches your template. Switch to white when a specific channel demands it.',
      },
      {
        question: 'How do I handle reflections of other cars?',
        answer:
          'Reflections on panels are part of the paint, not the backdrop. Do not Erase them as background. Only remove backdrop visible around the silhouette. Fix distracting reflections in a retouching app if brand guidelines require it.',
      },
      {
        question: 'Can convertibles with complex interiors cut cleanly?',
        answer:
          'Open tops expose busy interiors that the model may treat inconsistently. Shoot with the top up when possible, or accept manual Erase around roll bars. Interior cleanup is separate from backdrop removal.',
      },
      {
        question: 'Why JPG-bg instead of PNG for cars?',
        answer:
          'Inventory cards usually want a filled rectangle, not alpha. PNG remains available if your designer needs a lifestyle composite. Highlighting JPG-bg reduces mistaken transparent uploads into CMS fields that expect a solid image.',
      },
      {
        question: 'Do night lot photos work?',
        answer:
          'Low contrast hurts any matte model. Add light or shoot at dusk with cleaner separation. If you must use night frames, expect more Smart Erase and accept softer edges on distant trim.',
      },
    ],
  },
  'bgremover-food': {
    eyebrow: 'Menu and editorial food',
    h2: 'Plated cutouts that never leave the kitchen laptop',
    lead:
      'Food photography is full of crumb-strewn tables, branded trays, and kitchen clutter you do not want in a cloud bucket. This preset uses a wine swatch so plate-edge crumbs and sauce halos show before WebP export for menu grids. Restaurants, ghost kitchens, and cookbook teams keep unreleased recipes and venue interiors local. Suggest Refine helps garnish tips without pulverizing steam or sesame texture when you stay disciplined with a single pass.',
    whyPreset:
      'Wine preview reveals pale plate crumbs that vanish on white and muddy on checkers. WebP keeps menu pages and delivery apps lighter than giant PNG heroes. Refine is on because herb edges and citrus zest need a soft peel more often than not. The tip trains staff to look at the plate rim before they celebrate the AI pass.',
    workflowTip:
      'Shoot overhead or forty-five with the plate dominant. Run AI, inspect the rim on wine, Refine once for garnish tips, Smart Erase tray logos, export WebP for the menu CMS. Keep PNG when a print cookbook needs lossless. Wipe real crumbs on set when you can — fewer crumbs means less Erase.',
    privacyNote:
      'Kitchen photos leak staff faces, ticket systems, and unfinished R&D plating. Local inference keeps those frames off consumer remover accounts on shared iPads. Franchise brands can standardize this preset URL in their photography SOP without negotiating another SaaS DPA. Still follow health-marking rules for public menu images after export.',
    scenarioH2: 'Menu relaunch grids from a single kitchen shoot day',
    scenarioBody:
      'Use this page when a chef and photographer just shot forty plates and the site needs cutouts tonight. Work plate by plate on wine, erase tray edges, Refine once on herbs, export WebP into the menu builder, and store PNG only for the dishes headed to print. Keep naming by POS item ID to avoid swapping spicy and mild variants. If delivery apps demand white, flip swatches for those exports without redoing AI.',
    edgesH2: 'Plate rims, herb tips, and sauce halo on wine',
    edgesBody:
      'Food edges live at the ceramic rim and at tiny garnish extremities. On wine, flour dust and sesame outside the plate glow — Erase them. Refine once to feather herb tips. Restore a lemon twist if AI clipped it. Avoid chasing steam; translucent vapor rarely belongs in a hard sticker-like matte. Confirm the plate circle is unbroken before export so menu grids align consistently.',
    faqs: [
      {
        question: 'Will wine preview change how food colors look?',
        answer:
          'It is a QA field only. Subject colors stay the same in WebP or PNG exports unless you intentionally export JPG while wine is selected as the background. Always do a final color check on white or neutral gray if print is involved.',
      },
      {
        question: 'How should I treat shadows under the plate?',
        answer:
          'Many menus prefer a floating plate with a synthetic soft shadow added later. If you need a natural shadow, you may have to composite a separate shadow layer because backdrop removal often kills floor contact. Decide the style before you batch.',
      },
      {
        question: 'Can I cut a full table scene with multiple dishes?',
        answer:
          'You can remove the room behind a group, but overlapping plates confuse silhouettes. For clean item grids, shoot and cut dishes individually. Family-style hero photos may be better as cropped lifestyle frames without a full matte.',
      },
      {
        question: 'Why WebP for menus?',
        answer:
          'Menu pages load many images. WebP reduces weight while looking sharp on phones. Keep PNG for print partners who reject WebP. Re-export from the same matte when needed.',
      },
      {
        question: 'Do shiny sauces break the matte?',
        answer:
          'Specular sauce highlights can look like holes if the backdrop peeks through inconsistently. Restore gently along the sauce edge and avoid over-refining. Polarized lighting on set reduces the problem more than brushes later.',
      },
    ],
  },
  'bgremover-real-estate': {
    eyebrow: 'Listing heroes',
    h2: 'Property heroes without uploading house interiors',
    lead:
      'Real estate marketing often needs a clean subject — an agent, a key prop, or a staged object — extracted from a busy room without sending the entire interior to a cloud remover. This preset uses a lavender mock so crop balance for MLS-adjacent heroes is easy to judge, skips auto Refine to protect architectural lines, and highlights JPG-bg for portal-ready filled frames. Agents and brokerages keep unlisted addresses and security-system glimpses local during the cutout stage.',
    whyPreset:
      'Lavender mock helps art directors judge listing hero balance without pretending every portal is pure white. Suggest Refine stays off because architecture and furniture edges often suffer from automatic peels. JPG-bg matches brochure and many portal templates that expect a rectangle with a fill. The tip names MLS hero crops so the intent is unmistakable.',
    workflowTip:
      'Decide what the subject is before you import — agent portrait, key prop, or exterior object. Run AI, inspect on lavender, use Smart Erase for clutter, Refine only manually if a soft subject needs it, export JPG with background for the portal template. Keep PNG when design will collage multiple listings. Never rely on cutout alone to hide confidential documents on tables; remove them in-frame first.',
    privacyNote:
      'Interiors reveal layouts, valuables, and sometimes family photos. Local processing reduces the chance those frames sit in a remover history tied to a random contractor login. Brokers can require on-device cutouts in vendor guidelines. Still follow fair-housing and listing-accuracy rules for anything you publish after export.',
    scenarioH2: 'Broker collage heroes and agent composites for campaigns',
    scenarioBody:
      'Open this preset when marketing needs an agent cutout or a staged prop on a branded lavender-to-custom field. Import, erase room clutter, skip automatic Refine on hard architecture, export JPG-bg into the campaign layout, and archive PNG for future recompositions. For true whole-room listing photos, you usually should not cut out the room at all — shoot and correct the space instead. This route shines when a person or object must float on a design plate without leaking the original address backdrop.',
    edgesH2: 'Architecture lines versus soft subjects in listing frames',
    edgesBody:
      'Real-estate edges split between hard architecture and soft people. Keep Refine off for door frames, railings, and countertops; Smart Erase clutter instead. For agent hair and clothing, Refine manually once if needed. On lavender, leftover wall tone is easy to spot along shoulders. Export JPG-bg when the subject sits comfortably in the crop the portal template expects, with no room signage left in the alpha holes.',
    faqs: [
      {
        question: 'Should I remove backgrounds from entire room listing photos?',
        answer:
          'Usually no. Buyers need spatial context. Use this tool for agent heads, props, or objects that will sit on designed marketing plates. Whole-room images belong in color correction and staging workflows instead.',
      },
      {
        question: 'Why is Refine off for real estate?',
        answer:
          'Automatic peels can stair-step railings and window mullions. Soft portrait subjects can still use Refine manually. The default protects the architectural case that is common on this route.',
      },
      {
        question: 'Can I match a brokerage brand color as the fill?',
        answer:
          'Yes. After cutout, pick a custom color close to brand guidelines and export JPG with background. For exact hex fidelity, composite the PNG in your design tool onto a brand swatch layer.',
      },
      {
        question: 'How do I avoid leaking mailbox numbers?',
        answer:
          'Remove or blur identifying numbers in the original frame before cutout when policy requires it. A matte does not guarantee privacy if the subject itself contains sensitive text. Local processing only stops the upload hop.',
      },
      {
        question: 'Is lavender required by MLS systems?',
        answer:
          'No. Lavender is a QA mock for crop balance. Export whatever fill your template needs. Many portals want photographic exteriors, not cutouts — use the right asset type for the field.',
      },
    ],
  },
  'bgremover-id-photos': {
    eyebrow: 'Document-adjacent prep',
    h2: 'Even white ID fields without a biometric upload',
    lead:
      'ID-style photos demand an even white field and careful edges around hair and collars, but uploading faces to a consumer remover is a poor privacy trade. This preset locks pure white, suggests one soft Refine, and highlights JPG-white for forms that reject transparency. Travelers, HR teams, and studios can prep candidates locally. This is not a government-certified capture booth — it is a private editor that helps you approach common white-background expectations. Always read the specific document authority rules for size, pose, and expression.',
    whyPreset:
      'Pure white is the visual language of many ID and passport-adjacent briefs. Suggest Refine once softens jagged hair against white without a harsh second peel. JPG-white matches form uploads that want a solid field. The tip restates even white plus soft Refine so operators do not treat this like a creative sticker page.',
    workflowTip:
      'Crop to the required head size guidance from your authority first when possible. Run AI on white, Refine once, soft-Erase leftover wall tone, export JPG-white, then verify pixel dimensions in an external tool if the form is strict. Do not add fashion color fills for true ID submissions. Keep a PNG only for your own archive if you may need to re-export.',
    privacyNote:
      'Faces prepared for identity documents are sensitive. On-device inference avoids giving a remover SaaS a clean biometric-looking image. Employers running badge photo days can keep processing inside managed browsers. You still must protect the exported JPG according to HR policy — local cutout is one control, not the whole program.',
    scenarioH2: 'Badge and passport-style white fields on a managed PC',
    scenarioBody:
      'Use this preset when HR or a travel desk must replace a busy office backdrop with even white before a portal upload. Import the framed portrait, stay on white, Refine once, confirm no gray ring, export JPG-white, and run your dimension checklist. If the authority forbids digital alteration beyond background, consult policy before using any AI matte — some contexts require a physical white backdrop only. When digital replacement is allowed, local processing is the least invasive technical path.',
    edgesH2: 'Hair against pure white and collar separation for ID frames',
    edgesBody:
      'ID edges must survive tiny display sizes. After Refine, zoom hair against white and Erase gray rings. Keep collar lines clean so jackets do not melt into the field. Avoid heavy Restore that creates fuzzy halos rejected by automated checks. Glasses should not hold room reflections that reveal the old office. Export JPG-white only after a full-screen white stare and a downscaled preview that mimics the form thumbnail.',
    faqs: [
      {
        question: 'Is this approved for official passport submissions?',
        answer:
          'No blanket approval. Rules vary by country and can restrict digital background replacement. Use this tool only when your authority allows a digital white field, and always meet pose, size, and expression requirements separately.',
      },
      {
        question: 'How is this different from the headshots preset?',
        answer:
          'Headshots start on blush and optimize for LinkedIn-style creative plates. ID photos start on pure white with JPG-white emphasis for document-adjacent fields. Pick the route that matches the acceptance criteria.',
      },
      {
        question: 'Can I wear glasses in the cutout?',
        answer:
          'Follow the document rules first. Technically, Restore frames if AI notches them, and Erase strong reflections. Some authorities restrict glasses entirely — the tool cannot override that policy.',
      },
      {
        question: 'What if my shirt is white on white?',
        answer:
          'Shoot against a light gray temporary backdrop, cut out, then place on pure white. Soft Erase along the shirt edge so it does not dissolve. Slight contrast on capture beats heroic brushing later.',
      },
      {
        question: 'Does JPG-white compress faces too much?',
        answer:
          'Use a high-quality export and verify the portal file-size limits. If compression artifacts appear, retry or use your design tool to encode carefully from a PNG master. Never upscale a tiny source and expect ID clarity.',
      },
    ],
  },
  'bgremover-stickers': {
    eyebrow: 'Print die-cuts',
    h2: 'Die-cut sticker masters without a cloud print portal',
    lead:
      'Sticker makers need clear outlines for vinyl cutters and proof sheets, not another upload to a random design SaaS. This preset uses a teal mock so the die-cut silhouette reads against a print-shop-friendly field, leaves Refine off for hard graphic shapes, and highlights PNG for cut-path workflows. Shops can process customer photos and original art on local machines under NDA. Use the social preset when the destination is a Story lip; use stickers when physical die-cut proofing is the job.',
    whyPreset:
      'Teal mock shows whether the outline will read on a proof sheet before you waste vinyl. Skipping auto Refine protects hard sticker art and bold typography. PNG keeps alpha for cutter software and Canva sheets. The tip equates teal with die-cut proofing so staff do not treat this like a white marketplace page.',
    workflowTip:
      'Import art or photo, confirm the outline on teal, Smart Erase stray background, skip Refine for vector-like shapes, Refine once only for photo subjects, export PNG into your cutter or sheet layout. Add stroke borders in the cutter app if your product line needs a white edge. Keep file naming tied to SKU for reprints.',
    privacyNote:
      'Customer-supplied stickers can include kids, logos under trademark, and unreleased merch. Local cutouts keep those files off shared online design tools. Shops should still store exports under their normal order privacy policy. Public model weights download once; order photos do not upload during inference.',
    scenarioH2: 'Vinyl cutter queues and proof sheets for sticker SKUs',
    scenarioBody:
      'Open this preset when a print queue needs PNG masters with clean alpha. Process each design on teal, erase backdrop junk, avoid Refine on hard titles, export PNG, and drop into the cutter software. For photo stickers, Refine once and inspect at physical print scale if possible. If a marketplace also needs white product shots of the sticker itself, photograph the printed sticker separately — do not confuse the master art matte with packaging photography.',
    edgesH2: 'Bold outlines, white borders, and photo sticker lips',
    edgesBody:
      'Die-cut edges should be intentional. Hard graphic stickers want crisp alpha; Erase dust without feathering type. Photo stickers may need one Refine and a deliberate lip. On teal, leftover gray rings mean the cut may look dirty on clear vinyl — remove them. If you need a white border, add it in the cutter workflow around a slightly contracted cut path rather than painting randomly into the matte. Export PNG when the outline looks correct at 100 percent and at a downscaled proof size.',
    faqs: [
      {
        question: 'Will PNG work with my vinyl cutter software?',
        answer:
          'Most cutter ecosystems accept PNG with alpha or convert from it. If your tool wants SVG, trace in a vector app from the PNG carefully. This page builds the raster matte; path tracing remains a separate step when required.',
      },
      {
        question: 'Why teal instead of black for stickers?',
        answer:
          'Teal approximates many proof-sheet vibes and reveals both dark and light fringe. Black is still available via swatches if you prefer social-style contrast. Pick what makes halo obvious for your art.',
      },
      {
        question: 'Should I Refine bold typography stickers?',
        answer:
          'Usually no. Refine can soften letter corners. Prefer Smart Erase for backdrop only. Photo-based stickers are the case for a single Refine pass.',
      },
      {
        question: 'Can I create kiss-cut sheets here?',
        answer:
          'You create individual transparent masters. Sheet layout, registration marks, and kiss-cut paths happen in your imposition or cutter software. Export consistent PNG sizes to make nesting easier.',
      },
      {
        question: 'How do transparent stickers differ in QA?',
        answer:
          'Clear vinyl shows any dirty matte immediately. Be stricter on teal: no gray sludge, no holes in solid fills. White vinyl is more forgiving but still benefits from clean alpha.',
      },
    ],
  },
  'bgremover-youtube-thumbs': {
    eyebrow: 'Thumbnail contrast',
    h2: 'Thumbnail cutouts that keep channel faces local',
    lead:
      'YouTube thumbnails live or die on contrast, face scale, and prop clarity. This preset starts on plum so cutouts are judged against a thumb-like field, suggests Refine for hair and mic edges, and highlights JPG-bg for final thumbnail layouts. Creators avoid uploading recognizable channel faces to yet another cloud editor. Use social WebP stickers for Stories; use this route when the deliverable is a filled thumbnail rectangle destined for YouTube.',
    whyPreset:
      'Plum canvas mimics the saturated contrast many thumbnails chase, revealing halo before you drop the subject onto explosive typography. JPG-bg matches how thumbs are usually flattened for upload. Refine helps once around hair, hands, and microphone foam. The tip names thumb contrast so the widget state matches creator vocabulary.',
    workflowTip:
      'Shoot or select a frame with a large face or prop. Run AI, inspect on plum, Refine once, Erase leftover room, export JPG with a bold fill or composite the PNG in your thumb template with big type. Keep faces large enough to read on mobile. Avoid tiny subjects that disappear after cutout.',
    privacyNote:
      'Channel faces and unreleased video stills are business-critical. Local cutouts keep those frames off consumer remover histories. Teams with multiple editors can standardize this preset without sharing a SaaS workspace full of face PNGs. Still secure your drive where thumbnail PSDs live after export.',
    scenarioH2: 'Same-week thumbnail batching for a upload calendar',
    scenarioBody:
      'Use this preset when you batch thumbs for a week of uploads. Cut each host or prop on plum, Refine once, export JPG-bg or PNG into your thumb template, and add type last. Keep a consistent light direction so the channel look holds. If a video is embargoed, local processing means the still never appears in a shared remover account before publish time. Reuse mattes carefully when episodes share the same wardrobe setup. Build a small swipe file of approved face crops so last-minute title changes do not force a full recut every time.',
    edgesH2: 'Mic foam, hair pops, and prop outlines for thumbs',
    edgesBody:
      'Thumbnail edges must read at tiny scale. After Refine, zoom mic foam and hair pops — Erase backdrop rings that will sparkle against saturated type. Prop outlines should be slightly bold; soft sludge disappears on mobile. On plum, green-screen leftovers are obvious if you shot that way — clean them fully. Export when the subject still pops at a 320-pixel wide preview, not only at full resolution. If bright yellow titles will sit behind the subject, flip to a light proof briefly so dark fringe does not vanish only on plum.',
    faqs: [
      {
        question: 'Should thumbnail backgrounds stay transparent?',
        answer:
          'Usually no for the final YouTube upload. Flatten onto a high-contrast designed plate. Keep PNG masters if you will rebuild thumbs later with new type. This preset highlights JPG-bg because most finals are filled rectangles.',
      },
      {
        question: 'Can I cut multiple people for one thumb?',
        answer:
          'Yes, but overlapping figures need more Erase between shoulders. Cutting separately and compositing often looks cleaner for big reaction thumbs. Watch scale so one face does not dwarf the other unintentionally.',
      },
      {
        question: 'Why plum instead of red or blue?',
        answer:
          'Plum is a strong mid-contrast QA field in the allowlisted swatches and differs from other presets. You can switch to any swatch for personal taste after the matte is clean. Final thumb colors come from your template anyway.',
      },
      {
        question: 'Does Refine help with gaming headset edges?',
        answer:
          'One pass can help, but headsets have thin rods and transparent mics that need Restore and Erase. Zoom the boom arm carefully. Accept that tiny headset details may need manual finishing for premium channels.',
      },
      {
        question: 'Will YouTube compress away my edge work?',
        answer:
          'YouTube recompresses thumbs, so prefer slightly stronger edges over ultra-soft film mattes. Check the uploaded preview on a phone. If edges vanish, increase subject scale more than you increase Refine count.',
      },
    ],
  },
  'bgremover-marketplace-white': {
    eyebrow: 'Cross-channel white',
    h2: 'One white QA pass for many marketplace feeds',
    lead:
      'Sellers juggling eBay, Walmart, and general marketplace feeds need a shared white-field QA habit without maintaining five SaaS accounts. This preset locks white preview, leaves Refine optional for mixed catalogs, and highlights WebP when portals accept modern formats for faster syncs. Operations teams keep unpublished catalog drops local during cutout. Use Amazon or ecommerce routes when those channels own the brief; use marketplace-white when the job is a multi-portal white silhouette with lighter delivery files.',
    whyPreset:
      'White QA is the common denominator across many marketplaces. Suggest Refine stays off so heterogeneous catalogs — from hard appliances to soft goods — do not all get the same automatic peel. WebP export hint targets feed speed where accepted. The tip sequences white QA before WebP so nobody exports a pretty file with dirty edges.',
    workflowTip:
      'Import the hero, confirm silhouette on white, Smart Erase stand debris, Refine manually only when fringe demands it, export WebP for accepting portals or JPG-white for stricter ones. Maintain a PNG archive for design. Document which SKUs need stricter Amazon-style Refine so staff can jump to that preset when required.',
    privacyNote:
      'Cross-channel catalogs often include gray-market-sensitive pricing comps and unreleased bundles. Local cutouts keep those frames off remover CDNs shared across freelancers. Central ops can publish this URL in the SOP wiki as the default white path. Pair with access-controlled storage after export for the actual feed files.',
    scenarioH2: 'Multi-portal catalog sync days with shared white QA',
    scenarioBody:
      'Open this preset when a single hero must feed several marketplaces before noon. Cut on white, skip automatic Refine unless fringe appears, export WebP for modern feeds, and fall back to JPG-white where a portal is picky. If an ASIN also needs Amazon-main strictness, re-check that frame on the Amazon preset rather than loosening standards here. Keep a spreadsheet of export format per channel so the team does not guess under time pressure. When freelancers rotate weekly, this baked preset URL reduces training time because the widget already announces white QA and WebP intent.',
    edgesH2: 'Universal white silhouettes across mixed SKU types',
    edgesBody:
      'Mixed catalogs fail when one edge policy is applied blindly. On white, hunt gray rings on both glossy appliances and soft plush. Hard goods often need less Refine; soft goods may need a manual peel. Erase price tags and warehouse bins left in frame. Confirm the subject still reads at marketplace grid sizes. Export WebP only after the white stare test passes — speed is useless if the silhouette looks dirty. Spot-check a downscaled grid mock before sync so thin legs or cables do not disappear at thumbnail size.',
    faqs: [
      {
        question: 'When should I use Amazon preset instead?',
        answer:
          'Use Amazon when Seller Central main-image rules are the acceptance criteria and you want Refine suggested by default. Use marketplace-white for broader multi-portal batches that prioritize white QA plus optional WebP.',
      },
      {
        question: 'Do all marketplaces accept WebP?',
        answer:
          'No. Many still want JPEG. This preset highlights WebP for channels that do accept it and for internal CDNs. Always check the portal documentation and re-export JPG-white when required.',
      },
      {
        question: 'Why is Refine not suggested here?',
        answer:
          'Mixed catalogs include items that look worse after automatic peels. Operators can still Refine manually. Channel-specific presets turn the suggestion on when their audience expects it.',
      },
      {
        question: 'Can freelancers run this without an account?',
        answer:
          'Yes. There is no VeloTools account for cutouts. Share the preset URL and your lighting SOP. Freelancers keep pixels on their machine unless you later collect exports via your own secure channel.',
      },
      {
        question: 'How do I keep brand color accuracy across portals?',
        answer:
          'Calibrate capture and judge color on a neutral proof, not only on the white matte. The remover edits alpha. Portal compression can still shift colors — verify live listings after sync.',
      },
    ],
  },
  'bgremover-screenshots': {
    eyebrow: 'Product UI docs',
    h2: 'UI window cutouts without uploading product screens',
    lead:
      'Product marketers and docs writers need clean app windows extracted from messy desktops without sending proprietary UI to a cloud remover. This preset starts on transparent checkers so window chrome and shadow decisions stay honest, suggests Refine for soft OS shadows when desired, and highlights WebP for lightweight help centers and changelogs. Security teams appreciate that unreleased admin panels never transit a third-party API during cutout. Use transparent-png when lossless design-system archival is the priority; use screenshots when docs delivery weight matters.',
    whyPreset:
      'Checkerboard proves you have real alpha around the window, not a cropped JPG with leftover wallpaper. Suggest Refine helps when you want a slightly softer OS shadow lip, while Smart Erase remains the main tool for desktop icons. WebP keeps documentation sites fast. The tip tells authors to erase icons while preserving window chrome — the classic screenshot failure mode.',
    workflowTip:
      'Capture at 1x or 2x deliberately. Import, erase desktop icons and wallpaper gaps, Refine once only if you want a softer outer lip, export WebP for docs or PNG for design critique. Avoid capturing secret data in the screenshot itself. Prefer built-in OS window shadows only when brand guidelines allow them; otherwise Erase to a hard chrome edge.',
    privacyNote:
      'UI screenshots can expose customer names, API keys, and unreleased features. Local cutouts stop an entire class of accidental SaaS uploads during the cleanup stage. Still redact sensitive strings in the original capture before you share exports. Treat help-center images as production data under your normal DLP rules.',
    scenarioH2: 'Changelog and help-center batches from staging builds',
    scenarioBody:
      'Open this preset when a release needs twenty clean UI figures. Capture staging windows carefully, cut on checkers, erase desktop clutter, export WebP into the docs repo, and keep PNG for the design critique thread. If a figure includes customer data, redact before cutout. For dark-mode UI, flip to a light proof swatch briefly to ensure chrome edges are not missing. Consistency in scale across figures matters more than perfect soft shadows.',
    edgesH2: 'Window chrome, OS shadows, and desktop icon crumbs',
    edgesBody:
      'Screenshot edges fail when wallpaper peeks along rounded corners or when icons leave crumbs. On checkers, zoom every corner radius. Smart Erase icons and menu bar junk. Decide whether the OS shadow stays; if it stays, Refine gently once for a clean lip; if not, Erase to the hard chrome. Avoid Refine on crisp UI text inside the window — you are editing the outer matte, not the pixels of the product. Export WebP when the window reads clean at article width.',
    faqs: [
      {
        question: 'Should documentation figures keep the OS shadow?',
        answer:
          'Follow brand guidelines. Soft shadows can look native but also pick up wallpaper color. Many design systems prefer a hard window edge plus a synthetic shadow in Figma. This preset lets you QA either choice on checkers.',
      },
      {
        question: 'Why WebP instead of PNG for screenshots?',
        answer:
          'Help centers load many figures. WebP reduces weight. Keep PNG when designers will zoom into chrome for critique or when lossless archival matters. Re-export from the same matte as needed.',
      },
      {
        question: 'Can I cut a multi-window composition at once?',
        answer:
          'You can, but overlapping windows are harder. Cutting each window separately and compositing usually looks cleaner for tutorials. Keep scale consistent across the set.',
      },
      {
        question: 'How do I avoid leaking PII in UI captures?',
        answer:
          'Redact in the staging data or blur before capture when possible. Cutout does not remove text inside the window. Local processing only prevents uploading the image to a remover — it does not scrub content.',
      },
      {
        question: 'Do rounded macOS corners need special care?',
        answer:
          'Yes. Zoom each corner and Erase wallpaper wedges. A one-pixel wallpaper sliver becomes obvious on light article backgrounds. Checkers make those wedges easier to see than a white proof.',
      },
    ],
  },
  'bgremover-logos': {
    "eyebrow": "Hard-edge marks",
    "h2": "Raster logos cut clean without softening a single corner",
    "lead": "Brand and marketing teams constantly inherit a logo trapped inside a JPEG screenshot, a photographed sign, or a slide export, and they need it back as a transparent PNG without redrawing the vector. This preset is tuned for that exact rescue job. It opens on a transparent checkerboard so you can judge real alpha, and it deliberately leaves automatic Refine off, because a hard wordmark or geometric emblem almost always looks worse after an edge peel that rounds crisp corners and eats thin serifs. You keep full manual control: Smart Erase for the plate, Restore for any counter that the model punched through, and a lossless PNG at the end. This is the route to reach for when the goal is a clean drop-in mark for a deck, an email header, or a partner badge, not when you are cutting a photographed product or a person.",
    "whyPreset": "Keeping Refine off by default protects the geometry that makes a logo readable. Corners, thin strokes, and letter counters survive when the tool does not feather them. The transparent grid is the honest surface for alpha work, because a white preview can hide semi-transparent sludge that later muddies a colored slide. PNG lossless is the correct export because a mark reused across sizes must not carry JPEG blocking around its edges. Together these defaults form a fingerprint clearly separate from photo-first presets that turn Refine on and celebrate soft mattes.",
    "workflowTip": "Import the frame at the largest resolution you can find, since upscaling a tiny logo later will never recover crisp edges. Let the model run, then Smart Erase the surrounding plate rather than trusting a global peel. Zoom to 200 or 300 percent and check every corner and every enclosed shape such as the hole in an letter O or A. Restore any counter the model filled by mistake. Only if the mark is a photographed object with soft edges should you apply one manual Refine. Export PNG and archive that master, then downscale copies as needed for each placement.",
    "privacyNote": "Unreleased brand marks, partnership lockups, and rebrand concepts are confidential competitive assets long before launch day. Because inference runs in local WebAssembly, those files never transit a third-party remover API and never sit in an upload retention window. Only the public model weights download once per browser profile. That lets a brand team clean a leaked-looking screenshot or a pre-announcement lockup without adding a vendor to the legal review, which is often the slowest part of any launch checklist.",
    "scenarioH2": "Rescuing a mark from a slide or a photographed sign",
    "scenarioBody": "Reach for this preset when someone hands you a logo that only exists inside a screenshot, a conference photo, or a flattened PDF export. Drop the frame in, accept the checkerboard as the truth surface, and Smart Erase the background plate instead of running an automatic peel that would soften the type. If the mark sits on a photo of a building or a booth, straighten it mentally before you cut and Restore any interior shape the model removed. Export a PNG master and keep it, because you will inevitably need the same mark at a different size next week. When the original vector eventually surfaces, prefer it, but this raster rescue keeps the project moving in the meantime without a cloud upload.",
    "edgesH2": "Corners, counters, and thin strokes on a transparent grid",
    "edgesBody": "Logo edges fail in ways that are easy to miss until the mark lands on a colored background. Watch three things on the checkerboard: sharp corners that must stay sharp, enclosed counters that must stay open, and hairline strokes that must not dissolve into partial alpha. Erase plate color without feathering the outline. If the model rounded a corner, Undo and use a tighter Smart Erase instead of a peel. Restore counters that were filled. Finally flip a proof swatch to a saturated color once, because semi-transparent sludge around a mark is invisible on white but obvious on brand blue. Export PNG only after that colored-plate check passes.",
    "faqs": [
      {
        "question": "Why is automatic Refine off for logos?",
        "answer": "Hard-edged marks look worse after an edge peel that rounds corners and feathers thin strokes. This preset keeps Refine off so geometry stays crisp, and lets you apply one manual pass only when the logo is actually a photographed object with soft edges."
      },
      {
        "question": "Can this replace recreating the vector file?",
        "answer": "For a true production logo, recreating a clean vector still wins because it scales infinitely. This tool is the fast rescue when you only have a raster copy trapped in a screenshot or photo and need a usable transparent PNG right now."
      },
      {
        "question": "How do I keep the holes inside letters transparent?",
        "answer": "Enclosed counters such as the gap in an O or A sometimes get filled by the model. Zoom in on the checkerboard, use Restore or Smart Erase to reopen those shapes, and confirm they read as transparent on a colored proof swatch before export."
      },
      {
        "question": "Which export format should I choose for a mark?",
        "answer": "Choose PNG. It is lossless and preserves clean alpha at any size, while JPEG would add block artifacts around the crisp edges. Keep the first PNG as your master and generate downscaled copies from it for individual placements."
      },
      {
        "question": "My logo screenshot is tiny — will the cutout look sharp?",
        "answer": "Cutting cannot add detail that was never captured. Start from the highest-resolution source you can find, because upscaling a small logo before or after removal only magnifies soft edges. When possible, hunt down a larger original frame first."
      }
    ]
  },
  'bgremover-packaging': {
    "eyebrow": "Retail packaging",
    "h2": "Rigid cartons and soft pouches cut on one honest white field",
    "lead": "Packaging photography crams two opposite edge problems into a single frame: dead-straight carton corners and the loose, folding walls of a stand-up pouch. A remover that peels both with the same aggression leaves either stair-stepped box seams or crushed pouch creases. This profile stages the shot on plain white, the surface a physical product hero almost always lands on, and enables one Refine suggestion so the opening pass already sits near a shelf-ready outline. A brand owner can clear a run of folding boxes, bottles, and blister packs without lodging unreleased artwork on a remover CDN, because the whole job stays inside the tab. Reach for this route when the deliverable is a white-field packaging hero, not a transparent design master or a propped lifestyle scene.",
    "whyPreset": "Plain white is the truthful proofing surface for packaging because that is the exact backdrop a product hero usually sits on, and a gray rim that disappears on a checkerboard betrays itself instantly on white. A single Refine snugs rigid corners and eases folding creases in one measured pass rather than leaving operators to guess. JPG-white is the promoted export because retail fields routinely refuse transparency and expect a solid rectangle. The tip points squarely at box seams, the failure a packaging cut trips over most, so inspection begins where it should.",
    "workflowTip": "Frame the pack tight and shoot fairly square-on so carton corners stay true rather than keystoned. Once the model finishes, Refine a single time, then magnify to 200 percent along every seam and every crease. Smart Erase a prop riser, tape tab, or bench crumb instead of stacking a second global peel that can nibble ingredient text. On flexible film, Restore any soft corner the pass clipped. Toggle white against transparent once to expose a rim that shows on only one backdrop, then save JPG on white for the shelf shot and hold a PNG if a designer will composite later.",
    "privacyNote": "Packaging artwork frequently sits under a converter or supplier confidentiality clause and is photographed weeks ahead of a public reveal. Local inference means those frames never reach an outside API or linger in a retention window; only the shared model weights fetch once. That reassures legal about where pre-reveal prototype photography lived, and it lets a contract photographer finish outlines on the very laptop that tethered the camera without stapling another vendor onto a security review.",
    "scenarioH2": "Clearing a shelf-hero run of boxes, bottles, and pouches",
    "scenarioBody": "Open this profile when a brand owner has to clear a batch of folding cartons, bottles, and stand-up pouches for a white product hero before a reveal window. Handle one pack at a time on white, treat the lone Refine as compulsory, and check seams before anyone argues about shadows. Should a channel later ask for a transparent variant for a propped composite, swap swatches and re-save a PNG from the same outline rather than re-processing. Keep panel text sharp by resisting extra Refine passes that can gnaw micro type on an ingredient list. For a family of related packs, hold lighting and framing steady so the row reads as one coordinated set instead of a patchwork of angles.",
    "edgesH2": "Rigid seams, film creases, and shrink-wrap glare on white",
    "edgesBody": "Packaging outlines break in three predictable spots: stair-stepped carton corners, gnawed pouch creases, and shrink-film glare the model misreads as backdrop. Magnify the straight seams first and confirm they stay clean lines rather than dotted alpha. On flexible packs, Restore the soft folds the peel may have ironed flat. Where glossy film catches a hot highlight, decide whether that sheen belongs to the product and Restore it if the pass punched a hole. Smart Erase bench crumbs and riser feet without cutting into printed graphics. Only save JPG-white once a full-screen white stare and a quick transparent toggle both confirm the outline holds.",
    "faqs": [
      {
        "question": "Will the white proof match my retail product page backdrop?",
        "answer": "It lines up closely with flat white fields. Proof on the white swatch, then save JPG on white for channels that refuse transparency, or save a PNG when a designer will composite later. For an off-white field, pick a custom fill after the cut instead of assuming pure white."
      },
      {
        "question": "How do I stop rigid carton corners from stair-stepping?",
        "answer": "Shoot the box fairly square-on, then magnify each seam to 200 percent after the single Refine. If a corner steps, Undo and run a tighter Smart Erase along that line rather than a second global peel that can also bite ingredient type."
      },
      {
        "question": "What about limp stand-up pouches and film bags?",
        "answer": "Flexible film wants gentle handling. Let the one Refine feather the creases, then Restore any soft corner the pass clipped. Avoid stacking peels, which flatten the natural slouch of the material into a plasticky outline."
      },
      {
        "question": "Should a shelf hero carry a contact shadow?",
        "answer": "The cut usually removes the floor shadow. If your template wants one, drop a synthetic soft shadow beneath the outline in your design tool, which keeps it uniform across a whole pack family instead of inheriting mismatched studio shadows."
      },
      {
        "question": "Can one cut feed several retail channels at once?",
        "answer": "Yes. Save JPG-white for strict fields and generate a WebP or PNG from the same outline for channels that accept other formats. Nothing re-processes, so a single clean cut serves many destinations in whatever format each prefers."
      }
    ]
  },
  'bgremover-furniture': {
    "eyebrow": "Home and decor",
    "h2": "Big furniture pieces grounded with honest soft shadows",
    "lead": "Furniture is the toughest product category to matte cleanly because the pieces are bulky, they throw wide diffused shadows, and their legs, arms, and cushions melt into a showroom floor. This profile opens on a gradient mock precisely so the shadow that pools beneath a sofa base or a chair leg becomes visible, letting you commit to a contact shadow on purpose instead of discovering later that the piece appears to hover. One Refine tidies upholstery hems and woven trim, and PNG export protects the soft alpha a designed room composite depends on. A furniture or homeware brand can build a showroom lookbook without shipping interior layouts and unreleased ranges to a cloud remover. Use this route for a standalone piece bound for a laid-out plate, not a full styled room where spatial context carries the sell.",
    "whyPreset": "A gradient mock exposes the diffused shadow that both white and a checkerboard tend to swallow, which is exactly the cue a furniture retoucher needs before committing. Turning Refine on by default assists fabric hems, rattan weave, and turned wooden legs that reward one measured peel. PNG is the natural handoff because a room composite needs real alpha, not a flattened rectangle. The tip names shadow pooling beneath legs so operators study the base of the piece first, where a furniture cut most often reads wrong.",
    "workflowTip": "Shoot the piece filling the frame at a steady height across the range so the lookbook feels of one voice. Once the model finishes, read the gradient for shadow pooling under legs and cushions, then Refine a single time along hems and seam lines. Smart Erase the floor and any staging rug when the plate should read empty. Restore a slim chair spindle or lamp stem the peel may have whittled. Decide early whether you want a synthetic contact shadow, then save PNG and lay that shadow in your design tool so it stays uniform across every piece in the collection.",
    "privacyNote": "Showroom and studio frames can expose store layouts, unreleased ranges, and staging that telegraphs a brand direction before its reveal. Local inference keeps those frames off remover CDNs and out of any retention window, with only the shared model weights fetching once. That helps a manufacturer shooting prototype pieces and an agency rotating several homeware accounts on separate machines, since no cross-client history collects in one shared login.",
    "scenarioH2": "Assembling a furniture lookbook from a single studio day",
    "scenarioBody": "Use this profile when a photographer has captured a range of sofas, chairs, and lamps and the catalogue team needs clean PNGs for a laid-out lookbook. Cut each piece on the gradient so shadow pooling is obvious, Refine hems once, and Smart Erase the staging rug where the plate should sit empty. Keep leg height and camera distance steady so the row aligns in a grid. If an online shop also needs a white version, generate a JPG-white from the same outline rather than re-processing. For an upholstered piece with fringe or piping, favour Restore over a second Refine so the soft trim you want is not collapsed into a hard plastic-looking rim.",
    "edgesH2": "Slim legs, fabric hems, and shadow pooling on a gradient",
    "edgesBody": "Furniture outlines concentrate at slim legs, soft fabric hems, and the broad shadow zone beneath the piece. On the gradient, look first where legs meet the floor, because leftover shadow reads as gray sludge while missing shadow reads as hovering. Restore slim spindles and lamp stems the peel whittled to nothing. Feather upholstery hems with the single Refine, then Restore fringe or piping that vanished. Rattan and cane weave want patience; Smart Erase the floor between the gaps rather than one heavy peel. Save PNG once the base of the piece looks planted and the slim members survive a full-screen zoom.",
    "faqs": [
      {
        "question": "Why proof furniture on a gradient rather than white?",
        "answer": "A gradient exposes the diffused shadow pooling under legs and along the base that white flattens away. Seeing that pool lets you commit to a contact shadow on purpose, so the finished piece reads planted on a laid-out plate instead of hovering."
      },
      {
        "question": "How do I keep slim chair legs from vanishing?",
        "answer": "Slim members like spindles and lamp stems often get whittled by the peel. Magnify and Restore along each one in short strokes. Skip a second global Refine, which tends to erode delicate structures further rather than rescue them."
      },
      {
        "question": "Should I preserve the original floor shadow?",
        "answer": "Usually not, since a real floor shadow rarely matches a laid-out plate. Remove it with the backdrop, then lay a synthetic soft shadow in your design tool so every piece in the range shares one shadow style and direction."
      },
      {
        "question": "Can I cut a fully styled room scene here?",
        "answer": "This profile targets a standalone piece bound for a composite. A full room usually should stay whole because buyers need spatial context; colour-correct those instead of matting them. Cut only a single hero object when a laid-out layout demands it."
      },
      {
        "question": "Which export suits a furniture lookbook best?",
        "answer": "Use PNG so soft hems and fringe keep real alpha for compositing. Generate a JPG-white or WebP from the same outline if a shop needs it, but keep the full-resolution PNG as your archival master for print and layout."
      }
    ]
  },
  'bgremover-footwear': {
    "eyebrow": "Sneakers and shoes",
    "h2": "Outsole and lace edges vetted on a black stage before export",
    "lead": "Footwear photography buries its worst edge trouble on white. A rubber midsole grabs a faint pale rim, translucent laces and mesh panels dissolve into the backdrop, and the slim gap under an arched outsole gets stuffed by an eager matte. This profile opens on a black stage so all of that pale rim jumps out at a glance, and it turns Refine on to snug the welt line where the upper meets the sole. PNG export keeps the crisp, hype-grade silhouette a sneaker grid and a resale listing expect. A brand or a reseller can prep drop imagery without lodging an unreleased colourway on a cloud remover. Use this route when you want a sharp shoe floating on a designed plate, not when a channel demands a plain white rectangle.",
    "whyPreset": "A black stage is the quickest way to spot the pale rim clinging to a rubber midsole and the fray hiding in mesh and laces, both of which evaporate against white. Refine is on because the welt seam between upper and sole rewards one measured peel that clears fray without eating stitching. PNG leads because sneaker-culture grids and resale listings drop the shoe onto branded plates and need real alpha. The tip names outsole and laces so operators vet the two zones that most often expose a rushed footwear cut.",
    "workflowTip": "Shoot a lateral or three-quarter angle with the shoe filling the frame and the arch gap clearly open. Once the model finishes, stay on black and chase the pale rim along the midsole, the panel or swoosh seams, and the laces. Refine once along the welt, then Smart Erase any leftover floor under the arch so the negative space reads as true void. Restore mesh or translucent lace runs the peel thinned. Glance at white briefly to confirm no dark fray hides there, then save PNG and archive it for the many placements a single hero angle usually feeds.",
    "privacyNote": "An unreleased colourway and a collaboration sample rank among the most leaked assets in retail, and a cloud remover is one more doorway they can slip through. Local inference keeps those frames in the tab, with only the shared model weights fetching once, so a brand can prep drop imagery without opening a retention surface. A reseller shooting authenticated pairs likewise keeps buyer-adjacent detail off a shared history while building clean listing shots.",
    "scenarioH2": "Prepping drop and resale shots from one hero angle",
    "scenarioBody": "Open this profile when a colourway drop or a resale listing needs a crisp, floating shoe for a designed grid. Cut the hero angle on black, Refine the welt once, and clear the arch gap so the shoe never looks glued to a surface. Keep the light direction steady across pairs so a wall of sneakers reads as one shoot. If a channel also wants plain white, generate a JPG-white from the same outline rather than re-processing. For a knit or textile upper, favour Restore on fuzzy panels over a second Refine, which can iron the material into a hard rim that looks fake against a loud hype backdrop.",
    "edgesH2": "Welt seams, arch voids, and translucent laces on black",
    "edgesBody": "Footwear outlines fail at the welt, the arch void, and the laces. On black, a pale rim along the midsole is impossible to miss, so Erase it without eating the stitching that gives the welt its shape. The void beneath an arched outsole must read as true transparency; if the model stuffed it, Smart Erase that patch carefully. Translucent laces and mesh often thin under a peel, so Restore them at low opacity. A knit upper wants a soft rim over a hard one. Glance at white once to catch dark fray, then save PNG when the whole silhouette, arch void included, survives a full-screen check.",
    "faqs": [
      {
        "question": "Why stage footwear on a black backdrop first?",
        "answer": "A pale rim on a rubber midsole and fray in mesh and laces hide against white and glow against black. Staging dark forces you to clear those zones before export, and you can still glance at white to catch any dark fray hiding there."
      },
      {
        "question": "How do I keep the void under the arch transparent?",
        "answer": "The negative space beneath an arched outsole is often stuffed by the model. Magnify and Smart Erase that patch so it reads as true void, then confirm on both black and white that the gap is clean before export."
      },
      {
        "question": "Will translucent laces and mesh survive the cut here?",
        "answer": "They can thin under an automatic peel. Restore at low opacity along laces and mesh runs after Refine, and favour a soft rim on a knit upper so the material still reads as fabric rather than a hard plastic outline."
      },
      {
        "question": "Which export suits a sneaker grid best?",
        "answer": "Use PNG so the crisp silhouette keeps real alpha for compositing onto branded plates. Generate a JPG-white or WebP from the same outline when a channel needs it, but keep the PNG master for hype grids and print."
      },
      {
        "question": "How do I make a row of shoes look consistent?",
        "answer": "Hold camera angle, distance, and light direction steady across every pair, and cut each shoe with the same welt Refine. Consistent input plus a consistent pass makes a wall of sneakers read as one cohesive shoot rather than mismatched cutouts."
      }
    ]
  },
  'bgremover-cosmetics': {
    "eyebrow": "Beauty and skincare",
    "h2": "Glossy serum bottles matted on a forgiving blush field",
    "lead": "Beauty packaging is quietly one of the hardest subjects to matte, because serum droppers, frosted acrylic jars, and lacquered lipstick tubes bounce their surroundings and carry semi-see-through caps. A heavy automatic peel flattens that sheen and turns a premium vessel into dull plastic. This profile opens on a soft blush backdrop, warm enough to keep pastel formulas readable while still exposing rim bounce and edge tint, and it keeps Refine switched off so Smart Erase leads as the gentle, reversible cleanup. WebP export keeps a beauty category grid quick where the format is welcome. An indie skincare label or studio can process an unlaunched shade range without dropping it in a remover bucket. Choose this route for reflective bottles and jars, not for a model applying makeup or a busy propped flat lay you want left whole.",
    "whyPreset": "A blush backdrop is kinder than stark white for beauty colour proofing yet still surfaces the rim bounce and cool tint a vessel grabs off a shoot bench. Holding Refine off shields the fine sheen and frosted lips a peel would chew, letting Smart Erase be the wiser opening move. WebP leads because a beauty landing page and its category grid load a wall of small product tiles that reward lighter files. The tip names bottle sheen so operators inspect caps, shoulders, and droppers, where a cosmetics cut most often unravels.",
    "workflowTip": "Light with a polariser or controlled softboxes when you can, since taming mirror glare on the bench saves far more minutes than any brush later. After the model finishes, leave Refine off and Smart Erase the bench and any prop riser first. Magnify the cap, dropper, and bottle shoulder to read the sheen and any edge tint. Restore a translucent cap or clear shoulder at low opacity, accepting honest partial transparency rather than inventing pixels. Wipe any cool green or blue tint the bench threw onto the vessel. Save WebP for the grid and keep a PNG for print or a retoucher handoff.",
    "privacyNote": "A shade extension, a reformulation, and a whole unlaunched range stay guarded until a reveal, and a consumer remover is a needless place for them to slip. Local inference keeps those product frames inside the browser, with only the shared model weights fetching once. A retailer NDA shoot can wrap outlines on the tethering laptop, and a studio juggling several beauty accounts avoids pooling product tiles in a shared history that might surface the wrong label at the wrong moment.",
    "scenarioH2": "Prepping a skincare tile grid ahead of a shade launch",
    "scenarioBody": "Open this profile when a beauty label needs tidy bottle and jar cutouts for a category grid while the range is still under wraps. Cut each vessel on blush, lean on Smart Erase rather than an automatic peel, and read every cap and dropper for sheen and edge tint. Restore frosted or clear sections gently and accept realistic partial transparency. Save WebP for the staging grid and keep a PNG for print partners. If a retailer insists on white, flip the swatch for that one export and leave the master intact. For a set wearing reflective shrink bands, favour careful Erase over Refine so the glossy cue that reads as premium survives.",
    "edgesH2": "Bottle sheen, droppers, and frosted caps on blush",
    "edgesBody": "Beauty outlines fail at mirror-like rims, semi-see-through droppers, and frosted caps. On blush, a cool tint the bench threw onto a clear vessel is visible, so Erase it without dulling the genuine sheen. Droppers and clear shoulders are partly translucent by nature; Restore them at low opacity and accept that a serum vial should read like glass, not a solid chip. A frosted cap wants a soft edge over a hard one. Steer clear of any global Refine that would iron out the glossy cue that signals a premium formula. Save WebP once the sheen looks natural on both blush and a neutral proof.",
    "faqs": [
      {
        "question": "Why does the cosmetics route keep Refine off by default?",
        "answer": "Glossy bottles and frosted acrylic look worse after an automatic peel that dulls sheen and flattens edges. Holding Refine off makes Smart Erase the lead, reversible tool, so a premium vessel keeps the surface cue that signals quality."
      },
      {
        "question": "How do I treat a semi-see-through serum vial?",
        "answer": "Accept realistic partial transparency instead of forcing a solid chip. Restore clear shoulders and droppers at low opacity along their rims, and fix white balance in your raw pipeline so the formula colour reads true once the backdrop is gone."
      },
      {
        "question": "What leaves a cool tint on my clear bottle edge?",
        "answer": "The shoot bench bounces onto the vessel, dropping a green or blue cast along the rim. Magnify and soft Erase that tint after the model runs. Lighting on a neutral bench with controlled light shrinks the problem before you ever cut."
      },
      {
        "question": "Why favour WebP for a beauty product grid?",
        "answer": "A landing page and category grid load a wall of product tiles, and WebP keeps them light with no visible loss on phones. Keep a PNG for print or a retoucher, and re-save from the same outline if a CMS rejects WebP."
      },
      {
        "question": "Can I cut a full makeup flat lay in one go?",
        "answer": "Overlapping tubes and props confuse a single subject. For clean tiles, shoot and cut each bottle or jar on its own. Leave a styled flat lay whole as a lifestyle frame rather than matting the entire scene at once."
      }
    ]
  },
  'bgremover-documents': {
    "eyebrow": "Paper and records",
    "h2": "Clean white document scans with crisp paper edges",
    "lead": "Turning a phone photo of a page, receipt, certificate, or invoice into a tidy digital record usually means lifting the paper off a desk and dropping it onto even white. This preset is built for that clerical job, not for creative composites. It opens on pure white to match archive and print templates, and it deliberately leaves Refine off, because a document edge should be a straight, crisp paper line, not a feathered photographic peel that makes the page look torn. Sensitive paperwork, contracts, medical forms, and financial statements never leave the browser, which is the whole point when the content is confidential. Use this route to standardize scans and receipts into clean white-field images. It complements rather than replaces a dedicated document scanner app for perspective correction.",
    "whyPreset": "Pure white is the visual language of document archives, print packets, and expense systems, so previewing there tells you exactly how the scan will land. Leaving Refine off is essential: feathering a paper edge produces a fuzzy, torn-looking border, whereas documents need a straight, high-contrast boundary. JPG-white is highlighted because most record systems and forms want a flat rectangle rather than transparency. The tip names crisp paper edges so operators resist the urge to soften an edge that should stay sharp, keeping the fingerprint distinct from photographic presets.",
    "workflowTip": "Photograph the page as square-on as possible under even light, because the cutout keeps the shape you give it and cannot fix heavy keystoning on its own. After the model runs, leave Refine off and rely on Smart Erase to clear any desk texture the model missed near the corners. Zoom each corner to confirm the paper boundary is a clean line, and Restore any corner the peel clipped. Straighten the page in your editor if needed, then export JPG on white for the archive. Keep a PNG only if you might recomposite the page onto a form template later.",
    "privacyNote": "Documents are among the most sensitive things anyone photographs: contracts, IDs, medical letters, bank statements, and signed forms. Local WebAssembly inference means those pages never transit a remover API or sit in an upload window, with only public model weights downloading once. That lets an HR team, a clinic, or a finance desk standardize scans inside a managed browser without adding a data-processing agreement for a background tool. You still must protect the exported files under your normal records-retention and access policies, because local cutout is one control, not the whole program.",
    "scenarioH2": "Standardizing receipts and certificates into clean archives",
    "scenarioBody": "Use this preset when a stack of phone photos of receipts, certificates, or single pages must become tidy white-field images for an archive or expense system. Shoot each page square-on, cut on white with Refine off, and Smart Erase any desk grain near the edges. Straighten the page, confirm the four corners read as crisp paper, and export JPG-white for the record. Process sensitive paperwork on the same managed machine where it will be stored so it never touches a cloud tool. For multi-page documents, keep a consistent crop and naming scheme so pages stay in order, and pair this with a scanner app when heavy perspective correction is required.",
    "edgesH2": "Straight paper borders and clipped corners on white",
    "edgesBody": "Document edges have one job: read as a clean, straight paper border on white. The most common failures are a feathered edge that looks torn, a clipped corner where the peel ate the page, and leftover desk texture hiding just outside the boundary. Keep Refine off so the edge stays sharp, and use Smart Erase to remove desk grain near the corners without biting into the paper. Restore any corner the model clipped so the rectangle stays complete. Zoom each corner at high magnification, because a one-pixel notch is obvious on white archive pages. Export JPG-white only after all four corners and edges read as crisp paper.",
    "faqs": [
      {
        "question": "Why is Refine off for document scans?",
        "answer": "A document edge should be a straight, crisp paper line. Feathering it with a peel makes the page look torn or fuzzy. Leaving Refine off keeps the border sharp, and Smart Erase handles any desk texture that lingers near the corners."
      },
      {
        "question": "Can this fix a skewed or angled page photo?",
        "answer": "It removes the background but keeps the shape you captured. For heavy keystoning, shoot square-on or use a dedicated scanner app for perspective correction first, then run this tool to place the corrected page on a clean white field."
      },
      {
        "question": "Is this safe for confidential paperwork?",
        "answer": "Inference runs locally, so the page never uploads to a remover service and only public model weights download once. That removes the upload hop, but you still must store and share the exported file under your own records-retention and access controls."
      },
      {
        "question": "Why export JPG on white instead of transparent PNG?",
        "answer": "Most archives, forms, and expense systems expect a flat rectangle on white rather than transparency. JPG-white matches that expectation directly. Keep a PNG only if you plan to recomposite the page onto a form template later."
      },
      {
        "question": "How do I keep the four corners looking clean?",
        "answer": "Zoom each corner to high magnification and check for clipped notches or leftover desk grain. Use Restore to rebuild any clipped corner and Smart Erase to clear texture just outside the paper, so the finished rectangle looks complete and crisp on white."
      }
    ]
  },
  'bgremover-group-photos': {
    "eyebrow": "Teams and families",
    "h2": "Multi-person cutouts with every hairline kept honest",
    "lead": "A group photo multiplies every hard part of a portrait cutout. Instead of one hairline you have five, instead of one collar you have overlapping shoulders, and the gaps between people become tiny background pockets that a lazy matte leaves as gray islands. This preset opens on a transparent checkerboard so alpha stays honest across all of those junctions, and it turns Refine on because a group frame benefits from a controlled peel along many edges at once. PNG export preserves the partial alpha that hair needs when the team lands on a branded backdrop. Companies, schools, sports clubs, and families can cut a whole group without uploading everyone faces to a remover service. Use this route for a shared backdrop replacement, not for isolating a single person from a crowd.",
    "whyPreset": "A transparent grid is the honest surface for a group because it exposes the background pockets between people that white would hide, and those pockets are the signature failure of group cutouts. Refine is on because a group has many edges that a single controlled peel improves at once, saving time versus brushing each person separately. PNG preserves the partial alpha that multiple hairlines need for a clean composite. The tip names hairlines between people so operators inspect the gaps and junctions first, which is where a team photo most often looks cut out.",
    "workflowTip": "Ask the group to leave small gaps between shoulders when possible, because touching silhouettes are far harder to separate cleanly. After the model runs, Refine once, then zoom to each hairline and each gap between people in turn. Erase the little background pockets that survive between arms and shoulders, and Restore flyaways along the outer edges of the group. Keep brush sizes small around glasses and collars. Flip to a dark proof once to catch light halo on hair, then export PNG so every hairline keeps its alpha for the final branded backdrop.",
    "privacyNote": "A group photo is a pile of biometric-adjacent data: many identifiable faces, sometimes including minors in a school or club setting. Keeping inference local means none of those faces reach a remover API or sit in an upload window, with only public model weights downloading once. Organizations that must limit third-party processing of member or employee images can cite local WebAssembly as the technical control. Still obtain the consent your context requires for the shoot itself, since local processing covers the cutout hop, not the entire chain.",
    "scenarioH2": "Replacing the backdrop for a team or class photo",
    "scenarioBody": "Use this preset when a company, school, or sports club needs to drop a whole group onto a branded backdrop without sending everyone faces to a cloud tool. Import the group, Refine once, and then work methodically along each hairline and each gap between people, erasing the small background pockets that survive between shoulders. Restore outer flyaways so the group edge looks natural. Export a PNG master and composite it onto the approved backdrop in your design tool, where you can add a subtle shadow if the layout wants one. For recurring events, keep camera distance and grouping consistent so successive class or team photos share a look.",
    "edgesH2": "Overlapping shoulders, gaps, and many hairlines",
    "edgesBody": "Group edges fail in the spaces people forget to check: the pockets of background between arms and shoulders, the overlapping junctions where one person crosses in front of another, and the sheer number of hairlines. On the checkerboard, hunt every enclosed gap and Erase leftover background so it does not read as a gray island in the final composite. At overlaps, decide which edge is foreground and clean it deliberately. Refine feathers the many hairlines at once; Restore outer flyaways sparingly. Flip to dark to catch light halo, then export PNG only when every gap is clean and each hairline holds at full-screen zoom.",
    "faqs": [
      {
        "question": "How do I clean the background between people?",
        "answer": "The gaps between shoulders and arms become small background pockets. On the transparent grid, zoom into each enclosed gap and Erase the leftover background so it does not appear as a gray island once the group is composited onto a new backdrop."
      },
      {
        "question": "What if shoulders are touching or overlapping?",
        "answer": "Touching silhouettes are the hardest part of a group cut. Decide which edge is foreground at each overlap and clean it deliberately. When you can influence the shoot, ask the group to leave small gaps so the model separates people more cleanly."
      },
      {
        "question": "Why is Refine on for group photos?",
        "answer": "A group has many hairlines and edges, and a single controlled Refine pass improves all of them at once, which is far faster than brushing each person individually. You then Restore outer flyaways and clean the between-people gaps by hand."
      },
      {
        "question": "Is it safe to cut a photo full of faces here?",
        "answer": "Inference runs locally, so none of the faces upload to a remover service and only public model weights download once. That is especially relevant for schools and clubs, though you still need the consent your context requires for the original shoot."
      },
      {
        "question": "Which export keeps multiple hairlines clean?",
        "answer": "Use PNG so the partial alpha across every hairline survives into the composite. Add the new backdrop and any shadow in your design tool afterward, and keep the PNG master so you can recomposite the same group onto different plates later."
      }
    ]
  },
  'bgremover-twitch-thumbs': {
    "eyebrow": "Streaming overlays",
    "h2": "Streamer cutouts staged for facecams, alerts, and BRB screens",
    "lead": "Twitch art competes for eyeballs against a wall of vivid overlay graphics, so a streamer cutout must punch at small scale with a clean, slightly bold rim. This profile stages the subject on a plum canvas that echoes the loud glow of a stream scene, exposing any spill ring before you drop the cutout into an alert box, a sub-badge strip, or a starting-soon screen. Refine is on to tidy the flyaway strands and the fuzzy lip of a headset that a webcam rig always brings, and WebP export keeps a facecam frame, schedule card, or panel light for quick channel loads. A streamer or editor sidesteps sending a recognisable channel face and an embargoed collab reveal to yet another cloud editor. Use this route when the deliverable is a punchy overlay element for OBS or Streamlabs, not a shelf product on plain white.",
    "whyPreset": "A plum canvas approximates the loud glow of a stream scene, so a spill ring and soft sludge that would vanish on white are obvious before the subject meets an alert box or an emote strip. Refine is on because a webcam rig brings strands, hands, and headset lips that reward one measured peel. WebP leads because a facecam frame, a panel, and a schedule card should stay light for quick channel loads. The tip names overlay glow so the baked state speaks a streamer's language and inspection starts against a realistic busy scene rather than a clean studio white.",
    "workflowTip": "Grab or shoot a frame with a large face or a signature piece of gear, since a tiny subject dissolves once a facecam shrinks into an OBS scene. Once the model finishes, inspect on plum, Refine once, and Erase leftover room and desk clutter behind the rig. Restore flyaway strands and the translucent parts of a mic arm and pop filter the peel thinned. Glance at a light proof so a dark hood or headset band does not stay hidden only on plum. Save WebP for a flat overlay element, or keep a PNG to layer the subject into a scene, an alert, or a panel with glow and borders, then check it at the size viewers meet in the browse directory.",
    "privacyNote": "A channel face, an embargoed collab reveal, and a sponsor asset are business-critical for a streamer, and a consumer remover is one more place they can leak before a premiere. Local inference keeps those frames in the tab, with only the shared model weights fetching once, so an editing crew can batch overlay art without a shared login stuffed with face crops. Secure the drive where your layered scene files live after export, because the win covers the cutout hop rather than your whole storage.",
    "scenarioH2": "Building a week of overlays, panels, and alert graphics",
    "scenarioBody": "Open this profile when you are cutting a week of facecam frames, schedule cards, panel art, and alert graphics for a channel refresh. Cut each streamer or piece of gear on plum, Refine once, and Erase the room and desk clutter behind the rig. Keep the face large enough to read once a facecam shrinks into a scene, and hold a steady light direction so the channel look stays cohesive across every asset. Save WebP for a flat element or a PNG to layer into an OBS or Streamlabs scene with glow, emote frames, and borders. If a stream is an embargoed collab, local processing means the reveal never lands in a shared remover login before you go live. Reuse cutouts carefully when episodes share the same rig and wardrobe.",
    "edgesH2": "Flyaway strands, headset lips, and mic-arm edges on plum",
    "edgesBody": "Overlay art has to read at small facecam sizes, so a rim should be slightly bold rather than film-soft. On plum, a spill ring around flyaway strands and the fuzzy lip of a headset glows, so Erase those rings without eating the shape. A mic arm and its pop filter carry thin, partly transparent parts; Restore them and accept a little manual finishing. A piece of gear should keep a crisp outline so it survives against a loud emote strip. Glance at a light proof so a dark hood or headset band does not stay hidden where it only looks clean on plum. Save WebP once the subject still punches at the small size viewers meet in the browse directory.",
    "faqs": [
      {
        "question": "Why stage Twitch overlay art on a plum canvas?",
        "answer": "Plum echoes the loud glow of a stream scene, so a spill ring and soft sludge that hide on white jump out against it. Cleaning the rim on plum means the subject still punches once it lands in an alert box, a sub-badge strip, or a facecam frame."
      },
      {
        "question": "How do I handle headset and mic-arm edges?",
        "answer": "A headset lip and a mic arm carry thin, partly transparent parts an automatic peel tends to thin out. Refine once, then Restore those runs and Erase any spill ring without eating the shape. Expect a little manual finishing for a premium channel look."
      },
      {
        "question": "Should the finished overlay element stay transparent?",
        "answer": "It depends on the slot. A facecam frame or alert usually layers as a PNG so the scene can composite it, while a flat schedule card can ship as WebP. Keep a PNG master whenever you will relayer the subject with new borders or glow."
      },
      {
        "question": "Why lead with WebP for a Twitch overlay?",
        "answer": "A facecam frame, a panel, and a schedule card should load fast and stay light, and WebP delivers that with no visible loss at overlay sizes. Keep a PNG when you need layered compositing in OBS or lossless archival, and re-save from the same outline if a tool rejects WebP."
      },
      {
        "question": "My streamer looks tiny in the scene — what do I fix?",
        "answer": "Scale matters more than rim softness on an overlay. Start from a frame with a large face or a signature piece of gear, and if the subject reads small, size it up in the scene rather than adding Refine passes. Always check at the size viewers meet in the browse directory."
      }
    ]
  },
};
