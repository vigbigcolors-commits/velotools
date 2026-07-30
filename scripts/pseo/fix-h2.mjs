import { MATRIX } from '../seo-data/matrix/index.mjs';
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const editorialPath = join(root, 'scripts/seo-data/matrix/editorials.mjs');

const map = {
  'frontend-developer-focus-room': 'UI implementation without tab chaos',
  'devops-engineer-focus-room': 'Calm pacing for infra changes',
  'ux-designer-focus-room': 'Synthesis time that protects insight quality',
  'ui-designer-focus-room': 'Short loops for visual decisions',
  'copywriter-focus-room': 'Sprint writing with a clean edit pass',
  'content-writer-focus-room': 'Longform flow without analytics rabbit holes',
  'product-manager-focus-room': 'Decision-grade focus for specs',
  'data-analyst-focus-room': 'Keep the analytical thread intact',
  'qa-engineer-focus-room': 'Charter-sized test passes',
  'student-focus-room': 'Simple study loop, zero accounts',
  'freelancer-focus-room': 'Billable bricks between messages',
  'seo-specialist-focus-room': 'One artifact per sealed block',
  'mobile-developer-focus-room': 'Absorb build waits inside focus',
  'sysadmin-focus-room': 'Checklist pace for safe changes',
  'backend-developer-focus-room-ultradian': 'Full ultradian peak for architecture',
  'copywriter-focus-room-sprint': 'High-volume hooks, then select',
  'student-focus-room-exam': 'Longer sealed recall practice',
  'ux-designer-focus-room-research': 'Cluster interviews without losing the thread',
  'devops-engineer-focus-room-oncall': 'Progress between pages, not fake deep work',
  'frontend-developer-focus-room-css': 'Finish a coherent visual slice',
  'data-analyst-focus-room-sql': 'Write, run, adjust without chat noise',
  'product-manager-focus-room-roadmap': 'Outcomes before timelines',
  'qa-engineer-focus-room-regression': 'Endurance without false passes',
  'content-writer-focus-room-blog': 'Section-by-section publishing cadence',
  'freelancer-focus-room-deadline': 'Finish mode, then return to quality',
  'seo-specialist-focus-room-briefs': 'Complete briefs, not tab collections',
  'mobile-developer-focus-room-debug': 'Reproduce before you rewrite',
  'sysadmin-focus-room-docs': 'Write rollback while memory is fresh',
  'ui-designer-focus-room-critique': 'Prep the story stakeholders need',
  'backend-developer-focus-room': 'Deep blocks for systems that fight interrupts',
};

let src = readFileSync(editorialPath, 'utf8');
let misses = 0;
for (const [id, h2] of Object.entries(map)) {
  const entry = MATRIX.find((e) => e.id === id);
  if (!entry) throw new Error(`missing ${id}`);
  const oldLine = `    h2: '${entry.editorial.h2}',`;
  const newLine = `    h2: '${h2}',`;
  if (!src.includes(oldLine)) {
    console.log('MISS', id);
    misses += 1;
    continue;
  }
  src = src.replace(oldLine, newLine);
}
if (misses) process.exit(1);
writeFileSync(editorialPath, src);
console.log('h2 updated', Object.keys(map).length);
