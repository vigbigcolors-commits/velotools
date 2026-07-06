const pages = [
  'https://velotools.app/',
  'https://velotools.app/about/',
  'https://velotools.app/image-compress/',
  'https://velotools.app/bgremover/',
  'https://velotools.app/compress-pdf/',
  'https://velotools.app/merge-pdf/',
  'https://velotools.app/split-pdf/',
  'https://velotools.app/unlock-pdf/',
  'https://velotools.app/qr/',
  'https://velotools.app/invoice/',
  'https://velotools.app/focus/',
  'https://velotools.app/compress-jpg-online/',
  'https://velotools.app/invoice-no-watermark/',
];

for (const url of pages) {
  const res = await fetch(url, { redirect: 'follow' });
  const html = await res.text();
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  if (!blocks.length) {
    console.log(`NO SCHEMA: ${url}`);
    continue;
  }
  blocks.forEach((m, i) => {
    try {
      JSON.parse(m[1].trim());
      console.log(`OK: ${url} block ${i + 1}`);
    } catch (e) {
      console.log(`FAIL: ${url} block ${i + 1} - ${e.message}`);
      console.log('  ', m[1].trim().slice(0, 120), '...');
    }
  });
}
