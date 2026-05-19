import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { schemaTypes } from './studio/schemas';

export default defineConfig({
  name: 'zomeren-studio',
  title: 'zomeren.studio',
  projectId: 'hxvgnroi',
  dataset: 'production',
  plugins: [structureTool()],
  schema: {
    types: schemaTypes,
  },
});
