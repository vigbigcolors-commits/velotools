import { copyFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist-tool-cards');
const jsOut = join(root, 'js', 'tool-card-grid.js');
const cssOut = join(root, 'css', 'tool-card-grid.css');

mkdirSync(dirname(jsOut), { recursive: true });
mkdirSync(dirname(cssOut), { recursive: true });

const jsSrc = join(dist, 'tool-card-grid.js');
const cssSrc = join(dist, 'tool-card-grid.css');

if (!existsSync(jsSrc)) {
  throw new Error(`Missing build output: ${jsSrc}`);
}
copyFileSync(jsSrc, jsOut);

if (existsSync(cssSrc)) {
  copyFileSync(cssSrc, cssOut);
} else {
  throw new Error(`Missing build output: ${cssSrc}`);
}

console.log('Copied tool-card-grid.js → js/');
console.log('Copied tool-card-grid.css → css/');
