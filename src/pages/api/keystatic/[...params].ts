import { makeHandler } from '@keystatic/astro/api';
import keystaticConfig from '../../../../keystatic.config';

export const prerender = false;

const handler = makeHandler({
  config: keystaticConfig,
  clientId: process.env.KEYSTATIC_GITHUB_CLIENT_ID,
  clientSecret: process.env.KEYSTATIC_GITHUB_CLIENT_SECRET,
  secret: process.env.KEYSTATIC_SECRET,
});

export const ALL = handler;
