import { defineConfig } from 'astro/config';

// Served at the site root (the existing Vercel project builds from `site/`).
// Home redirects to the info/sales page; change the target to set a different home.
export default defineConfig({
  base: '/',
  trailingSlash: 'always',
  redirects: {
    '/': '/infopage/',
  },
});
