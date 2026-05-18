import { readFileSync, writeFileSync } from 'fs';

const file = 'node_modules/@astrojs/netlify/dist/image-service.js';
let content = readFileSync(file, 'utf-8');

if (content.includes('verifyOptions') && !content.includes('const verifyOptions')) {
  content = content.replace(
    `import { baseService, verifyOptions } from "astro/assets";`,
    `import { baseService } from "astro/assets";\nconst verifyOptions = (o) => o;`
  );
  writeFileSync(file, content);
  console.log('Patched @astrojs/netlify image-service.js for Astro 6.1 compatibility');
}
