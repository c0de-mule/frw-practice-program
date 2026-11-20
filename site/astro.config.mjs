import { defineConfig } from 'astro/config';

// NOTE: `base: '/app/'` is only so the built site can preview under
// finding-the-right-words.vercel.app/app/ on the existing static deploy.
// For the real subdomain (its own Vercel project), drop `base` (or set '/').
export default defineConfig({
  base: '/app/',
  trailingSlash: 'always',
});
