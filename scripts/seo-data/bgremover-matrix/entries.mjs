/**
 * BG Remover PSEO — 10 use-case entries (widget state only).
 * Editorial copy lives in editorials.mjs (anti-doorway uniqueness).
 */

/** @type {Omit<import('zod').infer<typeof import('./schema.mjs').MatrixEntrySchema>, 'editorial'>[]} */
export const MATRIX_ENTRIES = [
  {
    id: 'bgremover-ecommerce',
    useCase: 'ecommerce',
    useCaseLabel: 'Ecommerce catalog',
    title: 'Background Remover for Ecommerce Product Photos — Private | VeloTools',
    description:
      'Cut product photos to clean white or transparent PNG in your browser. No upload, no account. Built for Shopify and catalog workflows.',
    h1: 'Background remover for ecommerce product photos',
    heroSub:
      'Private cutouts for catalog shots. Preview on white, export PNG or JPG — pixels never leave your device.',
    intentBanner: 'Ecommerce preset · preview white · export PNG · Refine ready',
    config: {
      defaultBg: '#ffffff',
      bgSwatchIndex: 1,
      exportHint: 'png',
      suggestRefine: true,
      tipLabel: 'Check edges on white before export',
    },
  },
  {
    id: 'bgremover-portraits',
    useCase: 'portraits',
    useCaseLabel: 'Portraits and hair',
    title: 'AI Portrait Background Remover — Hair Detail, No Upload | VeloTools',
    description:
      'Remove portrait backgrounds with hair-friendly refine tools. Runs fully in-browser. Restore brush for flyaways, no cloud upload.',
    h1: 'Portrait background remover with hair-safe edges',
    heroSub:
      'Tuned for people and flyaway hair. Start with Refine, then Restore at low opacity — all offline after model cache.',
    intentBanner: 'Portrait preset · transparent grid · Refine first · PNG export',
    config: {
      defaultBg: 'transparent',
      bgSwatchIndex: 0,
      exportHint: 'png',
      suggestRefine: true,
      tipLabel: 'Zoom 200% and Refine once for hair fringe',
    },
  },
  {
    id: 'bgremover-etsy',
    useCase: 'etsy',
    useCaseLabel: 'Etsy listings',
    title: 'Etsy Background Remover — Handmade Photos Stay Private | VeloTools',
    description:
      'Prep Etsy listing photos with local AI cutouts. White JPG for marketplace rules or transparent PNG for mockups — never uploaded.',
    h1: 'Background remover for Etsy handmade listings',
    heroSub:
      'Keep craft photos on-device. White preview matches common Etsy listing expectations; export JPG-white when ready.',
    intentBanner: 'Etsy preset · white preview · JPG-white export · privacy first',
    config: {
      defaultBg: '#ffffff',
      bgSwatchIndex: 1,
      exportHint: 'jpg-white',
      suggestRefine: false,
      tipLabel: 'Export JPG on white for listing images',
    },
  },
  {
    id: 'bgremover-amazon',
    useCase: 'amazon',
    useCaseLabel: 'Amazon main images',
    title: 'Amazon Product Background Remover — White BG in Browser | VeloTools',
    description:
      'Create Amazon-style white-background main images locally. No server upload. Soft Refine for clean product silhouettes.',
    h1: 'Amazon-style white background remover',
    heroSub:
      'Main-image workflow: cut out on-device, preview pure white, export JPG-white for marketplace submission.',
    intentBanner: 'Amazon preset · pure white · JPG-white · one Refine pass',
    config: {
      defaultBg: '#ffffff',
      bgSwatchIndex: 1,
      exportHint: 'jpg-white',
      suggestRefine: true,
      tipLabel: 'Marketplace tip: solid white, no shadow fringe',
    },
  },
  {
    id: 'bgremover-pets',
    useCase: 'pets',
    useCaseLabel: 'Pets and fur',
    title: 'Pet Photo Background Remover — Fur Edges On-Device | VeloTools',
    description:
      'Remove backgrounds from pet photos without uploading. Fur-friendly refine and restore brushes run entirely in your browser.',
    h1: 'Background remover for pet photos and fur',
    heroSub:
      'Whiskers and fur need gentle peels. Dark preview shows halo; Refine + Restore keep soft edges private.',
    intentBanner: 'Pets preset · black preview · Refine · Restore brush tip',
    config: {
      defaultBg: '#111111',
      bgSwatchIndex: 2,
      exportHint: 'png',
      suggestRefine: true,
      tipLabel: 'Use dark preview to spot fur halo',
    },
  },
  {
    id: 'bgremover-headshots',
    useCase: 'headshots',
    useCaseLabel: 'Pro headshots',
    title: 'Headshot Background Remover for LinkedIn — Local AI | VeloTools',
    description:
      'Clean professional headshots without sending faces to a cloud API. Soft blush preview, PNG export, on-device ISNet model.',
    h1: 'Private headshot background remover',
    heroSub:
      'For resumes and LinkedIn: soft blush preview, careful hair refine, transparent PNG for any studio backdrop.',
    intentBanner: 'Headshot preset · blush preview · PNG · no face upload',
    config: {
      defaultBg: '#F0DCE8',
      bgSwatchIndex: 7,
      exportHint: 'png',
      suggestRefine: true,
      tipLabel: 'Faces never leave this browser tab',
    },
  },
  {
    id: 'bgremover-jewelry',
    useCase: 'jewelry',
    useCaseLabel: 'Jewelry close-ups',
    title: 'Jewelry Background Remover — Sparkle Edges, No Upload | VeloTools',
    description:
      'Cut jewelry macros locally. Smart Erase helps with reflective stands; transparent PNG keeps metal highlights intact.',
    h1: 'Background remover for jewelry product macros',
    heroSub:
      'Small reflective subjects: Smart Erase for stands, transparent preview for metal edge checks, WebP for web galleries.',
    intentBanner: 'Jewelry preset · transparent · Smart Erase · WebP tip',
    config: {
      defaultBg: 'transparent',
      bgSwatchIndex: 0,
      exportHint: 'webp',
      suggestRefine: false,
      tipLabel: 'Smart Erase reflective stands, keep metal',
    },
  },
  {
    id: 'bgremover-apparel',
    useCase: 'apparel',
    useCaseLabel: 'Apparel flats',
    title: 'Clothing Background Remover — Ghost Mannequin Prep | VeloTools',
    description:
      'Prep apparel flats and hangers for lookbooks. Local AI cutout, gradient mock preview, PNG for design tools.',
    h1: 'Background remover for apparel and flat lays',
    heroSub:
      'Ghost-mannequin prep without a studio upload. Gradient preview for campaign mocks; PNG for Figma and Canva.',
    intentBanner: 'Apparel preset · gradient mock · PNG · hangers tip',
    config: {
      defaultBg: 'grad',
      bgSwatchIndex: 9,
      exportHint: 'png',
      suggestRefine: true,
      tipLabel: 'Erase hangers with Smart, then Refine hem',
    },
  },
  {
    id: 'bgremover-social',
    useCase: 'social',
    useCaseLabel: 'Social cutouts',
    title: 'Social Media Background Remover — Stories and Reels | VeloTools',
    description:
      'Make sticker-ready cutouts for Stories and Reels without cloud apps. Fast WebP export, black preview for contrast.',
    h1: 'Background remover for social stickers and Reels',
    heroSub:
      'Sticker workflow: black preview for contrast, one Refine click, WebP for lightweight social uploads.',
    intentBanner: 'Social preset · black preview · WebP · sticker-ready',
    config: {
      defaultBg: '#111111',
      bgSwatchIndex: 2,
      exportHint: 'webp',
      suggestRefine: true,
      tipLabel: 'WebP keeps Stories uploads light',
    },
  },
  {
    id: 'bgremover-transparent-png',
    useCase: 'transparent-png',
    useCaseLabel: 'Designers PNG',
    title: 'Transparent PNG Maker — Local Background Removal | VeloTools',
    description:
      'Export true transparent PNGs for Figma, Photoshop, and Canva. AI runs in-browser; checkerboard preview shows alpha clearly.',
    h1: 'Transparent PNG maker with on-device AI',
    heroSub:
      'Designers: checkerboard alpha preview, lossless PNG export, Refine for clean vectors-ready silhouettes.',
    intentBanner: 'Designer preset · checkerboard · PNG lossless · alpha-safe',
    config: {
      defaultBg: 'transparent',
      bgSwatchIndex: 0,
      exportHint: 'png',
      suggestRefine: false,
      tipLabel: 'Checkerboard = true alpha, export PNG',
    },
  },
];
