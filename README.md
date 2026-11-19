# FRW Practice Program — gated + synced

David Feinstein's "Finding the Right Words" Practice Program, wrapped with:
- a **purchaser email gate** (only people on the allow-list get in), and
- **cross-device progress** (results saved to Supabase, not just one browser).

`index.html` is David's original file **unchanged**, except:
- three one-line `scheduleRemotePush()` hooks inside the existing save / start-fresh / name handlers, and
- one appended `<script>` block at the bottom (the gate + sync layer, clearly commented).

## Live
- **URL:** https://c0de-mule.github.io/frw-practice-program/ (GitHub Pages, this repo, `main` branch)
- **Database:** Supabase project **"Tapping Program"** — gate + progress verified working end-to-end.
- Purchasers are rows in `frw_entitlements`. Add one to grant access (see SUPABASE-SETUP.md).

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
- **Production home — TBD.** On GitHub Pages for review now; may move to energytapping.com.
