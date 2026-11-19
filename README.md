# FRW Practice Program — gated + synced prototype

David's "Finding the Right Words" Practice Program, wrapped with:
- a **purchaser email gate** (only people on the allow-list get in), and
- **cross-device progress** (results saved to a backend, not just this browser).

`index.html` is David's original file **unchanged**, except:
- three one-line `scheduleRemotePush()` hooks inside the existing save / start-fresh / name handlers, and
- one appended `<script>` block at the bottom (the gate + sync layer, clearly commented).

## Run it locally
```bash
cd prototypes/frw-program
python3 -m http.server 8777
```
Open http://localhost:8777/index.html — try `buyer@example.com` or `test@example.com`.
No database needed; a local mock stands in until you add Supabase.

## Make it real
See **SUPABASE-SETUP.md** — ~10 minutes: create a project, run the SQL, paste two keys.

## Status / open questions
- Auth: email-only by Everett's call (simple). Upgrade path to magic-link documented.
- **Checkout processor?** — needed to auto-grant access + tag in ActiveCampaign.
- **Where does this get hosted?** — it's one static file; any host works.
- **Which repo is its home?** This lives in the Eden Method Website repo for now but is a
  *different property* (energytapping.com). It is **not committed**. Decide its real home.
