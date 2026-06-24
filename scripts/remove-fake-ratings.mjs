import fs from 'fs';
import path from 'path';

const root = process.cwd();

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.name.endsWith('.html')) files.push(full);
  }
}

const files = [];
walk(root);

const ratingRe = /,"aggregateRating":\{"@type":"AggregateRating"[^}]+\}\}/g;

for (const file of files) {
  let html = fs.readFileSync(file, 'utf8');
  const next = html
    .replace(ratingRe, '')
    .replace(
      /,\s*"aggregateRating":\s*\{\s*"@type":\s*"AggregateRating"[\s\S]*?\}\s*,/g,
      ',',
    )
    .replace(
      /,\s*"aggregateRating":\s*\{\s*"@type":\s*"AggregateRating"[\s\S]*?\}\s*\n/g,
      '\n',
    );

  if (next !== html) {
    fs.writeFileSync(file, next);
    console.log('cleaned:', path.relative(root, file));
  }
}
