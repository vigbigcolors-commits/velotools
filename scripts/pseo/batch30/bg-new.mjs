/**
 * BG Remover PSEO — batch30 expansion (8 new use cases).
 * Same shape as scripts/seo-data/bgremover-matrix/entries.mjs + editorials.mjs.
 * Entries carry widget state only; editorial copy lives in NEW_BG_EDITORIALS.
 * Plain-text editorial fields (no HTML), each page >=600 words combined, unique everything.
 */

export const NEW_BG_USE_CASES = [
  'logos',
  'packaging',
  'furniture',
  'footwear',
  'cosmetics',
  'documents',
  'group-photos',
  'twitch-thumbs',
];

/** @type {Array<{ id: string, useCase: string, useCaseLabel: string, title: string, description: string, h1: string, heroSub: string, intentBanner: string, config: { defaultBg: string, bgSwatchIndex: number, exportHint: 'png'|'jpg-white'|'webp'|'jpg-bg', suggestRefine: boolean, tipLabel: string } }>} */
export const NEW_BG_ENTRIES = [
  {
    id: 'bgremover-logos',
    useCase: 'logos',
    useCaseLabel: 'Raster logo cutouts',
    title: 'Logo Background Remover — Sharp Transparent PNG, No Upload | VeloTools',
    description:
      'Turn a raster logo on a busy plate into a crisp transparent PNG in your browser. Hard edges stay sharp because auto Refine is off by default. No account, no upload, weights download once.',
    h1: 'Background remover for raster logos and wordmarks',
    heroSub:
      'Built for hard-edged marks: checkerboard alpha preview, no automatic peel that could soften corners, lossless PNG export. Your brand asset never leaves this tab.',
    intentBanner: 'Logo preset - transparent grid - no auto Refine - PNG lossless',
    config: {
      defaultBg: 'transparent',
      bgSwatchIndex: 0,
      exportHint: 'png',
      suggestRefine: false,
      tipLabel: 'Keep logo corners crisp, skip auto Refine',
    },
  },
  {
    id: 'bgremover-packaging',
    useCase: 'packaging',
    useCaseLabel: 'Product packaging shots',
    title: 'Packaging Background Remover — Clean Box Edges on White | VeloTools',
    description:
      'Cut cartons, pouches, and bottles from studio clutter and preview them on pure white before export. One Refine pass keeps box seams tight. Everything runs locally, so unreleased packaging stays private.',
    h1: 'Background remover for product packaging photos',
    heroSub:
      'Straight carton corners and soft pouch folds both need care. White preview matches retail PDP fields; Refine once, then export JPG on white with no upload.',
    intentBanner: 'Packaging preset - white preview - JPG-white - box-seam Refine',
    config: {
      defaultBg: '#ffffff',
      bgSwatchIndex: 1,
      exportHint: 'jpg-white',
      suggestRefine: true,
      tipLabel: 'Check box seams on white before export',
    },
  },
  {
    id: 'bgremover-furniture',
    useCase: 'furniture',
    useCaseLabel: 'Furniture and decor',
    title: 'Furniture Background Remover — Soft Shadow Prep on Gradient | VeloTools',
    description:
      'Isolate sofas, chairs, and lamps from a showroom floor and judge them on a gradient mock that reveals soft shadow spill. Refine cleans upholstery hems. Local AI keeps showroom layouts off any server.',
    h1: 'Background remover for furniture and home decor',
    heroSub:
      'Large objects cast large shadows. A gradient preview shows spill under legs and arms so you can decide contact shadows deliberately, then export PNG for lookbook composites.',
    intentBanner: 'Furniture preset - gradient mock - PNG - soft-shadow Refine',
    config: {
      defaultBg: 'grad',
      bgSwatchIndex: 9,
      exportHint: 'png',
      suggestRefine: true,
      tipLabel: 'Gradient shows soft shadow spill on legs',
    },
  },
  {
    id: 'bgremover-footwear',
    useCase: 'footwear',
    useCaseLabel: 'Sneakers and shoes',
    title: 'Footwear Background Remover — Sole Edges on Dark Preview | VeloTools',
    description:
      'Cut sneakers and boots from cluttered surfaces and check sole and lace halo against a dark field before export. Refine tightens welt lines. Runs fully in-browser, so sample drops stay confidential.',
    h1: 'Background remover for sneakers, boots, and shoes',
    heroSub:
      'Rubber soles and translucent laces hide halo on white. A black preview exposes it instantly; Refine once along the welt, then export lossless PNG for hype grids.',
    intentBanner: 'Footwear preset - black preview - PNG - welt and lace Refine',
    config: {
      defaultBg: '#111111',
      bgSwatchIndex: 2,
      exportHint: 'png',
      suggestRefine: true,
      tipLabel: 'Dark preview exposes sole and lace halo',
    },
  },
  {
    id: 'bgremover-cosmetics',
    useCase: 'cosmetics',
    useCaseLabel: 'Cosmetics and skincare',
    title: 'Cosmetics Background Remover — Reflective Bottles Stay Local | VeloTools',
    description:
      'Cut glossy serum bottles, jars, and tubes from a shoot surface and inspect reflections on a soft blush field. Smart Erase beats auto peels on glass. On-device inference keeps unlaunched SKUs private.',
    h1: 'Background remover for cosmetics and skincare bottles',
    heroSub:
      'Reflective glass and frosted plastic confuse hard mattes. A blush preview reveals rim reflections; skip the automatic peel, use Smart Erase, then export lightweight WebP for beauty grids.',
    intentBanner: 'Cosmetics preset - blush preview - WebP - reflective Smart Erase',
    config: {
      defaultBg: '#F0DCE8',
      bgSwatchIndex: 7,
      exportHint: 'webp',
      suggestRefine: false,
      tipLabel: 'Blush field reveals glass reflections',
    },
  },
  {
    id: 'bgremover-documents',
    useCase: 'documents',
    useCaseLabel: 'Document and paper scans',
    title: 'Document Background Remover — Clean White Paper Scans | VeloTools',
    description:
      'Lift a page, receipt, or certificate off a desk and drop it onto even white for tidy digital archives. Auto Refine stays off so text edges stay crisp. Sensitive paperwork never leaves your browser.',
    h1: 'Background remover for document and paper scans',
    heroSub:
      'Scans need square corners and clean paper edges, not feathered peels. A pure white field matches archive templates; skip Refine, straighten, and export JPG on white privately.',
    intentBanner: 'Document preset - pure white - JPG-white - crisp paper edges',
    config: {
      defaultBg: '#ffffff',
      bgSwatchIndex: 1,
      exportHint: 'jpg-white',
      suggestRefine: false,
      tipLabel: 'Even white for scans, avoid edge peel',
    },
  },
  {
    id: 'bgremover-group-photos',
    useCase: 'group-photos',
    useCaseLabel: 'Group and team photos',
    title: 'Group Photo Background Remover — Multi-Person Hair Detail | VeloTools',
    description:
      'Cut whole teams and families from a busy room and keep every hairline honest on a transparent grid. Refine helps the many edges between people. Local AI means group faces never touch a server.',
    h1: 'Background remover for group and team photos',
    heroSub:
      'Several heads mean several hairlines and overlapping shoulders. Transparent checkers keep alpha honest; Refine each junction, then export PNG for any brand backdrop.',
    intentBanner: 'Group preset - transparent grid - PNG - per-person hair Refine',
    config: {
      defaultBg: 'transparent',
      bgSwatchIndex: 0,
      exportHint: 'png',
      suggestRefine: true,
      tipLabel: 'Refine every hairline between people',
    },
  },
  {
    id: 'bgremover-twitch-thumbs',
    useCase: 'twitch-thumbs',
    useCaseLabel: 'Twitch thumbnails',
    title: 'Twitch Thumbnail Background Remover — Bold Gaming Cutouts | VeloTools',
    description:
      'Cut streamers and props for punchy Twitch thumbnails and stream cards, judged on a plum canvas that mimics overlay contrast. Refine cleans headset edges. Channel faces stay on your machine.',
    h1: 'Background remover for Twitch thumbnails and stream cards',
    heroSub:
      'Gaming thumbs need loud contrast and readable faces at small scale. A plum canvas mimics overlay glow; Refine once on hair and headset foam, then export WebP for fast uploads.',
    intentBanner: 'Twitch preset - plum canvas - WebP - headset edge Refine',
    config: {
      defaultBg: '#7C3480',
      bgSwatchIndex: 5,
      exportHint: 'webp',
      suggestRefine: true,
      tipLabel: 'Plum canvas mimics stream overlay contrast',
    },
  },
];

/** @typedef {{ eyebrow: string, h2: string, lead: string, whyPreset: string, workflowTip: string, privacyNote: string, scenarioH2: string, scenarioBody: string, edgesH2: string, edgesBody: string, faqs: { question: string, answer: string }[] }} Editorial */

/** @type {Record<string, Editorial>} */
export const NEW_BG_EDITORIALS = {
  'bgremover-logos': {
    eyebrow: 'Hard-edge marks',
    h2: 'Raster logos cut clean without softening a single corner',
    lead:
      'Brand and marketing teams constantly inherit a logo trapped inside a JPEG screenshot, a photographed sign, or a slide export, and they need it back as a transparent PNG without redrawing the vector. This preset is tuned for that exact rescue job. It opens on a transparent checkerboard so you can judge real alpha, and it deliberately leaves automatic Refine off, because a hard wordmark or geometric emblem almost always looks worse after an edge peel that rounds crisp corners and eats thin serifs. You keep full manual control: Smart Erase for the plate, Restore for any counter that the model punched through, and a lossless PNG at the end. This is the route to reach for when the goal is a clean drop-in mark for a deck, an email header, or a partner badge, not when you are cutting a photographed product or a person.',
    whyPreset:
      'Keeping Refine off by default protects the geometry that makes a logo readable. Corners, thin strokes, and letter counters survive when the tool does not feather them. The transparent grid is the honest surface for alpha work, because a white preview can hide semi-transparent sludge that later muddies a colored slide. PNG lossless is the correct export because a mark reused across sizes must not carry JPEG blocking around its edges. Together these defaults form a fingerprint clearly separate from photo-first presets that turn Refine on and celebrate soft mattes.',
    workflowTip:
      'Import the frame at the largest resolution you can find, since upscaling a tiny logo later will never recover crisp edges. Let the model run, then Smart Erase the surrounding plate rather than trusting a global peel. Zoom to 200 or 300 percent and check every corner and every enclosed shape such as the hole in an letter O or A. Restore any counter the model filled by mistake. Only if the mark is a photographed object with soft edges should you apply one manual Refine. Export PNG and archive that master, then downscale copies as needed for each placement.',
    privacyNote:
      'Unreleased brand marks, partnership lockups, and rebrand concepts are confidential competitive assets long before launch day. Because inference runs in local WebAssembly, those files never transit a third-party remover API and never sit in an upload retention window. Only the public model weights download once per browser profile. That lets a brand team clean a leaked-looking screenshot or a pre-announcement lockup without adding a vendor to the legal review, which is often the slowest part of any launch checklist.',
    scenarioH2: 'Rescuing a mark from a slide or a photographed sign',
    scenarioBody:
      'Reach for this preset when someone hands you a logo that only exists inside a screenshot, a conference photo, or a flattened PDF export. Drop the frame in, accept the checkerboard as the truth surface, and Smart Erase the background plate instead of running an automatic peel that would soften the type. If the mark sits on a photo of a building or a booth, straighten it mentally before you cut and Restore any interior shape the model removed. Export a PNG master and keep it, because you will inevitably need the same mark at a different size next week. When the original vector eventually surfaces, prefer it, but this raster rescue keeps the project moving in the meantime without a cloud upload.',
    edgesH2: 'Corners, counters, and thin strokes on a transparent grid',
    edgesBody:
      'Logo edges fail in ways that are easy to miss until the mark lands on a colored background. Watch three things on the checkerboard: sharp corners that must stay sharp, enclosed counters that must stay open, and hairline strokes that must not dissolve into partial alpha. Erase plate color without feathering the outline. If the model rounded a corner, Undo and use a tighter Smart Erase instead of a peel. Restore counters that were filled. Finally flip a proof swatch to a saturated color once, because semi-transparent sludge around a mark is invisible on white but obvious on brand blue. Export PNG only after that colored-plate check passes.',
    faqs: [
      {
        question: 'Why is automatic Refine off for logos?',
        answer:
          'Hard-edged marks look worse after an edge peel that rounds corners and feathers thin strokes. This preset keeps Refine off so geometry stays crisp, and lets you apply one manual pass only when the logo is actually a photographed object with soft edges.',
      },
      {
        question: 'Can this replace recreating the vector file?',
        answer:
          'For a true production logo, recreating a clean vector still wins because it scales infinitely. This tool is the fast rescue when you only have a raster copy trapped in a screenshot or photo and need a usable transparent PNG right now.',
      },
      {
        question: 'How do I keep the holes inside letters transparent?',
        answer:
          'Enclosed counters such as the gap in an O or A sometimes get filled by the model. Zoom in on the checkerboard, use Restore or Smart Erase to reopen those shapes, and confirm they read as transparent on a colored proof swatch before export.',
      },
      {
        question: 'Which export format should I choose for a mark?',
        answer:
          'Choose PNG. It is lossless and preserves clean alpha at any size, while JPEG would add block artifacts around the crisp edges. Keep the first PNG as your master and generate downscaled copies from it for individual placements.',
      },
      {
        question: 'My logo screenshot is tiny — will the cutout look sharp?',
        answer:
          'Cutting cannot add detail that was never captured. Start from the highest-resolution source you can find, because upscaling a small logo before or after removal only magnifies soft edges. When possible, hunt down a larger original frame first.',
      },
    ],
  },
  'bgremover-packaging': {
    eyebrow: 'Retail packaging',
    h2: 'Carton and pouch cutouts previewed on the field they will ship on',
    lead:
      'Packaging photography mixes two very different edge problems in one frame: dead-straight carton corners and soft, folding pouch material. A remover that treats both the same way leaves either jagged box seams or chewed pouch folds. This preset previews on pure white, the field most retail product pages actually use, and turns on a single Refine suggestion so the first pass already lands close to a shippable silhouette. Merchandisers can clear a seasonal drop of boxes, bottles, and flexible bags without parking unreleased artwork on a remover CDN, because everything runs in the tab. Use this route when the deliverable is a white-background packaging hero for a storefront, not when you need a transparent design master or a lifestyle scene with props intact.',
    whyPreset:
      'White preview is the honest QA surface for packaging because that is where most product pages will display the shot, and gray fringe that hides on a checkerboard fails immediately on white. A single suggested Refine tightens box seams and softens pouch folds in one controlled pass instead of forcing operators to guess. JPG-white is the highlighted export because storefront fields commonly reject transparency and expect a solid rectangle. The tip label points at box seams, the most common packaging failure, so operators inspect the right place first.',
    workflowTip:
      'Fill the frame with the pack and shoot it slightly straight-on so carton corners stay true. After the model runs, Refine once, then zoom to 200 percent along every seam and every fold. Smart Erase any stand, tape, or table crumb rather than adding a second global peel that could bite label type. For flexible pouches, Restore soft corners the model may have clipped. Flip between white and transparent once to catch fringe that only appears on one field, then export JPG on white for the storefront and keep a PNG if design needs a composite later.',
    privacyNote:
      'Packaging artwork is frequently under supplier NDA and often photographed weeks before a public launch. Local inference means those frames never reach a third-party API or sit in an upload retention window; only the public model weights download once. That matters when legal asks where pre-launch sample photography lived during the run-up, and it lets contract photographers finish mattes on the same laptop that tethered the camera without adding another vendor to a security questionnaire.',
    scenarioH2: 'Clearing a seasonal packaging drop for storefront heroes',
    scenarioBody:
      'Open this preset when a merchandiser must clear a batch of cartons, bottles, and pouches for a white product template before a launch window. Process one pack at a time on white, treat the single Refine pass as mandatory, and inspect seams before anyone debates shadows. If a channel later wants a transparent version for a lifestyle composite, switch swatches and re-export a PNG from the same matte instead of re-uploading. Keep packaging text crisp by avoiding extra Refine passes that can chew micro type on ingredient panels. For families of related SKUs, hold lighting and crop consistent so the row of packs reads as one catalog set rather than a patchwork of angles.',
    edgesH2: 'Box seams, pouch folds, and shrink-wrap glare on white',
    edgesBody:
      'Packaging silhouettes fail in three predictable ways: stair-stepped box corners, chewed pouch folds, and shrink-wrap glare that the model mistakes for background. Zoom the straight seams first and confirm they read as clean lines rather than dotted alpha. On flexible packs, Restore soft folds the peel may have flattened. Where glossy shrink-wrap catches a highlight, decide whether that specular belongs to the product and Restore it if the model punched a hole. Soft Erase table crumbs and stand feet without digging into carton graphics. Only export JPG-white after both a full-screen white stare and a quick transparent flip confirm the edges hold.',
    faqs: [
      {
        question: 'Will the white preview match my storefront product page?',
        answer:
          'It matches flat white templates closely. QA on the white swatch, then export JPG on white for channels that reject transparency, or export a PNG if design will composite later. For off-white themes, choose a custom fill after cutout instead of assuming pure white.',
      },
      {
        question: 'How do I keep straight carton corners from looking jagged?',
        answer:
          'Shoot the box fairly straight-on, then zoom each seam to 200 percent after the single Refine pass. If a corner stair-steps, Undo and use a tighter Smart Erase along that edge rather than a second global peel that can also bite label type.',
      },
      {
        question: 'What about soft pouches and flexible bags?',
        answer:
          'Flexible packaging needs gentle handling. Let the one Refine pass feather the folds, then Restore any soft corner the model clipped. Avoid stacking extra peels, which flatten the natural give of the material and can create a plasticky outline.',
      },
      {
        question: 'Should I add a contact shadow to the packaging?',
        answer:
          'Background removal usually kills the floor contact shadow. If your template wants one, add a synthetic soft shadow later in your design tool under the cutout, which keeps it consistent across a whole product family instead of relying on inconsistent original shadows.',
      },
      {
        question: 'Can I reuse one cutout for several marketplaces?',
        answer:
          'Yes. Export JPG-white for strict storefronts and generate a WebP or PNG from the same matte for channels that accept other formats. You never re-upload, so one clean cutout can feed multiple portals with the format each one prefers.',
      },
    ],
  },
  'bgremover-furniture': {
    eyebrow: 'Home and decor',
    h2: 'Large furniture cutouts with honest soft shadows on a gradient',
    lead:
      'Furniture is the hardest kind of product to matte well because the objects are big, they cast wide soft shadows, and their legs, arms, and cushions blend into showroom floors. This preset opens on a gradient mock precisely so that shadow spill under legs and along a sofa base becomes visible, letting you decide contact shadows deliberately instead of discovering later that the piece looks like it is floating. A single Refine suggestion cleans upholstery hems and rug fringe, and PNG export keeps the soft alpha that a lookbook composite needs. Furniture and homeware brands can prepare showroom catalogs without shipping interior layouts and unreleased collections to a cloud remover. Use this route for standalone pieces headed to a designed plate, not for full room scenes where spatial context matters.',
    whyPreset:
      'A gradient preview reveals soft shadow spill that both white and a checkerboard tend to hide, which is exactly the information a furniture retoucher needs before committing. Turning Refine on by default helps with fabric hems, woven textures, and wooden leg edges that benefit from one controlled peel. PNG is the natural handoff because catalog and lifestyle composites need real alpha, not a flattened rectangle. The tip names shadow spill on legs so operators inspect the base of the object first, where furniture cutouts most often look wrong.',
    workflowTip:
      'Shoot the piece filling most of the frame at a consistent height across the collection so the catalog feels cohesive. After the model runs, study the gradient for shadow spill under legs and cushions, then Refine once along hems and upholstery seams. Smart Erase the floor and any rug the piece was staged on if the plate should be clean. Restore thin chair spindles or lamp arms the peel may have thinned. Decide early whether you want a synthetic soft shadow, then export PNG and add that shadow in your design tool so it stays consistent across every product in the range.',
    privacyNote:
      'Showroom and studio photography can expose store layouts, unreleased collections, and staging that reveals a brand direction before its reveal. Local inference keeps those frames off remover CDNs and out of any upload retention window, with only the public model weights downloading once. That is useful for manufacturers photographing prototype pieces and for agencies juggling several homeware clients on separate machines, since no cross-client history pools in a shared SaaS account.',
    scenarioH2: 'Building a furniture lookbook from a single studio day',
    scenarioBody:
      'Use this preset when a photographer has shot a range of sofas, chairs, and lamps and the catalog team needs clean PNGs for a designed lookbook. Cut each piece on the gradient so shadow spill is obvious, Refine hems once, and Smart Erase the staging rug where the plate should be empty. Keep leg height and camera distance consistent so the row of products aligns in a grid. If ecommerce also needs a white version, generate a JPG-white from the same matte rather than re-uploading. For upholstered items with fringe or piping, prefer Restore over a second Refine so the soft outline you want is not collapsed into a hard plastic-looking edge.',
    edgesH2: 'Chair legs, fabric hems, and shadow spill on a gradient',
    edgesBody:
      'Furniture edges concentrate at thin legs, soft fabric hems, and the wide shadow zone under the piece. On the gradient, look first at where legs meet the floor, because leftover shadow reads as gray mud and missing shadow reads as floating. Restore thin spindles and lamp arms the peel may have thinned to nothing. Feather upholstery hems with the single Refine pass, then Restore fringe or piping if it vanished. Woven and rattan textures need patience; Smart Erase the floor between gaps rather than one aggressive peel. Export PNG once the base of the object looks grounded and the thin members survive at full-screen zoom.',
    faqs: [
      {
        question: 'Why preview furniture on a gradient instead of white?',
        answer:
          'A gradient reveals soft shadow spill under legs and along the base that white tends to flatten. Seeing that spill lets you decide contact shadows deliberately, so the finished piece looks grounded on a designed plate instead of floating awkwardly.',
      },
      {
        question: 'How do I keep thin chair legs from disappearing?',
        answer:
          'Thin members like spindles and lamp arms often get thinned by the peel. Zoom in and use Restore along each one, working in short strokes. Avoid a second global Refine, which tends to erode delicate structures further rather than help them.',
      },
      {
        question: 'Should I keep the original floor shadow?',
        answer:
          'Usually not, because a natural floor shadow rarely matches a designed plate. Remove it with the backdrop, then add a synthetic soft shadow in your design tool so every product in the range shares the same shadow style and direction.',
      },
      {
        question: 'Can I cut a full styled room scene here?',
        answer:
          'This preset targets standalone pieces headed to a composite. Full room scenes usually should stay intact because buyers need spatial context; color-correct those instead of matting them. Cut only a single hero object when a designed layout requires it.',
      },
      {
        question: 'What export works best for a furniture lookbook?',
        answer:
          'Use PNG so soft hems and fringe keep real alpha for compositing. Generate a JPG-white or WebP from the same matte if a marketplace needs it, but keep the full-resolution PNG as your archival master for print and layout.',
      },
    ],
  },
  'bgremover-footwear': {
    eyebrow: 'Sneakers and shoes',
    h2: 'Sole and lace edges checked on a dark field before export',
    lead:
      'Footwear photography hides its worst edge problems on white. Rubber soles pick up a faint gray halo, translucent laces and mesh fade into the background, and the thin gap under an arched sole gets filled by an over-eager matte. This preset opens on a black field so all of that halo is obvious at a glance, and it turns Refine on to tighten the welt line where the upper meets the sole. PNG export keeps the crisp, hype-grade silhouette that sneaker grids and resale listings expect. Brands and resellers can prepare drop imagery without uploading unreleased colorways to a cloud remover. Use this route when you want a clean, sharp shoe on a designed plate, not when a marketplace demands a plain white rectangle.',
    whyPreset:
      'A dark preview is the fastest way to catch the pale halo that clings to rubber soles and the fringe that hides in mesh and laces, both of which vanish against white. Refine is on because the welt line between upper and sole benefits from one controlled peel that removes fringe without eating stitching. PNG is highlighted because sneaker culture grids and resale listings composite the shoe onto branded plates and need real alpha. The tip names soles and laces so operators inspect the two areas that most often betray a rushed footwear cutout.',
    workflowTip:
      'Shoot a three-quarter or lateral angle with the shoe filling the frame and the arch gap clearly visible. After the model runs, stay on black and hunt halo along the sole, the swoosh or panel edges, and the laces. Refine once along the welt, then Smart Erase any leftover surface under the arch so the negative space reads as true transparency. Restore mesh or translucent lace sections the peel may have thinned. Flip briefly to white to confirm no dark fringe hides there, then export PNG and archive it for the many placements a single hero shot usually feeds.',
    privacyNote:
      'Unreleased colorways and collaboration samples are among the most leaked assets in retail, and a cloud remover is one more place they can escape. Local inference keeps those frames in the tab, with only public model weights downloading once, so a brand can prepare drop imagery without adding an upload retention surface. Resellers photographing authenticated pairs likewise keep buyer-adjacent details off a shared SaaS history while they build clean listing images.',
    scenarioH2: 'Prepping drop and resale imagery from a single hero angle',
    scenarioBody:
      'Open this preset when a colorway drop or a resale listing needs a crisp, floating shoe for a designed grid. Cut the hero angle on black, Refine the welt once, and clear the arch gap so the shoe does not look glued to a surface. Keep lighting direction consistent across pairs so a wall of sneakers reads as one shoot. If a marketplace also wants plain white, generate a JPG-white from the same matte rather than re-uploading. For textile or knit uppers, prefer Restore on fuzzy panels over a second Refine, which can flatten the material into a hard outline that looks fake against saturated hype backgrounds.',
    edgesH2: 'Welts, arch gaps, and translucent laces on black',
    edgesBody:
      'Footwear edges fail at the welt, the arch gap, and the laces. On black, a gray halo along the sole is impossible to miss, so Erase it without eating the stitching that gives the welt its shape. The negative space under an arched sole must read as true transparency; if the model filled it, Smart Erase that surface carefully. Translucent laces and mesh often thin out under a peel, so Restore them at low opacity. Knit uppers benefit from a soft edge rather than a hard one. Flip to white once to catch dark fringe, then export PNG when the whole silhouette, including the arch, survives a full-screen check.',
    faqs: [
      {
        question: 'Why start footwear on a black preview?',
        answer:
          'Pale halo on rubber soles and fringe in mesh and laces hide against white and glow against black. Starting dark forces you to clean those areas before export, and you can still flip to white to catch any dark fringe hiding there.',
      },
      {
        question: 'How do I keep the gap under the arch transparent?',
        answer:
          'The negative space beneath an arched sole is frequently filled by the model. Zoom in and Smart Erase that surface so it reads as true transparency, then confirm on both black and white that the gap is clean before you export.',
      },
      {
        question: 'Will translucent laces and mesh survive the cut?',
        answer:
          'They can thin out under an automatic peel. Use Restore at low opacity along laces and mesh panels after Refine, and prefer a soft edge on knit uppers so the material still looks like fabric rather than a hard plastic outline.',
      },
      {
        question: 'Which export is best for a sneaker grid?',
        answer:
          'Use PNG so the crisp silhouette keeps real alpha for compositing onto branded plates. Generate a JPG-white or WebP from the same matte when a marketplace needs it, but keep the PNG master for hype grids and print.',
      },
      {
        question: 'How do I make a row of shoes look consistent?',
        answer:
          'Hold camera angle, distance, and lighting direction steady across every pair, and cut each shoe with the same welt Refine approach. Consistent input plus a consistent process makes a wall of sneakers read as one cohesive shoot rather than mismatched cutouts.',
      },
    ],
  },
  'bgremover-cosmetics': {
    eyebrow: 'Beauty and skincare',
    h2: 'Reflective bottle cutouts judged on a soft blush field',
    lead:
      'Cosmetics packaging is deceptively hard to matte because glass serum bottles, frosted jars, and glossy tubes reflect their surroundings and carry semi-transparent caps and droppers. An aggressive automatic peel dulls those reflections and turns premium glass into flat plastic. This preset opens on a soft blush field, gentle enough to keep pastel product colors readable while still exposing rim reflections and edge contamination, and it leaves Refine off so Smart Erase can be the primary, non-destructive cleanup tool. WebP export keeps beauty category grids fast where the format is accepted. Independent beauty brands and studios can process unlaunched SKUs and shade extensions without parking them in a remover bucket. Use this route for reflective bottles and jars, not for a person applying makeup or a busy flat lay you want to keep intact.',
    whyPreset:
      'A blush field is gentler than stark white for beauty color QA yet still reveals the rim reflections and green or blue casts that glass picks up from a shoot surface. Leaving Refine off protects micro highlights and frosted edges that a peel would chew, making Smart Erase the smarter first move. WebP is highlighted because beauty landing pages and category grids load many product thumbnails and benefit from lighter files. The tip names glass reflections so operators inspect the caps, shoulders, and droppers where cosmetics cutouts most often fail.',
    workflowTip:
      'Shoot with polarized or controlled lighting when you can, because reducing specular chaos on set saves far more time than any brush later. After the model runs, keep Refine off and Smart Erase the surface and any stand first. Zoom the cap, dropper, and bottle shoulder to inspect reflections and edge color. Restore semi-transparent glass or a frosted cap at low opacity, accepting imperfect transparency rather than inventing pixels. Erase any green or blue fringe the surface reflected onto the glass. Export WebP for the site grid and keep a PNG for print or retoucher handoff.',
    privacyNote:
      'Shade extensions, reformulations, and full unlaunched lines are closely guarded until a reveal, and a cloud remover is an unnecessary place for them to leak. Local inference keeps those macros in the browser, with only the public model weights downloading once. NDA shoots for retailers can finish mattes on the tethering laptop, and studios handling several beauty clients avoid pooling product imagery in a shared SaaS history that could surface the wrong brand in the wrong place.',
    scenarioH2: 'Prepping a skincare grid before a shade or line launch',
    scenarioBody:
      'Open this preset when a beauty brand needs clean bottle and jar cutouts for a category grid while the line is still embargoed. Cut each product on blush, rely on Smart Erase rather than an automatic peel, and inspect every cap and dropper for reflections and color fringe. Restore frosted or glass sections gently and accept realistic partial transparency. Export WebP for the staging site and keep a PNG for print partners. If a retailer demands white, flip the swatch only for that export and do not destroy the master. For sets with reflective shrink bands, prefer careful Erase over Refine so the highlight shape that signals premium glass survives.',
    edgesH2: 'Glass rims, droppers, and frosted caps on blush',
    edgesBody:
      'Cosmetics edges fail at reflective rims, semi-transparent droppers, and frosted caps. On blush, a green or blue cast reflected from the shoot surface onto clear glass is visible, so Erase that fringe without dulling the genuine highlight. Droppers and glass shoulders are partly transparent by nature; Restore them at low opacity and accept that a serum bottle should look like glass, not a solid cutout. Frosted caps need a soft edge rather than a hard one. Avoid any global Refine that would flatten the specular story that makes the product read as premium. Export WebP once the reflections look natural on both blush and a neutral proof.',
    faqs: [
      {
        question: 'Why is Refine off by default for cosmetics?',
        answer:
          'Reflective glass and frosted plastic look worse after an automatic peel that dulls highlights and flattens edges. Leaving Refine off makes Smart Erase the primary, non-destructive tool, so premium bottles keep the specular detail that signals quality.',
      },
      {
        question: 'How do I handle a semi-transparent glass bottle?',
        answer:
          'Accept realistic partial transparency instead of forcing a solid cutout. Restore glass shoulders and droppers at low opacity along their edges, and correct white balance in your raw pipeline so the product color stays true after the background is gone.',
      },
      {
        question: 'What causes a colored fringe on my clear bottle?',
        answer:
          'The shoot surface reflects onto the glass, leaving a green or blue cast along the edge. Zoom in and soft Erase that fringe after the model runs. Shooting on a neutral surface with controlled light reduces the problem before you ever cut.',
      },
      {
        question: 'Why suggest WebP for beauty product grids?',
        answer:
          'Category and landing pages load many product thumbnails, and WebP keeps them light without visible quality loss on phones. Keep a PNG for print or retoucher handoff, and re-export from the same matte if a CMS rejects WebP.',
      },
      {
        question: 'Can I cut a makeup flat lay with several products?',
        answer:
          'Overlapping items and props confuse a single silhouette. For clean grids, shoot and cut each bottle or jar individually. Keep a styled flat lay intact as a lifestyle image rather than trying to matte the whole scene at once.',
      },
    ],
  },
  'bgremover-documents': {
    eyebrow: 'Paper and records',
    h2: 'Clean white document scans with crisp paper edges',
    lead:
      'Turning a phone photo of a page, receipt, certificate, or invoice into a tidy digital record usually means lifting the paper off a desk and dropping it onto even white. This preset is built for that clerical job, not for creative composites. It opens on pure white to match archive and print templates, and it deliberately leaves Refine off, because a document edge should be a straight, crisp paper line, not a feathered photographic peel that makes the page look torn. Sensitive paperwork, contracts, medical forms, and financial statements never leave the browser, which is the whole point when the content is confidential. Use this route to standardize scans and receipts into clean white-field images. It complements rather than replaces a dedicated document scanner app for perspective correction.',
    whyPreset:
      'Pure white is the visual language of document archives, print packets, and expense systems, so previewing there tells you exactly how the scan will land. Leaving Refine off is essential: feathering a paper edge produces a fuzzy, torn-looking border, whereas documents need a straight, high-contrast boundary. JPG-white is highlighted because most record systems and forms want a flat rectangle rather than transparency. The tip names crisp paper edges so operators resist the urge to soften an edge that should stay sharp, keeping the fingerprint distinct from photographic presets.',
    workflowTip:
      'Photograph the page as square-on as possible under even light, because the cutout keeps the shape you give it and cannot fix heavy keystoning on its own. After the model runs, leave Refine off and rely on Smart Erase to clear any desk texture the model missed near the corners. Zoom each corner to confirm the paper boundary is a clean line, and Restore any corner the peel clipped. Straighten the page in your editor if needed, then export JPG on white for the archive. Keep a PNG only if you might recomposite the page onto a form template later.',
    privacyNote:
      'Documents are among the most sensitive things anyone photographs: contracts, IDs, medical letters, bank statements, and signed forms. Local WebAssembly inference means those pages never transit a remover API or sit in an upload window, with only public model weights downloading once. That lets an HR team, a clinic, or a finance desk standardize scans inside a managed browser without adding a data-processing agreement for a background tool. You still must protect the exported files under your normal records-retention and access policies, because local cutout is one control, not the whole program.',
    scenarioH2: 'Standardizing receipts and certificates into clean archives',
    scenarioBody:
      'Use this preset when a stack of phone photos of receipts, certificates, or single pages must become tidy white-field images for an archive or expense system. Shoot each page square-on, cut on white with Refine off, and Smart Erase any desk grain near the edges. Straighten the page, confirm the four corners read as crisp paper, and export JPG-white for the record. Process sensitive paperwork on the same managed machine where it will be stored so it never touches a cloud tool. For multi-page documents, keep a consistent crop and naming scheme so pages stay in order, and pair this with a scanner app when heavy perspective correction is required.',
    edgesH2: 'Straight paper borders and clipped corners on white',
    edgesBody:
      'Document edges have one job: read as a clean, straight paper border on white. The most common failures are a feathered edge that looks torn, a clipped corner where the peel ate the page, and leftover desk texture hiding just outside the boundary. Keep Refine off so the edge stays sharp, and use Smart Erase to remove desk grain near the corners without biting into the paper. Restore any corner the model clipped so the rectangle stays complete. Zoom each corner at high magnification, because a one-pixel notch is obvious on white archive pages. Export JPG-white only after all four corners and edges read as crisp paper.',
    faqs: [
      {
        question: 'Why is Refine off for document scans?',
        answer:
          'A document edge should be a straight, crisp paper line. Feathering it with a peel makes the page look torn or fuzzy. Leaving Refine off keeps the border sharp, and Smart Erase handles any desk texture that lingers near the corners.',
      },
      {
        question: 'Can this fix a skewed or angled page photo?',
        answer:
          'It removes the background but keeps the shape you captured. For heavy keystoning, shoot square-on or use a dedicated scanner app for perspective correction first, then run this tool to place the corrected page on a clean white field.',
      },
      {
        question: 'Is this safe for confidential paperwork?',
        answer:
          'Inference runs locally, so the page never uploads to a remover service and only public model weights download once. That removes the upload hop, but you still must store and share the exported file under your own records-retention and access controls.',
      },
      {
        question: 'Why export JPG on white instead of transparent PNG?',
        answer:
          'Most archives, forms, and expense systems expect a flat rectangle on white rather than transparency. JPG-white matches that expectation directly. Keep a PNG only if you plan to recomposite the page onto a form template later.',
      },
      {
        question: 'How do I keep the four corners looking clean?',
        answer:
          'Zoom each corner to high magnification and check for clipped notches or leftover desk grain. Use Restore to rebuild any clipped corner and Smart Erase to clear texture just outside the paper, so the finished rectangle looks complete and crisp on white.',
      },
    ],
  },
  'bgremover-group-photos': {
    eyebrow: 'Teams and families',
    h2: 'Multi-person cutouts with every hairline kept honest',
    lead:
      'A group photo multiplies every hard part of a portrait cutout. Instead of one hairline you have five, instead of one collar you have overlapping shoulders, and the gaps between people become tiny background pockets that a lazy matte leaves as gray islands. This preset opens on a transparent checkerboard so alpha stays honest across all of those junctions, and it turns Refine on because a group frame benefits from a controlled peel along many edges at once. PNG export preserves the partial alpha that hair needs when the team lands on a branded backdrop. Companies, schools, sports clubs, and families can cut a whole group without uploading everyone faces to a remover service. Use this route for a shared backdrop replacement, not for isolating a single person from a crowd.',
    whyPreset:
      'A transparent grid is the honest surface for a group because it exposes the background pockets between people that white would hide, and those pockets are the signature failure of group cutouts. Refine is on because a group has many edges that a single controlled peel improves at once, saving time versus brushing each person separately. PNG preserves the partial alpha that multiple hairlines need for a clean composite. The tip names hairlines between people so operators inspect the gaps and junctions first, which is where a team photo most often looks cut out.',
    workflowTip:
      'Ask the group to leave small gaps between shoulders when possible, because touching silhouettes are far harder to separate cleanly. After the model runs, Refine once, then zoom to each hairline and each gap between people in turn. Erase the little background pockets that survive between arms and shoulders, and Restore flyaways along the outer edges of the group. Keep brush sizes small around glasses and collars. Flip to a dark proof once to catch light halo on hair, then export PNG so every hairline keeps its alpha for the final branded backdrop.',
    privacyNote:
      'A group photo is a pile of biometric-adjacent data: many identifiable faces, sometimes including minors in a school or club setting. Keeping inference local means none of those faces reach a remover API or sit in an upload window, with only public model weights downloading once. Organizations that must limit third-party processing of member or employee images can cite local WebAssembly as the technical control. Still obtain the consent your context requires for the shoot itself, since local processing covers the cutout hop, not the entire chain.',
    scenarioH2: 'Replacing the backdrop for a team or class photo',
    scenarioBody:
      'Use this preset when a company, school, or sports club needs to drop a whole group onto a branded backdrop without sending everyone faces to a cloud tool. Import the group, Refine once, and then work methodically along each hairline and each gap between people, erasing the small background pockets that survive between shoulders. Restore outer flyaways so the group edge looks natural. Export a PNG master and composite it onto the approved backdrop in your design tool, where you can add a subtle shadow if the layout wants one. For recurring events, keep camera distance and grouping consistent so successive class or team photos share a look.',
    edgesH2: 'Overlapping shoulders, gaps, and many hairlines',
    edgesBody:
      'Group edges fail in the spaces people forget to check: the pockets of background between arms and shoulders, the overlapping junctions where one person crosses in front of another, and the sheer number of hairlines. On the checkerboard, hunt every enclosed gap and Erase leftover background so it does not read as a gray island in the final composite. At overlaps, decide which edge is foreground and clean it deliberately. Refine feathers the many hairlines at once; Restore outer flyaways sparingly. Flip to dark to catch light halo, then export PNG only when every gap is clean and each hairline holds at full-screen zoom.',
    faqs: [
      {
        question: 'How do I clean the background between people?',
        answer:
          'The gaps between shoulders and arms become small background pockets. On the transparent grid, zoom into each enclosed gap and Erase the leftover background so it does not appear as a gray island once the group is composited onto a new backdrop.',
      },
      {
        question: 'What if shoulders are touching or overlapping?',
        answer:
          'Touching silhouettes are the hardest part of a group cut. Decide which edge is foreground at each overlap and clean it deliberately. When you can influence the shoot, ask the group to leave small gaps so the model separates people more cleanly.',
      },
      {
        question: 'Why is Refine on for group photos?',
        answer:
          'A group has many hairlines and edges, and a single controlled Refine pass improves all of them at once, which is far faster than brushing each person individually. You then Restore outer flyaways and clean the between-people gaps by hand.',
      },
      {
        question: 'Is it safe to cut a photo full of faces here?',
        answer:
          'Inference runs locally, so none of the faces upload to a remover service and only public model weights download once. That is especially relevant for schools and clubs, though you still need the consent your context requires for the original shoot.',
      },
      {
        question: 'Which export keeps multiple hairlines clean?',
        answer:
          'Use PNG so the partial alpha across every hairline survives into the composite. Add the new backdrop and any shadow in your design tool afterward, and keep the PNG master so you can recomposite the same group onto different plates later.',
      },
    ],
  },
  'bgremover-twitch-thumbs': {
    eyebrow: 'Streaming thumbnails',
    h2: 'Bold streamer cutouts judged on a plum overlay canvas',
    lead:
      'Twitch thumbnails, stream schedule cards, and panel art all fight for attention against saturated overlays, so a streamer cutout has to pop at small scale with a clean, slightly bold edge. This preset opens on a plum canvas that mimics the loud contrast of a stream overlay, revealing halo before you drop the subject onto explosive typography. Refine is on to clean the hair pops and headset foam that gaming setups always involve, and WebP export keeps thumbnails and panels light for fast uploads and quick channel loads. Streamers and editors avoid sending recognizable channel faces and unreleased collab reveals to yet another cloud editor. Use this route when the deliverable is a punchy filled thumbnail or overlay element, not a marketplace product on plain white.',
    whyPreset:
      'A plum canvas approximates the saturated contrast of stream overlays, so halo and soft sludge that would vanish on white are obvious before the subject meets big type. Refine is on because gaming frames involve hair, hands, and headset foam that benefit from one controlled peel. WebP is highlighted because thumbnails and panels are usually flattened for upload and should stay light for fast channel loads. The tip names the overlay contrast so the widget state speaks the streamer vocabulary and inspection starts against a realistic busy field rather than a clean studio white.',
    workflowTip:
      'Pick or shoot a frame with a large face or prop, since tiny subjects disappear once a thumbnail is scaled to the browse grid. After the model runs, inspect on plum, Refine once, and Erase leftover room and desk clutter. Restore hair pops and translucent parts of a headset mic that the peel thinned. Flip briefly to a light proof so dark fringe near a hood or headset band does not hide only on plum. Export WebP for a filled thumbnail, or keep a PNG to composite the subject into a template with layered type and effects, then check the result at browse-grid size.',
    privacyNote:
      'Channel faces, unreleased collab reveals, and sponsor assets are business-critical for a streamer, and a consumer remover is one more place they can leak before a premiere. Local inference keeps those frames in the tab, with only public model weights downloading once, so an editing team can batch thumbnails without a shared SaaS workspace full of face crops. Secure the drive where your layered thumbnail files live after export, because the privacy win covers the cutout hop rather than your whole storage setup.',
    scenarioH2: 'Batching stream thumbnails and panels for the week',
    scenarioBody:
      'Open this preset when you are building a week of Twitch thumbnails, schedule cards, or panel art. Cut each streamer or prop on plum, Refine once, and Erase the room and desk clutter behind the setup. Keep faces large enough to read in the browse grid and hold a consistent light direction so the channel look stays cohesive. Export WebP for filled thumbnails or a PNG to composite into a template with layered type, glow, and borders. If a stream is an embargoed collab, local processing means the reveal never appears in a shared remover account before you go live. Reuse mattes carefully when episodes share the same headset and wardrobe setup.',
    edgesH2: 'Hair pops, headset foam, and prop outlines on plum',
    edgesBody:
      'Streaming thumbnails must read at tiny browse sizes, so edges should be slightly bold rather than film-soft. On plum, a halo around hair pops and the fuzzy edge of headset foam glows, so Erase those rings without eating the shape. Headset mics and boom arms have thin, partly transparent parts; Restore them and accept some manual finishing. Prop outlines should stay crisp so they survive against saturated type. Flip to a light proof once so a dark hood or headset band does not hide fringe that only looks clean on plum. Export WebP when the subject still pops at a small preview, the size viewers actually browse.',
    faqs: [
      {
        question: 'Why judge Twitch thumbnails on a plum canvas?',
        answer:
          'Plum approximates the saturated contrast of stream overlays, so halo and soft sludge that hide on white are obvious against it. Cleaning the edge on plum means the subject still pops once it lands on explosive thumbnail typography.',
      },
      {
        question: 'How do I handle headset and mic edges?',
        answer:
          'Headset foam and boom arms have thin, partly transparent parts that an automatic peel tends to thin out. Refine once, then Restore those sections and Erase any halo without eating their shape. Expect a little manual finishing for a premium channel look.',
      },
      {
        question: 'Should the final thumbnail stay transparent?',
        answer:
          'Usually not. Twitch thumbnails and panels are filled images, so flatten the subject onto a high-contrast designed plate. Keep a PNG master if you will rebuild the thumbnail later with new type, and export WebP for the flattened upload.',
      },
      {
        question: 'Why WebP instead of PNG for stream art?',
        answer:
          'Thumbnails and panels should load fast and stay light, and WebP delivers that without visible loss at browse sizes. Keep a PNG when you need layered compositing or lossless archival, and re-export from the same matte if a tool rejects WebP.',
      },
      {
        question: 'My streamer looks tiny after cutout — what do I fix?',
        answer:
          'Scale matters more than edge softness on a thumbnail. Start from a frame with a large face or prop, and if the subject reads small, increase its size in the template rather than adding Refine passes. Always check the result at browse-grid size.',
      },
    ],
  },
};
