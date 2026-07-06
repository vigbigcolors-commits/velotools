import fs from 'fs';

function findLdJson(file) {
  const html = fs.readFileSync(file, 'utf8');
  const re = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g;
  let m;
  let i = 0;
  while ((m = re.exec(html))) {
    i++;
    try {
      JSON.parse(m[1].trim());
      console.log(`OK: ${file} block ${i}`);
    } catch (e) {
      const text = m[1].trim();
      const pos = Number(e.message.match(/position (\d+)/)?.[1]);
      console.log(`FAIL: ${file} block ${i} - ${e.message}`);
      if (pos) {
        console.log('  context:', text.slice(Math.max(0, pos - 40), pos + 40));
      }
    }
  }
}

const files = [
  'index.html',
  'about/index.html',
  'image-compress/index.html',
  'bgremover/index.html',
  'compress-pdf/index.html',
  'merge-pdf/index.html',
  'split-pdf/index.html',
  'unlock-pdf/index.html',
  'qr/index.html',
  'compress-jpg-online/index.html',
  'invoice-no-watermark/index.html',
  'focus/index.html',
  'invoice/index.html',
  'about.html',
];

for (const f of files) {
  if (fs.existsSync(f)) findLdJson(f);
}
