import {readFile, stat} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {media} from '../media.js';
const html = await readFile('index.html', 'utf8');
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
assert.equal(new Set(ids).size, ids.length, 'HTML IDs must be unique.');
for (const match of html.matchAll(/(?:href="#|aria-controls=")([^"\s]+)/g)) assert.ok(ids.includes(match[1]), `Missing target: ${match[1]}`);
const assets = new Set([...html.matchAll(/(?:src|href|poster)="(assets\/[^"]+)"/g)].map(match => match[1]));
for (const match of (await readFile('styles.css', 'utf8')).matchAll(/url\(['"]?(assets\/[^)'"\s]+)/g)) assets.add(match[1]);
function collect(value) {
  if (typeof value === 'string' && value.startsWith('assets/')) assets.add(value);
  else if (value && typeof value === 'object') Object.values(value).forEach(collect);
}
collect(media);
for (const file of assets) assert.ok((await stat(file)).isFile(), `Missing asset: ${file}`);
assert.ok(html.includes('autoplay muted playsinline loop'), 'Hero needs inline muted autoplay.');
assert.ok(!html.includes('Enter our world'), 'Prototype opens directly into the film.');
assert.ok(html.includes('Tradex Innovations'), 'Preserve the requested copyright credit.');
console.log(`Validated ${ids.length} unique IDs, internal anchors, dialog controls and ${assets.size} local assets.`);
