import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';

export default defineConfig({
  output: 'static',
  adapter: netlify(),
  trailingSlash: 'always',
  integrations: [react(), keystatic()],
});
