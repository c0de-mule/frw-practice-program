import { defineConfig } from 'astro/config';

// Served at the site root (the existing Vercel project builds from `site/`).
// The landing page lives at `/` (src/pages/index.astro) — no redirect on the bare domain.
// Legacy/printed paths fold back into the root or the Field Guide.
export default defineConfig({
  base: '/',
  trailingSlash: 'always',
  redirects: {
    '/infopage/': '/',
    '/video-intro/': '/',
    '/programoverview/': '/',
    '/practicepreviews/': '/',
    '/framework/': '/fieldguide/',
    // The Guide on a Page now lives only inside the Practice Program; its old
    // public page is retired and folds into the Field Guide sign-up.
    '/guideonapage/': '/receive-field-guide/',
  },
});
