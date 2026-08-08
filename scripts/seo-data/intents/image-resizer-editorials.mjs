/**
 * Handcrafted image-resizer PSEO editorials — unique per slug.
 * Anti-doorway: unique H2/FAQ/paragraphs; ≥600 words; platform facts locked to widget.
 */
export const IMAGE_RESIZER_EDITORIALS = {
  'image-resizer-for-amazon': {
    securityH2: 'Keep Amazon listing photos on your device while you resize',
    securityHtml: `<p>Amazon Seller Central already asks for a lot of trust. You should not add a random “online image resizer” that stores your main image for an hour. On this page the JPEG never leaves your laptop or phone: the browser crops to a locked <strong>2000×2000</strong> square, encodes at JPEG quality <strong>85</strong>, and only then lets you download a file you upload yourself.</p>
<p>Packaging mockups, unfinished SKUs, and competitor comparison shots stay in tab memory. Close the tab and the pixels are gone — VeloTools never receives the file.</p>`,
    problemH2: 'Why Amazon rejects product images that look fine on your phone',
    problemHtml: `<p>Phone galleries look sharp at arm’s length and still fail Amazon’s catalog rules. The common traps are a non-square aspect ratio, fewer than about two thousand pixels on the long edge, a file that balloons past <strong>10 MB</strong>, or a busy background that fights the white-backdrop expectation for many main images.</p>
<p>Sellers also export from Lightroom or Canva at 4000×3000 “just to be safe,” then watch Seller Central choke on weight or silently downscale in a way that softens logos. This URL exists for that moment: force the square, hit the pixel floor Amazon’s zoom UI expects, and keep bytes under the practical <strong>10 MB</strong> checker before you waste another upload attempt.</p>
<p>If you only need general compression without a marketplace crop, open <a href="/image-compress/">Image Compress</a> instead. PDF packing slips and invoices belong under <a href="/pdf-tools/">PDF tools</a>, not here.</p>`,
    stepsH2: 'Resize a main image to Amazon’s 2000×2000 square',
    steps: [
      'Drop the camera or studio file — 1:1 crop and 2000×2000 output are already locked for Amazon.',
      'Adjust the crop so the product fills the frame with clean margins, then run Resize / Compress All.',
      'Download when the size check stays under 10 MB, then upload in Seller Central; still heavy? nudge quality down once on Image Compress.',
    ],
    specsH2: 'Amazon catalog image locks on this page',
    specs: [
      ['Problem it solves', 'Amazon main image wrong size / over 10 MB'],
      ['Output', '2000×2000 px, 1:1 square'],
      ['JPEG quality', '85 (sharp zoom, controlled weight)'],
      ['Size check', '10 MB before download'],
      ['Privacy', 'Browser-only — no VeloTools upload'],
      ['Related', 'Etsy · Walmart · Image Compress'],
    ],
    presetH2: 'What the Amazon JPEG 85% preset actually changes',
    presetHtml: `<p>Quality <strong>85</strong> is a deliberate middle: crisp enough for Amazon’s hover zoom, light enough that a white-background product rarely trips the <strong>10 MB</strong> warning. Dimensions stay hard-locked so you cannot accidentally ship a 1080 Instagram square into a listing that expects catalog-grade pixels.</p>
<p>Compared with <a href="/image-resizer-for-walmart/">Walmart’s tighter 5 MB gate</a>, Amazon gives more byte room, so we keep a higher quality bias here. For handmade listings with flexible crops, switch to <a href="/image-resizer-for-etsy/">Image Resizer for Etsy</a>.</p>`,
    deepH2: 'Zoom, white backgrounds, and the 10 MB Amazon ceiling',
    deepHtml: `<p>Amazon’s detail page rewards images that survive zoom. That is why sellers aim near <strong>2000×2000</strong> even when smaller files “technically upload.” Undersized assets look soft the moment a shopper pinches in; oversized RAWs waste bandwidth and sometimes fail the <strong>10 MB</strong> practical limit we enforce on this page.</p>
<p>Main images for many categories still expect a clean backdrop. Cropping to 1:1 before upload prevents the silent letterboxing Amazon applies when you send a tall phone photo. Secondary lifestyle shots can be looser — prepare those on unlocked <a href="/image-compress/">Image Compress</a> after the main SKU is done.</p>
<p>Selling the same SKU on multiple channels? Prep Amazon here, then clone with marketplace-specific siblings: <a href="/image-resizer-for-ebay/">eBay 1600</a>, <a href="/image-resizer-for-shopify/">Shopify ~2048</a>, or <a href="/image-resizer-for-google-merchant/">Google Merchant 1500</a>. Packing lists and return forms stay in <a href="/pdf-tools/">PDF tools</a>.</p>
<p>Always keep your original master. This tool outputs a marketplace JPEG, not an archival TIFF.</p>`,
    faqH2: 'Amazon product image sizing questions sellers ask',
    faq: [
      {
        q: 'What size should an Amazon product main image be?',
        a: 'Aim for a 2000×2000 pixel square JPEG. That resolution supports zoom and matches the locked preset on this page, with a practical 10 MB ceiling.',
      },
      {
        q: 'Does this upload my Amazon photos to VeloTools?',
        a: 'No. Resizing runs entirely in your browser. You download the result and upload it in Seller Central yourself.',
      },
      {
        q: 'Why is JPEG quality set to 85 for Amazon?',
        a: 'Quality 85 keeps logos and fabric texture readable in zoom without routinely blowing past the 10 MB checker that catches heavy studio exports.',
      },
      {
        q: 'Can I use a 1080×1080 Instagram crop as my Amazon main image?',
        a: 'It may upload, but zoom looks soft. Upscale-aware workflows still prefer a true 2000×2000 source — start from the highest-resolution master you have.',
      },
      {
        q: 'What if the file is still over 10 MB after resizing?',
        a: 'Flatten layers, avoid PNG when JPEG is allowed, or run a second pass on Image Compress with slightly lower quality while keeping 2000×2000.',
      },
    ],
  },

  'image-resizer-for-etsy': {
    securityH2: 'Craft listing photos stay local while you hit Etsy’s pixel floor',
    securityHtml: `<p>Handmade catalogs often include unreleased designs and customer commissions. Dropping those frames on a public compress site is unnecessary risk. Here the browser scales toward Etsy’s comfortable <strong>~2000 px</strong> listing target, encodes JPEG at quality <strong>82</strong>, and keeps the file under a <strong>10 MB</strong> check — without a server round-trip.</p>
<p>Nothing syncs to our backend. You download, then attach in Etsy Studio when you are ready.</p>`,
    problemH2: 'Soft phone photos that fail Etsy’s minimum width',
    problemHtml: `<p>Etsy buyers zoom. A charming 1200-pixel phone snap that looked fine in Messages can look mushy on a desktop listing. Sellers also ship ultra-tall portrait frames that crop oddly in search cards, or export PNG collages that quietly exceed <strong>10 MB</strong>.</p>
<p>This page biases toward a <strong>2000×2000</strong> working canvas without forcing a rigid 1:1 lock the way Amazon does — useful when your craft photo is intentionally rectangular. Quality <strong>82</strong> trims studio bloat while keeping watercolor texture and wood grain honest.</p>
<p>Need a hard square for ads? Pair with <a href="/image-resizer-for-instagram/">Instagram</a> or <a href="/image-resizer-for-pinterest/">Pinterest</a> after the listing hero is done. General compress-only jobs stay on <a href="/image-compress/">Image Compress</a>.</p>`,
    stepsH2: 'Prep an Etsy listing photo for the 2000 px target',
    steps: [
      'Add the craft photo — dimensions target 2000×2000 with flexible aspect (not a forced Amazon square).',
      'Frame the product so search thumbnails still read at a glance, then run the locked Etsy resize.',
      'Confirm the download is under 10 MB and upload in Etsy; for pins or Reels, open the matching sibling resizer next.',
    ],
    specsH2: 'Etsy listing image profile locked here',
    specs: [
      ['Problem it solves', 'Etsy photo too small / over 10 MB'],
      ['Target size', '~2000×2000 px (flexible aspect)'],
      ['JPEG quality', '82'],
      ['Size check', '10 MB'],
      ['Privacy', 'Local browser processing only'],
      ['Compare', 'Amazon forces 1:1; Etsy stays flexible'],
    ],
    presetH2: 'Why Etsy mode uses quality 82 without a forced square',
    presetHtml: `<p>Makers shoot on tables, in daylight nooks, and against patterned backdrops. Forcing every frame into a perfect square would chop handles off mugs and crop signatures off prints. Quality <strong>82</strong> plus a <strong>2000</strong>-class target is the compromise: sharp enough for zoom, light enough for mobile shoppers on cellular.</p>
<p>When the same SKU also needs a marketplace square, use <a href="/image-resizer-for-amazon/">Amazon</a> or <a href="/image-resizer-for-ebay/">eBay</a>. Storefront themes on your own domain may prefer <a href="/image-resizer-for-shopify/">Shopify’s ~2048 preset</a>.</p>`,
    deepH2: 'Flexible aspect ratios vs marketplace square crops',
    deepHtml: `<p>Etsy’s discovery UI tolerates more compositional freedom than hard 1:1 catalog giants. That freedom is why this preset refuses Amazon-style aspect lock while still pushing you toward roughly <strong>2000</strong> pixels so Retina screens do not invent soft edges.</p>
<p>Watch file weight: multi-layer PNGs from design apps casually pass <strong>10 MB</strong>. Convert to JPEG here unless you truly need transparency (Etsy listing photos generally do not).</p>
<p>Cross-posting a successful listing? Rebuild channel-specific masters instead of stretching one crop everywhere — <a href="/image-resizer-for-pinterest/">1000×1500 pins</a>, <a href="/image-resizer-for-instagram/">1080 squares</a>, and <a href="/image-resizer-for-facebook/">Facebook catalog 1200</a> each have their own page. Invoices and pattern PDFs live in <a href="/pdf-tools/">PDF tools</a>.</p>
<p>Keep RAW or full-resolution masters offline; this export is a selling asset, not your archive.</p>`,
    faqH2: 'Etsy photo size and quality FAQ for makers',
    faq: [
      {
        q: 'What image size works best for Etsy listings?',
        a: 'Target about 2000 pixels on the long edge. This page aims at a 2000×2000 working size with flexible aspect so craft compositions are not forced into a hard square.',
      },
      {
        q: 'Is my unreleased design uploaded when I resize?',
        a: 'No. Processing stays in the browser. Only the file you later add in Etsy Studio leaves your device.',
      },
      {
        q: 'Why quality 82 instead of maximum JPEG?',
        a: 'Quality 82 usually preserves glaze, fabric, and paper texture while staying under Etsy’s practical 10 MB comfort zone for mobile buyers.',
      },
      {
        q: 'Can I keep a tall portrait photo for pottery?',
        a: 'Yes — unlike Amazon mode, aspect is not hard-locked here. Just make sure the export still lands near the 2000 px target and under 10 MB.',
      },
      {
        q: 'Should I use PNG for transparent product cutouts on Etsy?',
        a: 'Most listing slots expect standard photos. Prefer JPEG unless a specific graphic needs transparency; PNGs are the usual reason uploads hit 10 MB.',
      },
    ],
  },

  'image-resizer-for-ozon': {
    securityH2: 'Resize Ozon card photos without sending them to a cloud editor',
    securityHtml: `<p>Ozon product cards travel through seller cabinets that already host your catalog. Adding another upload hop to shrink photos is optional risk. This page crops to a locked <strong>900×1200</strong> (3:4) frame, writes JPEG at quality <strong>80</strong>, and warns past <strong>10 MB</strong> — all inside your browser tab.</p>
<p>Seasonal drafts and price-test creatives never touch VeloTools servers.</p>`,
    problemH2: 'Landscape phone shots that Ozon’s 3:4 card rejects',
    problemHtml: `<p>Western square exports look cropped or letterboxed on Ozon’s portrait-first cards. A 1:1 Amazon master leaves empty bands or chops packaging text when the cabinet expects <strong>3:4</strong>. Oversized studio TIFFs also trip weight limits even when the composition is correct.</p>
<p>We lock <strong>900×1200</strong> because that ratio matches how many Ozon category cards render on mobile. Quality <strong>80</strong> keeps Cyrillic labels on boxes readable without pampering a 40 MB dump from a tethered camera.</p>
<p>Shipping the same SKU to Wildberries? Use the sibling <a href="/image-resizer-for-wildberries/">Wildberries 900×1200</a> page (slightly different quality bias). Square markets stay on <a href="/image-resizer-for-amazon/">Amazon</a> or <a href="/image-resizer-for-aliexpress/">AliExpress</a>.</p>`,
    stepsH2: 'Crop and export a 900×1200 Ozon product card',
    steps: [
      'Drop the photo — 3:4 aspect and 900×1200 output are locked for Ozon cards.',
      'Slide the crop so the hero product sits high enough for mobile thumbs, then process.',
      'Download under the 10 MB check and upload in your Ozon seller tools; reuse masters via Image Compress if needed.',
    ],
    specsH2: 'Ozon product-card dimensions locked on this URL',
    specs: [
      ['Problem it solves', 'Ozon card wrong ratio / heavy file'],
      ['Output', '900×1200 px, 3:4 portrait'],
      ['JPEG quality', '80'],
      ['Size check', '10 MB'],
      ['Privacy', 'No upload during resize'],
      ['Sister page', 'Wildberries (same geometry, q79)'],
    ],
    presetH2: 'How the Ozon 3:4 JPEG 80% pack balances RU catalog weight',
    presetHtml: `<p>Portrait cards dominate Ozon’s mobile grid. Quality <strong>80</strong> is tuned for that grid: enough acuity for ingredient panels and brand marks, enough compression for cellular PDP loads. The <strong>10 MB</strong> checker catches forgotten RAW-to-JPEG mistakes before the cabinet rejects them.</p>
<p>Prefer a softer encode for denser WB traffic? Open <a href="/image-resizer-for-wildberries/">Image Resizer for Wildberries</a>. Need English-market squares afterward? Jump to <a href="/image-resizer-for-ebay/">eBay</a> or <a href="/image-resizer-for-shopify/">Shopify</a>.</p>`,
    deepH2: 'Portrait cards on Ozon versus square Western marketplaces',
    deepHtml: `<p>Copying an Amazon <strong>2000×2000</strong> file into Ozon is the fastest way to waste margin space. The card chrome expects taller art; square masters force awkward auto-crops that hide lids and neck labels. Start from the full-frame studio shot, then crop to <strong>900×1200</strong> here.</p>
<p>Text on packaging matters. If Cyrillic becomes blocky, re-export once from a sharper master rather than upscaling a small phone crop. The preset will not invent detail that was never captured.</p>
<p>Multi-marketplace teams should maintain a portrait master and a square master. Portrait siblings: <a href="/image-resizer-for-ozon/">Ozon</a> and <a href="/image-resizer-for-wildberries/">Wildberries</a>. Square siblings: <a href="/image-resizer-for-amazon/">Amazon</a>, <a href="/image-resizer-for-walmart/">Walmart</a>, <a href="/image-resizer-for-tiktok-shop/">TikTok Shop</a>. Compress-only cleanup: <a href="/image-compress/">Image Compress</a>. Spec sheets: <a href="/pdf-tools/">PDF tools</a>.</p>
<p>Close the tab after download if the shoot includes unreleased SKUs.</p>`,
    faqH2: 'Ozon image requirements sellers dig into',
    faq: [
      {
        q: 'What resolution should Ozon product card images use?',
        a: 'This page locks 900×1200 pixels at a 3:4 ratio with JPEG quality 80 and a 10 MB size check — a practical card-ready export for seller uploads.',
      },
      {
        q: 'Can I upload my Amazon square photo to Ozon as-is?',
        a: 'You can try, but the card layout is portrait-first. Recrop to 3:4 so lids and labels are not clipped by automatic framing.',
      },
      {
        q: 'Does VeloTools store my Ozon catalog photos?',
        a: 'No. The resize happens locally in the browser; only you upload the finished JPEG to Ozon.',
      },
      {
        q: 'How is this different from the Wildberries resizer?',
        a: 'Geometry matches (900×1200, 3:4), but Wildberries mode uses JPEG quality 79. Pick the page that matches the cabinet you are filling today.',
      },
      {
        q: 'My file is still too heavy after 900×1200 — what next?',
        a: 'Strip EXIF-heavy exports, avoid PNG, or run a second compress pass on Image Compress while keeping the same pixel box.',
      },
    ],
  },

  'image-resizer-for-shopify': {
    securityH2: 'Storefront assets never leave the browser on this Shopify resize',
    securityHtml: `<p>Theme previews, password-protected shops, and unreleased drops should not sit on a stranger’s CDN “temporary” bucket. Resize toward a <strong>~2048</strong> Shopify-friendly square canvas at JPEG quality <strong>84</strong>, with a generous <strong>20 MB</strong> guardrail, entirely on-device.</p>
<p>You download the asset, then push it through your own Shopify admin — we never see the pixels.</p>`,
    problemH2: 'Theme galleries that stretch when Shopify receives uneven pixels',
    problemHtml: `<p>Dawn-style themes and many paid themes assume large, relatively square product media. Feed them a 900-pixel marketplace leftover and the PDP looks soft next to app screenshots. Feed them a 6000-pixel tethered shoot and uploads crawl, especially on staff laptops uploading twenty variants.</p>
<p>This preset aims near <strong>2048×2048</strong> — the sweet spot many Shopify themes treat as “retina enough” — at quality <strong>84</strong>. The <strong>20 MB</strong> ceiling is intentionally looser than Amazon or Walmart because Shopify’s own CDN will recompress for storefront delivery.</p>
<p>Also selling on marketplaces? Build channel crops on <a href="/image-resizer-for-amazon/">Amazon</a>, <a href="/image-resizer-for-ebay/">eBay</a>, or <a href="/image-resizer-for-google-merchant/">Google Merchant</a> after the theme master exists. Pure weight reduction without resize: <a href="/image-compress/">Image Compress</a>.</p>`,
    stepsH2: 'Export a 2048-class Shopify product image',
    steps: [
      'Drop your studio master — output targets ~2048 square-ish pixels with quality 84 locked for Shopify themes.',
      'Center the product for collection grids, then run resize so theme zoom has enough source pixels.',
      'Download (20 MB checker on) and upload in Shopify admin; duplicate variants from the same master when possible.',
    ],
    specsH2: 'Shopify theme-friendly resize defaults',
    specs: [
      ['Problem it solves', 'Soft Shopify PDP / oversized theme uploads'],
      ['Output', '~2048×2048 px square-biased'],
      ['JPEG quality', '84'],
      ['Size check', '20 MB (CDN will optimize further)'],
      ['Privacy', 'Browser-only before Admin upload'],
      ['Related', 'Google Merchant · Instagram · Image Compress'],
    ],
    presetH2: 'Why Shopify mode aims near 2048 with JPEG 84 and 20 MB room',
    presetHtml: `<p>Shopify’s infrastructure handles delivery scaling; your job is to hand Admin a clean, large-enough master. Quality <strong>84</strong> preserves fabric swatches and jewelry facets that harsher marketplace presets smash. The <strong>20 MB</strong> warning exists for mistaken PSD-to-JPEG dumps, not because most theme images need that much headroom.</p>
<p>Social crops differ: use <a href="/image-resizer-for-instagram/">Instagram 1080</a> and <a href="/image-resizer-for-facebook/">Facebook catalog 1200</a> for ads. Printable lookbooks stay in <a href="/pdf-tools/">PDF tools</a>.</p>`,
    deepH2: 'CDN delivery, retina themes, and headroom under 20 MB',
    deepHtml: `<p>Merchants often over-optimize before upload, shipping crunchy 900 px files that look dated on 2× displays. Others upload camera originals and wonder why the Files section feels sluggish. A <strong>~2048</strong> JPEG at quality <strong>84</strong> is the pragmatic storefront master: sharp on modern phones, friendly to theme zoom apps, and still well under <strong>20 MB</strong> for normal products.</p>
<p>Collection grids crop aggressively. Leave safe margins around logos so automatic squares do not clip trademarks. Variant images should share the same framing language so swatches feel consistent.</p>
<p>Connect Shopping feeds with <a href="/image-resizer-for-google-merchant/">Google Merchant’s 1500 preferred square</a>. Marketplace expansions: <a href="/image-resizer-for-walmart/">Walmart</a>, <a href="/image-resizer-for-amazon/">Amazon</a>, <a href="/image-resizer-for-tiktok-shop/">TikTok Shop</a>. Bulk compress without changing geometry: <a href="/image-compress/">Image Compress</a>.</p>
<p>Keep layered design files in your own drive; this page only emits a selling JPEG.</p>`,
    faqH2: 'Shopify product image resize questions',
    faq: [
      {
        q: 'What product image size should I upload to Shopify?',
        a: 'A roughly 2048×2048 JPEG works well for most modern themes. This page locks that class of output at quality 84 with a 20 MB warning.',
      },
      {
        q: 'Will Shopify recompress my images anyway?',
        a: 'Yes — Shopify’s CDN serves responsive sizes. You still want a sharp master; garbage-in still yields soft storefronts.',
      },
      {
        q: 'Is resizing here private for unreleased drops?',
        a: 'Yes. Nothing is uploaded to VeloTools. Only your Shopify admin receives the file you choose to add later.',
      },
      {
        q: 'Why is the size limit 20 MB when Amazon uses 10 MB?',
        a: 'Shopify storefront uploads tolerate larger masters because delivery is CDN-managed. Marketplace cabinets are stricter — use those sibling pages when listing off-site.',
      },
      {
        q: 'Can I use the same file for Instagram ads?',
        a: 'Better to recrop. Instagram mode targets 1080×1080; feeding a 2048 Shopify master through that page keeps social compression cleaner.',
      },
    ],
  },

  'image-resizer-for-ebay': {
    securityH2: 'Auction photos resize on your PC before they hit eBay Seller Hub',
    securityHtml: `<p>Auction drafts, VIN plates, and serial-number closeups are sensitive even when the lot is public later. Resize to a solid <strong>1600×1600</strong> working square at JPEG quality <strong>83</strong>, with a <strong>12 MB</strong> checker, without parking those frames on an anonymous compress host.</p>
<p>Browser memory only — download, then upload in Seller Hub yourself. Keep the untouched camera originals offline for disputes while this export serves the live gallery.</p>`,
    problemH2: 'Blurry zoom when eBay upscales a too-small upload',
    problemHtml: `<p>eBay’s photo experience leans on zoom. A 800-pixel phone crop may “accept,” then look muddy when buyers enlarge scuffs and labels. Opposite problem: 24 MP phone dumps crawl on mobile Seller Hub and sometimes trip practical size friction even when the formal cap feels higher.</p>
<p>We standardize on <strong>1600×1600</strong> — a widely cited minimum-quality bar for sharp gallery zoom — at quality <strong>83</strong>, watching <strong>12 MB</strong> so multi-angle lots stay manageable. It is smaller than Amazon’s 2000 class but sharper than casual social squares.</p>
<p>Also listing on big-box marketplaces? See <a href="/image-resizer-for-walmart/">Walmart</a> and <a href="/image-resizer-for-amazon/">Amazon</a>. Storefronts: <a href="/image-resizer-for-shopify/">Shopify</a>.</p>`,
    stepsH2: 'Hit eBay’s 1600×1600 working target in three steps',
    steps: [
      'Drop each gallery angle — 1600×1600 and quality 83 are locked for eBay-style zoom.',
      'Crop so defects and labels stay inside the square, then process every angle consistently.',
      'Download under 12 MB and upload in Seller Hub; keep originals for disputes or returns evidence.',
    ],
    specsH2: 'eBay listing photo locks for this tool',
    specs: [
      ['Problem it solves', 'Soft eBay zoom / oversized gallery uploads'],
      ['Output', '1600×1600 px square'],
      ['JPEG quality', '83'],
      ['Size check', '12 MB practical guardrail'],
      ['Privacy', 'Local resize only'],
      ['Compare', 'Amazon 2000 · Instagram 1080'],
    ],
    presetH2: 'JPEG 83 and a 12 MB guardrail for eBay galleries',
    presetHtml: `<p>Quality <strong>83</strong> keeps scratches and fabric naps honest — critical for used and collectible categories — without treating every frame like a print master. The <strong>12 MB</strong> guardrail is a seller-friendly ceiling for batches of twelve angles, not a claim that eBay’s absolute API limit equals twelve.</p>
<p>Need tighter bytes for Walmart? Use <a href="/image-resizer-for-walmart/">Walmart’s 5 MB mode</a>. Social teasers: <a href="/image-resizer-for-instagram/">Instagram</a>. General shrink: <a href="/image-compress/">Image Compress</a>.</p>`,
    deepH2: 'Minimum pixels, supersize zoom, and gallery order on eBay',
    deepHtml: `<p>Buyers judge condition through zoom. That is why chasing at least <strong>1600</strong> pixels on each side remains a durable habit even as cameras improve. Upscaling a 640-pixel thumbnail cannot recover serial numbers that were never resolved in the optical capture.</p>
<p>Order matters: lead with the cleanest hero, then defects. Resize every frame with the same crop language so the gallery feels like one shoot. Watermarks hurt trust — prefer uncluttered JPEGs that let shoppers inspect wear honestly.</p>
<p>Cross-list carefully. Amazon wants <a href="/image-resizer-for-amazon/">2000×2000</a>; Pinterest wants <a href="/image-resizer-for-pinterest/">1000×1500</a>; Merchant Center prefers <a href="/image-resizer-for-google-merchant/">1500×1500</a>. Policy PDFs and certificates belong in <a href="/pdf-tools/">PDF tools</a>, not the photo pipeline.</p>
<p>Retain untouched originals for Item Not As Described cases and returns disputes where pixel peeping decides the outcome. A second local pass on Image Compress is safer than re-downloading a mushy gallery JPEG.</p>`,
    faqH2: 'eBay photo sizing FAQ for active sellers',
    faq: [
      {
        q: 'What photo size works well for eBay listings?',
        a: 'A 1600×1600 pixel JPEG is a strong working target for sharp zoom. This page locks that size at quality 83 with a 12 MB check.',
      },
      {
        q: 'Do you upload my auction photos while resizing?',
        a: 'No. Everything runs in your browser. Seller Hub only receives what you upload afterward.',
      },
      {
        q: 'Is 1600×1600 large enough compared with Amazon’s 2000?',
        a: 'For eBay gallery zoom it is a proven baseline. If you also sell on Amazon, export a separate 2000×2000 master on the Amazon page.',
      },
      {
        q: 'Why warn at 12 MB?',
        a: 'Multi-angle lots get painful when every frame is a huge phone dump. Twelve megabytes is a practical per-image guardrail for smoother Seller Hub sessions.',
      },
      {
        q: 'Can I batch twenty angles in one sitting?',
        a: 'Yes — process them one after another locally. Keep naming consistent so gallery order in Seller Hub stays predictable.',
      },
    ],
  },

  'image-resizer-for-instagram': {
    securityH2: 'Feed-ready crops without uploading drafts to an online resizer',
    securityHtml: `<p>Campaign drafts, influencer unboxings, and unreleased colorways deserve a closed loop. This Instagram page crops to <strong>1080×1080</strong> (1:1), encodes at JPEG quality <strong>80</strong>, and watches an <strong>8 MB</strong> practical cap — entirely in the browser before you post or schedule.</p>
<p>Close the tab and the draft disappears from memory. We never host your grid, so seasonal tests stay off third-party disks until you choose a publish time.</p>`,
    problemH2: 'Stories vs feed: why 1080×1080 still rules catalog posts',
    problemHtml: `<p>Creators mix 9:16 Stories exports into feed slots and wonder why products look tiny or soft. Catalog-style posts still thrive as <strong>1:1</strong> squares around <strong>1080</strong> pixels. Oversized 4K exports also get recompressed harshly by the app, introducing muddy gradients on packaging.</p>
<p>Quality <strong>80</strong> anticipates Instagram’s own encode: you start clean without shipping a 15 MB brick that the app will crush anyway. The <strong>8 MB</strong> checker keeps scheduling tools and mobile uploads responsive.</p>
<p>Shopping tags that need catalog parity should also see <a href="/image-resizer-for-facebook/">Facebook catalog 1200</a>. Vertical discovery on Pinterest uses <a href="/image-resizer-for-pinterest/">1000×1500</a>. Store masters: <a href="/image-resizer-for-shopify/">Shopify</a>.</p>`,
    stepsH2: 'Make a 1:1 Instagram product square from any camera roll',
    steps: [
      'Drop the photo or export — 1080×1080 and 1:1 lock are already on for Instagram feed posts.',
      'Pin the crop on the product’s most recognizable angle, then run resize at quality 80.',
      'Download under 8 MB and post or schedule; for Shop catalogs, continue on the Facebook or TikTok Shop pages.',
    ],
    specsH2: 'Instagram square post profile on this page',
    specs: [
      ['Problem it solves', 'Off-ratio IG posts / heavy social uploads'],
      ['Output', '1080×1080 px, 1:1'],
      ['JPEG quality', '80'],
      ['Size check', '8 MB practical'],
      ['Privacy', 'Browser-only before the IG upload'],
      ['Related', 'Facebook · Pinterest · TikTok Shop'],
    ],
    presetH2: 'Instagram JPEG 80% inside an 8 MB practical cap',
    presetHtml: `<p>Instagram will recompress. Starting at quality <strong>80</strong> on a true <strong>1080</strong> square usually looks cleaner than uploading a lightly compressed 4000 px monster that the app downscales aggressively. The <strong>8 MB</strong> cap keeps creator tools and flaky hotel Wi-Fi happier.</p>
<p>Need taller pins? <a href="/image-resizer-for-pinterest/">Pinterest</a>. Need marketplace squares afterward? <a href="/image-resizer-for-amazon/">Amazon</a> or <a href="/image-resizer-for-aliexpress/">AliExpress</a>. Weight-only fixes: <a href="/image-compress/">Image Compress</a>.</p>`,
    deepH2: 'Carousel sharpness, compression artifacts, and social reuse',
    deepHtml: `<p>Carousels punish inconsistent framing. Resize every slide through the same <strong>1080×1080</strong> box so swipe motion feels intentional. Watch skin tones and pastel boxes — overcompressed JPEGs band quickly after Instagram’s second encode on cellular networks.</p>
<p>Do not confuse feed squares with Reels covers or Story canvases. Those vertical surfaces need different art direction; forcing them through this page will crop storytelling space you meant to keep for captions and stickers.</p>
<p>Paid social often shares assets with Meta commerce: prep catalog twins on <a href="/image-resizer-for-facebook/">Facebook’s 1200×1200</a> page. TikTok Shop thumbnails are smaller — use <a href="/image-resizer-for-tiktok-shop/">800×800</a>. Documents and media kits: <a href="/pdf-tools/">PDF tools</a>.</p>
<p>Archive masters outside Instagram; social exports are disposable marketing surfaces that should never replace your studio originals. Schedule from the download, not from a screenshot of the published post, if you want cleaner carousels next week.</p>`,
    faqH2: 'Instagram product photo sizing people ask about',
    faq: [
      {
        q: 'What size should Instagram product feed posts be?',
        a: 'A 1080×1080 pixel square is the reliable catalog choice. This page locks that crop at JPEG quality 80 with an 8 MB check.',
      },
      {
        q: 'Will my draft campaign images be uploaded to VeloTools?',
        a: 'No. Resizing is local. Instagram only sees the file when you publish or schedule it yourself.',
      },
      {
        q: 'Should I upload 4K images for better quality on Instagram?',
        a: 'Usually no. Oversized files get heavily recompressed. A clean 1080 square often survives the network looking sharper.',
      },
      {
        q: 'Can I use this for Instagram Stories?',
        a: 'Stories are vertical. Use a 9:16 workflow instead of this 1:1 preset so you do not lose narrative headroom.',
      },
      {
        q: 'How does this differ from Facebook catalog sizing?',
        a: 'Facebook catalog mode targets 1200×1200 at quality 81. Use that sibling when Commerce Manager is the destination.',
      },
    ],
  },

  'image-resizer-for-facebook': {
    securityH2: 'Catalog creatives stay private while you hit Facebook’s square',
    securityHtml: `<p>Commerce Manager catalogs often include MAP-sensitive bundles and unreleased SKUs. Resize them to <strong>1200×1200</strong> at JPEG quality <strong>81</strong> with an <strong>8 MB</strong> check inside your browser, then upload only into Meta’s tools when you choose.</p>
<p>No third-party holding folder. Tab memory only, which matters when agencies rotate freelancers through the same laptop.</p>`,
    problemH2: 'Commerce Manager warnings when catalog images undersize',
    problemHtml: `<p>Dynamic ads inherit whatever you feed the catalog. A 600-pixel scrape from a supplier sheet triggers quality warnings, soft carousels, and rejected advantageous placements. Giant PNGs create the opposite pain: slow feeds and stubborn <strong>8 MB</strong>-class failures in practical workflows when dozens of SKUs refresh overnight.</p>
<p>Locking <strong>1200×1200</strong> gives Meta enough pixels for feed and marketplace surfaces without pretending you need Amazon’s 2000 class for every SKU. Quality <strong>81</strong> sits a notch above Instagram’s social bias because catalog tiles endure longer than ephemeral posts and sit beside sharper competitor carousels.</p>
<p>Organic squares can start on <a href="/image-resizer-for-instagram/">Instagram</a>. Shopping feeds that also hit Google need <a href="/image-resizer-for-google-merchant/">Merchant Center sizing</a>. DTC themes: <a href="/image-resizer-for-shopify/">Shopify</a>.</p>`,
    stepsH2: 'Build a 1200×1200 Facebook catalog image locally',
    steps: [
      'Drop the product master — 1:1 and 1200×1200 are locked for Facebook catalog uploads.',
      'Keep logos inside safe margins so carousel crops do not clip trademarks, then process at quality 81.',
      'Download under 8 MB and add the asset in Commerce Manager or your feed pipeline.',
    ],
    specsH2: 'Facebook catalog image locks',
    specs: [
      ['Problem it solves', 'Catalog image too small / feed quality flags'],
      ['Output', '1200×1200 px, 1:1'],
      ['JPEG quality', '81'],
      ['Size check', '8 MB'],
      ['Privacy', 'Local only before Meta upload'],
      ['Related', 'Instagram · Google Merchant · Shopify'],
    ],
    presetH2: 'Why Facebook mode pairs 1200×1200 with JPEG 81',
    presetHtml: `<p>Catalog tiles are cropped by placements you do not fully control. Starting at <strong>1200</strong> square with quality <strong>81</strong> leaves detail for dynamic ads after Meta’s own encodes. The <strong>8 MB</strong> guardrail mirrors the practical social/catalog weight band used on the Instagram sibling.</p>
<p>Need tighter Shop thumbnails for short video commerce? <a href="/image-resizer-for-tiktok-shop/">TikTok Shop 800</a>. Pin-led traffic: <a href="/image-resizer-for-pinterest/">Pinterest</a>. Compress without recropping: <a href="/image-compress/">Image Compress</a>.</p>`,
    deepH2: 'Shops, ads, and the shared 8 MB catalog ceiling',
    deepHtml: `<p>Facebook Shops and Advantage+ catalog ads punish inconsistent framing more than slight softness. Standardize backgrounds and shadow direction across the feed, then run every SKU through this <strong>1200×1200</strong> preset so carousels feel native across placements you cannot fully preview.</p>
<p>Avoid heavy text overlays; placements crop unpredictably and policy systems dislike claim-heavy images. Keep claims in primary text instead, and leave a quiet margin so automatic squares do not clip trademarks on bottle necks or hangtags.</p>
<p>If the same feed powers Google Shopping, export a higher preferred square on <a href="/image-resizer-for-google-merchant/">Google Merchant (1500)</a> rather than stretching a 1200 asset. Marketplace twins: <a href="/image-resizer-for-amazon/">Amazon</a>, <a href="/image-resizer-for-ebay/">eBay</a>. Brochures: <a href="/pdf-tools/">PDF tools</a>.</p>
<p>Rotate seasonal creatives from masters stored in your own DAM — not from previously downloaded social compressions that have already survived two lossy encodes. Consistency across SKUs beats one-off crops from chat exports.</p>`,
    faqH2: 'Facebook catalog image FAQ for advertisers',
    faq: [
      {
        q: 'What image size should I use for a Facebook product catalog?',
        a: 'Use a 1200×1200 pixel square JPEG. This page locks that size at quality 81 and warns above 8 MB.',
      },
      {
        q: 'Are catalog photos uploaded to VeloTools during resize?',
        a: 'No. Processing is browser-only. Commerce Manager receives files only when you upload or sync them.',
      },
      {
        q: 'Is 1200×1200 enough for Advantage+ catalog ads?',
        a: 'It is a solid catalog baseline. If a placement still looks soft, start from a higher-resolution master and re-export rather than upscaling a tiny supplier thumbnail.',
      },
      {
        q: 'How is this different from Instagram’s resizer?',
        a: 'Instagram mode targets 1080×1080 at quality 80 for feed posts. Facebook catalog mode uses 1200×1200 at quality 81 for commerce feeds.',
      },
      {
        q: 'Can one image work for both Facebook and Google Merchant?',
        a: 'Better to export both. Google Merchant prefers around 1500×1500; use that dedicated page for Shopping feeds.',
      },
    ],
  },

  'image-resizer-for-walmart': {
    securityH2: 'Marketplace SKUs resize offline before Walmart Seller Center',
    securityHtml: `<p>Walmart Marketplace listings can expose MAP and bundle strategy early. Keep primary images on-device while you force a <strong>2000×2000</strong> square at a stricter JPEG quality <strong>78</strong> so the practical <strong>5 MB</strong> gate clears before Seller Center.</p>
<p>No staging bucket on our side — download, then upload yourself, keeping pre-launch assortments away from public compress queues used by freelancers.</p>`,
    problemH2: 'Walmart’s strict file weight versus Amazon-like pixel needs',
    problemHtml: `<p>Walmart wants Amazon-class pixels without Amazon’s byte generosity. Sellers who reuse a plump <strong>2000×2000</strong> Amazon JPEG at quality 85 often slam into weight friction near <strong>5 MB</strong>. Shrinking to 1200 “to be safe” then fails the sharpness expectations shoppers bring from other marketplaces.</p>
<p>This preset keeps the <strong>2000×2000</strong> / <strong>1:1</strong> geometry but leans on quality <strong>78</strong> — more aggressive than Amazon’s 85 — expressly to clear a tighter <strong>5 MB</strong> checker. That is the entire reason this URL is not a clone of the Amazon page.</p>
<p>Compare with <a href="/image-resizer-for-amazon/">Amazon’s 10 MB / q85 mode</a>. For DTC sites with looser ceilings, use <a href="/image-resizer-for-shopify/">Shopify</a>. Feed ads: <a href="/image-resizer-for-google-merchant/">Google Merchant</a>.</p>`,
    stepsH2: 'Deliver a 2000×2000 Walmart primary under 5 MB',
    steps: [
      'Drop the primary photo — 2000×2000 square is locked, with quality 78 aimed at Walmart’s tight size gate.',
      'Crop cleanly on white or approved backdrop rules for your category, then run resize.',
      'Download only when the 5 MB check passes; if it fails, simplify the scene or compress once more on Image Compress.',
    ],
    specsH2: 'Walmart marketplace image profile',
    specs: [
      ['Problem it solves', 'Walmart image over 5 MB / soft primary'],
      ['Output', '2000×2000 px, 1:1'],
      ['JPEG quality', '78 (aggressive vs Amazon)'],
      ['Size check', '5 MB'],
      ['Privacy', 'Browser-only'],
      ['Contrast', 'Amazon uses q85 / 10 MB'],
    ],
    presetH2: 'Aggressive JPEG 78 to clear Walmart’s tight 5 MB gate',
    presetHtml: `<p>Quality <strong>78</strong> is intentional. Matching Amazon’s pixels while respecting a <strong>5 MB</strong> practical ceiling means accepting a slightly stronger encode. Logos still hold if your master is sharp; muddy phone crops will not be rescued by this preset.</p>
<p>If Walmart accepts a specific asset under a different documented limit in your category, you can still prefer this page for consistency across SKUs. Sibling square markets: <a href="/image-resizer-for-aliexpress/">AliExpress 800</a>, <a href="/image-resizer-for-tiktok-shop/">TikTok Shop 800</a>.</p>`,
    deepH2: 'Same square as Amazon, tighter bytes — how this preset differs',
    deepHtml: `<p>Doorway pages that only swap the word “Walmart” into Amazon copy fail sellers. The operational difference is the byte budget: <strong>5 MB</strong> here versus <strong>10 MB</strong> on <a href="/image-resizer-for-amazon/">Amazon</a>, with quality dropped from 85 to <strong>78</strong> so the math works on detailed products.</p>
<p>White-background compliance still matters. Resize cannot fix a lifestyle shot that policy rejects — correct the backdrop in your editor first, then pass through this page.</p>
<p>Expanding distribution? Prep <a href="/image-resizer-for-ebay/">eBay 1600</a>, <a href="/image-resizer-for-facebook/">Facebook 1200</a>, and <a href="/image-resizer-for-google-merchant/">Merchant 1500</a> from the same studio master. Spec PDFs: <a href="/pdf-tools/">PDF tools</a>. Geometry-preserving shrinks: <a href="/image-compress/">Image Compress</a>.</p>
<p>Store uncompressed masters internally; Walmart exports are channel derivatives and should not become the only copy on a shared drive.</p>`,
    faqH2: 'Walmart item image questions from Marketplace sellers',
    faq: [
      {
        q: 'What size and file weight should Walmart primary images use?',
        a: 'Target 2000×2000 pixels and keep the JPEG under about 5 MB. This page locks those constraints at quality 78.',
      },
      {
        q: 'Can I reuse my Amazon image file on Walmart?',
        a: 'Pixels may match, but Amazon-quality JPEGs often exceed Walmart’s tighter weight expectations. Re-encode with this preset instead of uploading the Amazon export blindly.',
      },
      {
        q: 'Does resizing upload my SKUs to VeloTools?',
        a: 'No. The browser handles the work locally. Seller Center only gets the download you choose to upload.',
      },
      {
        q: 'Why is quality lower than the Amazon page?',
        a: 'Because the size gate is tighter (5 MB vs 10 MB). Quality 78 is the tradeoff that keeps 2000×2000 viable.',
      },
      {
        q: 'What if detailed jewelry still exceeds 5 MB?',
        a: 'Simplify reflections, avoid PNG, or run a careful second pass on Image Compress while leaving dimensions at 2000×2000.',
      },
    ],
  },

  'image-resizer-for-wildberries': {
    securityH2: 'WB card photos never upload to VeloTools while you crop 3:4',
    securityHtml: `<p>Wildberries seller cabinets already centralize your catalog. Extra cloud resizers are optional exposure. Crop to locked <strong>900×1200</strong> (3:4), encode at JPEG quality <strong>79</strong>, and respect a <strong>10 MB</strong> check — all in-browser before you publish the card.</p>
<p>Unreleased colorways stay on your hardware until you decide otherwise, which is ideal for soft launches timed to warehouse stock.</p>`,
    problemH2: 'Western square exports that Wildberries card layout chops',
    problemHtml: `<p>Brands expanding from Amazon often paste <strong>1:1</strong> heroes into Wildberries and lose sleeves, hems, or bottle necks to portrait chrome. Others upload 4:5 social crops that still are not the <strong>3:4</strong> card geometry WB expects in practice for many categories, so the cabinet auto-crops in surprising ways.</p>
<p>This page mirrors Ozon’s box (<strong>900×1200</strong>) but uses quality <strong>79</strong> — a hair more aggressive — because dense mobile traffic on WB rewards slightly lighter cards inside the same <strong>10 MB</strong> envelope without turning packaging type into mush.</p>
<p>Ozon twin: <a href="/image-resizer-for-ozon/">Image Resizer for Ozon</a> (q80). Square channels: <a href="/image-resizer-for-amazon/">Amazon</a>, <a href="/image-resizer-for-aliexpress/">AliExpress</a>. General tools: <a href="/image-compress/">Image Compress</a>.</p>`,
    stepsH2: 'Export Wildberries-ready 900×1200 JPEGs',
    steps: [
      'Add the flat-lay or mannequin shot — 3:4 and 900×1200 are locked for Wildberries-style cards.',
      'Place the product high enough that mobile thumbs still show the silhouette, then process at quality 79.',
      'Download under 10 MB and upload in your WB seller workflow; keep a square master for export markets.',
    ],
    specsH2: 'Wildberries card geometry locked here',
    specs: [
      ['Problem it solves', 'WB card crop issues / heavy uploads'],
      ['Output', '900×1200 px, 3:4'],
      ['JPEG quality', '79'],
      ['Size check', '10 MB'],
      ['Privacy', 'Local browser only'],
      ['Sister', 'Ozon 900×1200 at q80'],
    ],
    presetH2: 'JPEG 79 on Wildberries: enough detail for mobile cards',
    presetHtml: `<p>Quality <strong>79</strong> is the differentiator from Ozon’s <strong>80</strong>: same pixels, slightly leaner encode for scroll-heavy feeds. Labels should remain legible if your optical resolution was honest at capture time.</p>
<p>Need Pins for RU-to-global storytelling? <a href="/image-resizer-for-pinterest/">Pinterest 1000×1500</a>. Short-video commerce thumbs: <a href="/image-resizer-for-tiktok-shop/">TikTok Shop</a>. PDF size charts: <a href="/pdf-tools/">PDF tools</a>.</p>`,
    deepH2: 'Ozon twin ratios, different quality bias for WB traffic',
    deepHtml: `<p>Anti-doorway matters: Ozon and Wildberries share <strong>900×1200</strong> geometry on this site on purpose, but quality and editorial framing diverge so the pages are not clones. WB mode’s <strong>79</strong> bias and the copy you are reading exist so sellers pick the cabinet they are filling today instead of pasting identical SEO blocks.</p>
<p>Model shots need headroom. Cropping too tight turns every card into a torso fragment when WB’s UI adds badges and discount ribbons. Leave breathing room at the top of the 3:4 frame so silhouettes still read after chrome lands.</p>
<p>International expansion paths: <a href="/image-resizer-for-amazon/">Amazon</a>, <a href="/image-resizer-for-ebay/">eBay</a>, <a href="/image-resizer-for-shopify/">Shopify</a>, <a href="/image-resizer-for-google-merchant/">Google Merchant</a>. Compress without changing crop: <a href="/image-compress/">Image Compress</a>. Size charts and care PDFs: <a href="/pdf-tools/">PDF tools</a>.</p>
<p>Retain color-managed masters; marketplace JPEGs drift when re-saved repeatedly from previous cabinet downloads instead of the studio original. One portrait master feeds both WB and Ozon exports cleanly without square letterboxing.</p>`,
    faqH2: 'Wildberries photo size FAQ for RU sellers',
    faq: [
      {
        q: 'What image size should I prepare for Wildberries product cards?',
        a: 'Use 900×1200 pixels at a 3:4 ratio. This page locks that output at JPEG quality 79 with a 10 MB check.',
      },
      {
        q: 'Is Wildberries the same preset as Ozon on VeloTools?',
        a: 'Same dimensions, different quality (79 vs 80) and unique guidance. Choose the page for the marketplace you are uploading to now.',
      },
      {
        q: 'Do my WB photos leave my computer while resizing?',
        a: 'No. The work stays in the browser. Only your seller cabinet upload sends the file off-device.',
      },
      {
        q: 'Why not just upload my Instagram square?',
        a: '1:1 social crops waste space on portrait cards and often hide length cues shoppers need. Recrop to 3:4.',
      },
      {
        q: 'Can I keep one portrait master for both WB and Ozon?',
        a: 'Yes — start from the same studio frame, then export once per page so each cabinet gets its quality bias.',
      },
    ],
  },

  'image-resizer-for-aliexpress': {
    securityH2: 'Cross-border listing shots resize in-tab before AliExpress upload',
    securityHtml: `<p>Supplier negotiations and pre-launch SKUs should not linger on public compress websites. Scale to a locked <strong>800×800</strong> square at JPEG quality <strong>75</strong>, under a firm <strong>5 MB</strong> check, using only your browser — then upload into AliExpress when ready.</p>
<p>Close the tab; the working copy is gone from our perspective because it never arrived, even during late-night bulk listing sessions.</p>`,
    problemH2: 'Overweight studio RAW exports that AliExpress caps hard',
    problemHtml: `<p>Cross-border sellers inherit glamorous 4000 px factory photos that casually exceed <strong>5 MB</strong> after careless PNG conversion. AliExpress main images, meanwhile, often behave well at a modest <strong>800×800</strong> square — smaller than Amazon — so shipping giant files only slows the cabinet and burns mobile data for overseas buyers.</p>
<p>Quality <strong>75</strong> is the most aggressive square preset in this set on purpose: bandwidth to global buyers matters, and the pixel box is smaller, so you can afford a stronger encode without looking softer than a 2000 px competitor shot on a phone screen.</p>
<p>Higher-tier Western markets still want bigger masters — <a href="/image-resizer-for-amazon/">Amazon 2000</a>, <a href="/image-resizer-for-walmart/">Walmart 2000</a>, <a href="/image-resizer-for-ebay/">eBay 1600</a>. Social: <a href="/image-resizer-for-instagram/">Instagram</a>.</p>`,
    stepsH2: 'Shrink to AliExpress 800×800 without a cloud hop',
    steps: [
      'Drop the supplier or studio file — 800×800 and 1:1 are locked with quality 75 for AliExpress mains.',
      'Center the product on a clean ground so small thumbs remain recognizable, then process.',
      'Download only under 5 MB and upload; keep a larger master elsewhere for Amazon-class channels.',
    ],
    specsH2: 'AliExpress main image locks',
    specs: [
      ['Problem it solves', 'AliExpress image too heavy / wrong square'],
      ['Output', '800×800 px, 1:1'],
      ['JPEG quality', '75'],
      ['Size check', '5 MB'],
      ['Privacy', 'Browser-only resize'],
      ['Compare', 'TikTok Shop also 800 / q77'],
    ],
    presetH2: 'JPEG 75 and 5 MB — the AliExpress bandwidth tradeoff',
    presetHtml: `<p>At <strong>800</strong> pixels, quality <strong>75</strong> still reads clearly on phones while respecting a strict <strong>5 MB</strong> envelope that catches mistaken full-bleed PNGs. It is not the preset for print catalogs; it is the preset for fast cross-border cards.</p>
<p>TikTok Shop uses the same pixel box with a slightly softer <a href="/image-resizer-for-tiktok-shop/">quality 77</a>. Google’s preferred square is larger — see <a href="/image-resizer-for-google-merchant/">1500×1500 Merchant</a>.</p>`,
    deepH2: '800 px floors, white grounds, and multi-market reuse',
    deepHtml: `<p>AliExpress thumbs are tiny in search. Contrast beats subtle styling: place the SKU large in the <strong>800×800</strong> frame with simple grounds so the silhouette survives next to denser competitor cards. Fine jewelry may need a tighter crop than apparel so clasps remain obvious.</p>
<p>Never upscale a 400 px supplier thumbnail and expect miracles. Source a real optical master, then downscale here. Re-encoding an already crunchy marketplace download compounds blockiness around logos and stitching.</p>
<p>Pipeline idea: archive a 2000-class master, then derive <a href="/image-resizer-for-aliexpress/">AliExpress 800</a>, <a href="/image-resizer-for-tiktok-shop/">TikTok Shop 800</a>, <a href="/image-resizer-for-facebook/">Facebook 1200</a>, and <a href="/image-resizer-for-amazon/">Amazon 2000</a> as separate exports. Compress-only: <a href="/image-compress/">Image Compress</a>. Compliance PDFs: <a href="/pdf-tools/">PDF tools</a>.</p>
<p>Watch color profiles from factories; convert to sRGB before final JPEG when skins or brand reds drift under mixed lighting from overseas studios. Then derive the 800 square here instead of stretching a phone screenshot from chat.</p>`,
    faqH2: 'AliExpress image requirements — frequent seller questions',
    faq: [
      {
        q: 'What main image size should I use on AliExpress?',
        a: 'An 800×800 pixel square JPEG is the locked target here, at quality 75 with a 5 MB maximum check.',
      },
      {
        q: 'Is resizing private for unreleased cross-border SKUs?',
        a: 'Yes. Nothing is sent to VeloTools. You upload the download to AliExpress yourself.',
      },
      {
        q: 'Why is quality only 75?',
        a: 'The pixel box is smaller than Amazon-class markets, and the 5 MB gate is strict. Quality 75 keeps cards light for global buyers.',
      },
      {
        q: 'Can I upload my 2000×2000 Amazon file instead?',
        a: 'It may work, but you will often waste bytes. Downscale with this preset for snappier seller uploads and storefront loads.',
      },
      {
        q: 'How does this differ from TikTok Shop’s 800×800 page?',
        a: 'Same dimensions; TikTok Shop uses quality 77. Use the page that matches the destination cabinet.',
      },
    ],
  },

  'image-resizer-for-google-merchant': {
    securityH2: 'Shopping feed images stay on-device while you enlarge to 1500',
    securityHtml: `<p>Merchant Center feeds expose pricing strategy and assortment plans. Resize toward a preferred <strong>1500×1500</strong> square at JPEG quality <strong>85</strong>, with a comfortable <strong>16 MB</strong> checker, without parking feed creatives on an anonymous host.</p>
<p>Browser-only processing — you push the URL or file into your feed when ready, which keeps unfinished assortments out of shared compress buckets.</p>`,
    problemH2: 'Merchant Center disapprovals for images under 800 px',
    problemHtml: `<p>Google’s hard floor sits near <strong>800</strong> pixels, but free listings and competitive Shopping inventory look weak at the minimum. Soft supplier thumbs trigger “image too small” problems or simply lose the click to sharper rivals. Opposite failure: enormous PNGs stall feed fetches inside a practical <strong>16 MB</strong> comfort zone.</p>
<p>We aim at the preferred <strong>1500×1500</strong> square with quality <strong>85</strong> — high enough for Shopping surfaces that still recompress, large enough to clear the spirit of the 800 px minimum with room to spare.</p>
<p>Meta catalogs differ: <a href="/image-resizer-for-facebook/">Facebook 1200</a>. Store themes: <a href="/image-resizer-for-shopify/">Shopify ~2048</a>. Marketplaces: <a href="/image-resizer-for-amazon/">Amazon</a>.</p>`,
    stepsH2: 'Prepare a 1500×1500 Google Merchant preferred square',
    steps: [
      'Drop a sharp product master — 1500×1500 at quality 85 is locked as the Merchant preferred target.',
      'Exclude promotional text overlays that Shopping policies dislike, then run the resize.',
      'Download under 16 MB and point your feed image_link at the hosted final (or upload per your pipeline).',
    ],
    specsH2: 'Google Merchant Center image profile',
    specs: [
      ['Problem it solves', 'Merchant image too small / feed quality loss'],
      ['Output', '1500×1500 px preferred square (above 800 min)'],
      ['JPEG quality', '85'],
      ['Size check', '16 MB'],
      ['Privacy', 'Local resize before feed publish'],
      ['Related', 'Shopify · Facebook · Amazon'],
    ],
    presetH2: 'Prefer 1500 with JPEG 85 under a generous 16 MB check',
    presetHtml: `<p>Meeting the <strong>800</strong> px minimum is not a strategy. Preferred <strong>1500</strong> pixels with quality <strong>85</strong> keeps fabrics and labels credible after Google’s own transforms on free listings and paid Shopping. The <strong>16 MB</strong> checker is wide on purpose — feed systems tolerate larger masters than Walmart’s cabinet — but still catches multi-layer mistakes from design tools.</p>
<p>Host the final on HTTPS with a stable URL. Resizing here does not host images for you; pair with your CDN or store platform. Theme masters: <a href="/image-resizer-for-shopify/">Shopify</a>. Social proof crops: <a href="/image-resizer-for-instagram/">Instagram</a>.</p>`,
    deepH2: 'Minimum vs preferred pixels and Shopping free listing quality',
    deepHtml: `<p>Think of <strong>800</strong> as “allowed” and <strong>1500</strong> as “competitive.” Landing pages that open with soft images bounce even when the feed is approved. Invest in optical resolution once, then derive Merchant, marketplace, and social sizes as separate exports.</p>
<p>Avoid watermarks, collages, and borders that trigger policy surfaces. Show the product clearly; save lifestyle context for optional additional images if your feed supports them.</p>
<p>Pipeline siblings worth maintaining: <a href="/image-resizer-for-amazon/">Amazon 2000</a>, <a href="/image-resizer-for-ebay/">eBay 1600</a>, <a href="/image-resizer-for-facebook/">Facebook 1200</a>, <a href="/image-resizer-for-pinterest/">Pinterest 1000×1500</a>. Weight-only: <a href="/image-compress/">Image Compress</a>. Spec sheets: <a href="/pdf-tools/">PDF tools</a>.</p>
<p>When Google shows a crawl issue, fix hosting headers first — resizing cannot repair a 404 image_link. Stable HTTPS URLs matter as much as the 1500 pixel box on this page for crawl health.</p>`,
    faqH2: 'Google Merchant image size FAQ for feed managers',
    faq: [
      {
        q: 'What image size does Google Merchant Center prefer?',
        a: 'At least 800 pixels on the shortest side, with around 1500×1500 preferred for sharper Shopping results. This page locks the 1500 square at quality 85.',
      },
      {
        q: 'Do you host my Merchant feed images?',
        a: 'No. We only resize locally. You must host the final file and reference it from image_link.',
      },
      {
        q: 'Why allow up to 16 MB here?',
        a: 'Feed pipelines often tolerate larger masters than marketplace cabinets. The warning still stops accidental huge PNGs from entering your workflow.',
      },
      {
        q: 'Can I reuse a 1200 Facebook catalog image for Merchant?',
        a: 'It may pass the minimum, but exporting a dedicated 1500 square from the studio master usually looks better in Shopping.',
      },
      {
        q: 'Are text overlays allowed on Shopping images?',
        a: 'Promotional text is risky under Google’s image policies. Prefer a clean product frame and put offers in feed attributes instead.',
      },
    ],
  },

  'image-resizer-for-pinterest': {
    securityH2: 'Pin creatives resize locally before you publish to Pinterest',
    securityHtml: `<p>Product pins often preview unreleased bundles and seasonal kits. Crop to <strong>1000×1500</strong> (2:3) at JPEG quality <strong>82</strong>, with a <strong>10 MB</strong> check, inside your browser — then publish when the board strategy is ready.</p>
<p>No pin draft is stored with us; the file never uploads to VeloTools, so mood-board experiments stay local until you hit publish.</p>`,
    problemH2: 'Landscape hero shots that collapse in the 2:3 pin grid',
    problemHtml: `<p>Pinterest’s grid is unforgiving to wide website heroes. A 16:9 banner becomes a tiny strip; shoppers never see the product. Square Instagram exports also waste vertical real estate that pins use to stop the scroll on mobile boards crowded with competing lifestyle shots.</p>
<p>Locking <strong>1000×1500</strong> enforces the classic <strong>2:3</strong> pin proportion. Quality <strong>82</strong> keeps lifestyle detail for zoom-ins while respecting a <strong>10 MB</strong> practical ceiling shared with several marketplace pages — but the geometry here is unique to Pinterest discovery.</p>
<p>Feed squares still matter elsewhere: <a href="/image-resizer-for-instagram/">Instagram</a>, <a href="/image-resizer-for-facebook/">Facebook</a>. Catalog portrait twins on RU markets: <a href="/image-resizer-for-ozon/">Ozon</a> / <a href="/image-resizer-for-wildberries/">Wildberries</a> (3:4, not 2:3).</p>`,
    stepsH2: 'Crop a 1000×1500 Pinterest product pin',
    steps: [
      'Drop the lifestyle or product frame — 2:3 and 1000×1500 are locked for standard pins.',
      'Compose with the product in the upper two-thirds so mobile titles do not hide it, then process at quality 82.',
      'Download under 10 MB and publish; deep-link the pin to your Shopify or Merchant landing page.',
    ],
    specsH2: 'Pinterest standard pin dimensions locked',
    specs: [
      ['Problem it solves', 'Wrong pin ratio / soft vertical crops'],
      ['Output', '1000×1500 px, 2:3'],
      ['JPEG quality', '82'],
      ['Size check', '10 MB'],
      ['Privacy', 'Browser-only before publish'],
      ['Related', 'Instagram · Shopify · Google Merchant'],
    ],
    presetH2: 'JPEG 82 for Pinterest pins inside 10 MB',
    presetHtml: `<p>Quality <strong>82</strong> matches the Etsy-like craft bias: textured goods and styled tables need honesty more than maximum crunch. The <strong>1000×1500</strong> box is smaller in megapixels than Amazon’s square, so files rarely threaten <strong>10 MB</strong> unless you start from a huge PNG collage.</p>
<p>Idea Pins and multi-page story formats need different art direction — do not force every surface through this standard pin preset. Store landers: <a href="/image-resizer-for-shopify/">Shopify</a>. Shopping ads: <a href="/image-resizer-for-google-merchant/">Google Merchant</a>.</p>`,
    deepH2: 'Idea Pins vs standard pins and catalog traffic from boards',
    deepHtml: `<p>Standard product pins still convert when the vertical crop tells a single clear story. Overlay sparse typography if needed, but leave breathing room; Pinterest UI chrome competes for edges and can hide thin headlines near the bottom third.</p>
<p>Track outbound clicks to ensure the landing image language matches the pin. A pin that shows a blue variant should not land on a red PDP hero — fix merchandising, not just pixels, or trust drops before checkout.</p>
<p>Derive channel sets from one shoot: <a href="/image-resizer-for-pinterest/">Pinterest 2:3</a>, <a href="/image-resizer-for-instagram/">Instagram 1:1</a>, <a href="/image-resizer-for-amazon/">Amazon 1:1 2000</a>, <a href="/image-resizer-for-tiktok-shop/">TikTok Shop 800</a>. Compress helpers: <a href="/image-compress/">Image Compress</a>. Lookbook PDFs: <a href="/pdf-tools/">PDF tools</a>.</p>
<p>Refresh seasonal pins from masters; repeatedly downloading and re-uploading the same JPEG stacks artifacts that show up as muddy pastels on kitchenware and textiles. Rebuild the 2:3 crop when the SKU packaging changes.</p>`,
    faqH2: 'Pinterest product pin sizing questions',
    faq: [
      {
        q: 'What is the best image size for a Pinterest product pin?',
        a: 'A 1000×1500 pixel image at a 2:3 ratio is the classic standard-pin target. This page locks that size at quality 82.',
      },
      {
        q: 'Will VeloTools upload my pin drafts?',
        a: 'No. Resizing stays in your browser. Pinterest only receives the file when you publish it.',
      },
      {
        q: 'Can I use a 1080 Instagram square as a pin?',
        a: 'It will look short in the grid. Recrop to 2:3 so the pin owns vertical space.',
      },
      {
        q: 'How is 2:3 different from Ozon’s 3:4?',
        a: 'Both are portraits, but the ratios differ. Use the Wildberries/Ozon pages for those cabinets and this page for Pinterest.',
      },
      {
        q: 'Should Idea Pins use this preset too?',
        a: 'Not always. Idea Pins are multi-page and often more video-led. Use this export for standard product pins first.',
      },
    ],
  },

  'image-resizer-for-tiktok-shop': {
    securityH2: 'TikTok Shop SKUs resize in the browser before Seller Center',
    securityHtml: `<p>Shop launches and flash SKUs deserve a closed prep loop. Resize to <strong>800×800</strong> at JPEG quality <strong>77</strong>, under a <strong>5 MB</strong> check, on-device — then upload into TikTok Shop Seller Center yourself.</p>
<p>We never receive the thumbnail. Privacy is browser-local by design, even when creators prep dozens of SKUs between livestreams.</p>`,
    problemH2: 'Vertical video frames that fail as square Shop thumbnails',
    problemHtml: `<p>Creators grab a 9:16 video still and upload it as the Shop main image. The cabinet expects a square thumb; faces get clipped, products sit off-center, and the rail looks accidental next to polished competitors. Other sellers ship 2000 px Amazon files that waste quota against a practical <strong>5 MB</strong> Shop-friendly ceiling on mobile Seller Center.</p>
<p>This preset matches AliExpress’s <strong>800×800</strong> box but uses quality <strong>77</strong> — slightly gentler — because Shop grids sit beside sharp video content and benefit from a bit more acuity inside the same byte budget without looking crunchy on OLED phones.</p>
<p>AliExpress twin: <a href="/image-resizer-for-aliexpress/">q75 at 800</a>. Organic feed squares: <a href="/image-resizer-for-instagram/">Instagram 1080</a>. Larger retail: <a href="/image-resizer-for-amazon/">Amazon</a> / <a href="/image-resizer-for-walmart/">Walmart</a>.</p>`,
    stepsH2: 'Export an 800×800 TikTok Shop main image',
    steps: [
      'Drop a clean still (not a soft video grab if you can avoid it) — 800×800 and quality 77 are locked.',
      'Center the SKU so mobile Shop rails recognize it at a glance, then run resize.',
      'Download under 5 MB and upload in Seller Center; keep vertical creatives separate for in-feed video.',
    ],
    specsH2: 'TikTok Shop thumbnail profile',
    specs: [
      ['Problem it solves', 'Shop thumb wrong ratio / over 5 MB'],
      ['Output', '800×800 px, 1:1'],
      ['JPEG quality', '77'],
      ['Size check', '5 MB'],
      ['Privacy', 'Local only before Seller Center'],
      ['Compare', 'AliExpress 800 at q75'],
    ],
    presetH2: 'JPEG 77 under 5 MB for TikTok Shop mobile rails',
    presetHtml: `<p>Shop discovery is thumb-sized. Quality <strong>77</strong> on an <strong>800</strong> square keeps colorways distinct without inviting <strong>5 MB</strong> failures. It is not a substitute for your video hero — it is the catalog badge beside that video.</p>
<p>Need taller storytelling stills for other networks? <a href="/image-resizer-for-pinterest/">Pinterest</a>. Meta commerce: <a href="/image-resizer-for-facebook/">Facebook catalog</a>. Pure compression: <a href="/image-compress/">Image Compress</a>.</p>`,
    deepH2: 'Shop vs organic TikTok ratios and cross-posting traps',
    deepHtml: `<p>Organic TikTok thrives on vertical motion; Shop catalogs still need a trustworthy square identifier. Treat them as different art directions even when the SKU is identical. Pull a high-resolution still from the same shoot, not a compressed screenshot of the For You page that already lost detail.</p>
<p>Cross-posting Amazon masters without downscale slows mobile sellers on flaky connections and invites accidental policy mismatches. Use this <strong>800×800</strong> path for Shop, and keep <a href="/image-resizer-for-amazon/">2000×2000 Amazon</a> exports for that cabinet alone.</p>
<p>Global stack example: <a href="/image-resizer-for-tiktok-shop/">TikTok Shop</a>, <a href="/image-resizer-for-aliexpress/">AliExpress</a>, <a href="/image-resizer-for-ebay/">eBay</a>, <a href="/image-resizer-for-google-merchant/">Google Merchant</a>, plus <a href="/image-compress/">Image Compress</a> for odd one-offs. Policy and invoice PDFs: <a href="/pdf-tools/">PDF tools</a>.</p>
<p>When a colorway sells out, retire the thumb from the same master set so leftover creatives do not advertise empty stock during flash campaigns. Pair the square thumb with vertical video — do not force one ratio to do both jobs in Seller Center.</p>`,
    faqH2: 'TikTok Shop image FAQ for new sellers',
    faq: [
      {
        q: 'What size should a TikTok Shop main product image be?',
        a: 'Use an 800×800 pixel square JPEG. This page locks that size at quality 77 with a 5 MB check.',
      },
      {
        q: 'Can I use a vertical video frame as my Shop thumbnail?',
        a: 'Better to shoot or export a true square still. Vertical frames get cropped awkwardly in square Shop rails.',
      },
      {
        q: 'Does VeloTools see my TikTok Shop photos?',
        a: 'No. Resizing is browser-only. Seller Center receives only what you upload afterward.',
      },
      {
        q: 'How is this different from AliExpress’s 800×800 tool?',
        a: 'Same dimensions; AliExpress uses quality 75 while TikTok Shop uses 77. Pick the page for the destination you are filling.',
      },
      {
        q: 'Should Shop images match my Instagram grid?',
        a: 'They can share a shoot, but Instagram’s 1080 square is a different export. Run both presets from the master instead of stretching one file.',
      },
    ],
  },
};
