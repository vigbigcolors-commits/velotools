import fs from 'fs';

const critical = fs
  .readFileSync('css/index-critical.css', 'utf8')
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/\s+/g, ' ')
  .trim();

let html = fs.readFileSync('index.html', 'utf8');
const styleBlock = `<style>${critical}</style>`;
html = html.replace(/<style>[\s\S]*?<\/style>/, styleBlock);

const link = [
  '<link rel="stylesheet" href="/css/index-deferred.css" media="print" onload="this.media=\'all\'">',
  '<noscript><link rel="stylesheet" href="/css/index-deferred.css"></noscript>',
].join('\n');

if (!html.includes('index-deferred.css')) {
  html = html.replace('</style>', `</style>\n${link}`);
}

fs.writeFileSync('index.html', html);
console.log('critical inline bytes:', critical.length);
console.log('deferred file bytes:', fs.statSync('css/index-deferred.css').size);
