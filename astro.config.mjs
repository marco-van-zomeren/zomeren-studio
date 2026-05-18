import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';

export default defineConfig({
  output: 'static',
  adapter: netlify(),
  trailingSlash: 'always',
  integrations: [react(), keystatic()],
  vite: {
    define: {
      'import.meta.env.KEYSTATIC_GITHUB_CLIENT_ID': JSON.stringify(process.env.KEYSTATIC_GITHUB_CLIENT_ID ?? ''),
      'import.meta.env.KEYSTATIC_GITHUB_CLIENT_SECRET': JSON.stringify(process.env.KEYSTATIC_GITHUB_CLIENT_SECRET ?? ''),
      'import.meta.env.KEYSTATIC_SECRET': JSON.stringify(process.env.KEYSTATIC_SECRET ?? ''),
    },
  },
});
