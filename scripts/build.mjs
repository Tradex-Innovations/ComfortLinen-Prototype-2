import {cp, mkdir, rm} from 'node:fs/promises';
await rm('dist', {recursive: true, force: true});
await mkdir('dist', {recursive: true});
for (const file of ['index.html', 'styles.css', 'site.js', 'media.js']) await cp(file, `dist/${file}`);
await cp('assets', 'dist/assets', {recursive: true});
console.log('Built standalone static prototype in dist/.');
