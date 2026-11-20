// @ts-check
import { defineConfig } from 'astro/config';

// On Vercel, the production domain is used for canonical and social preview URLs.
const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;

export default defineConfig({
  site: vercelUrl ? `https://${vercelUrl}` : 'http://localhost:4321',
});
