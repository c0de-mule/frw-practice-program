# FRW Practice Program — gated + synced

David Feinstein's "Finding the Right Words" Practice Program, wrapped with:
- a **purchaser email gate** (only people on the allow-list get in), and
- **cross-device progress** (results saved to Supabase, not just one browser).

`index.html` is David's original file **unchanged**, except:
- three one-line `scheduleRemotePush()` hooks inside the existing save / start-fresh / name handlers, and
- one appended `<script>` block at the bottom (the gate + sync layer, clearly commented).

## Live
- **URL:** https://finding-the-right-words.vercel.app (Vercel — auto-deploys from this repo's `main`)
- **Database:** Supabase project **"Tapping Program"** — gate + progress verified working end-to-end.
- Purchasers are rows in `frw_entitlements`. Add one to grant access (see SUPABASE-SETUP.md).

## Results dashboard (internal)
- **URL:** https://finding-the-right-words.vercel.app/admin.html
- Soft-gated to team admin emails (currently Everett + Amber). Shows each tester's
  tier progress, accuracy, their individual picks (✓/✗) and any own-written phrases,
  plus a **By item** view aggregating how all testers answered each vignette.
- **Access is soft:** it's a client-side email check using the same publishable key,
  so anyone with the link + key could read the data. Treat the link as internal.
  Real lockdown = restrict `frw_progress` RLS + Supabase Auth (see SUPABASE-SETUP.md).

## Run it locally
```bash
python3 -m http.server 8777
```
Open http://localhost:8777/index.html.

## Backend setup / SQL
See **SUPABASE-SETUP.md** — tables, the gate function, RLS, and how to add purchasers.

## Status / open questions
- **Auth is email-only** (simple, by design). Anyone who knows a buyer's email could view that
  buyer's progress — fine for review; the lock-tight upgrade is Supabase Auth magic-link
  (documented in SUPABASE-SETUP.md).
- **Content gating is soft:** the 144 vignettes live in `index.html`, so they're view-source-able.
  Harden by moving the item bank into Supabase if David's IP needs protecting.
- **Checkout processor — TBD.** Needed to auto-grant access + tag the buyer in ActiveCampaign on purchase.
- **Production home:** Vercel (`finding-the-right-words.vercel.app`). A custom domain can be added
  later once DNS is available (e.g. a subdomain of energytapping.com).

## Updating from David
When David sends a revised program file, replace `index.html` with his new version, then re-apply
the three `scheduleRemotePush()` hooks and the appended gate `<script>` block (with the Supabase
creds). His edits won't collide as long as he doesn't rewrite the save / start-fresh / name-field
internals. Push to `main` and Vercel redeploys automatically.
