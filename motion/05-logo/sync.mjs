// sync.mjs — escreve out/cues.json (contrato imagem ↔ som) a partir de timeline.js.
import { createRequire } from 'node:module';
import { writeFileSync, mkdirSync } from 'node:fs';
const require = createRequire(import.meta.url);
globalThis.MOTION = require('./motion.js');
const FILM = require('./timeline.js');
const doc = FILM.cues();
mkdirSync('out', { recursive: true });
writeFileSync('out/cues.json', JSON.stringify(doc, null, 1) + '\n');
const by = {}; for (const e of doc.events) by[e.kind] = (by[e.kind] || 0) + 1;
console.log(`out/cues.json: ${doc.events.length} eventos`, by);
