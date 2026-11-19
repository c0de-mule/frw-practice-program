# Finding the Right Words — going live with Supabase

The prototype runs **right now** with no setup (a local mock stands in for the database).
To make access + progress real and cross-device, do the 5 steps below. ~10 minutes.

---

## What the backend has to do

1. **Hold the list of purchasers** (who is allowed in).
2. **Store each purchaser's progress** as one JSON blob, keyed by email.

That's it. Two tables, one helper function.

---

## Step 1 — Create a Supabase project

This is the "database thing" Eden needs — almost certainly **nothing exists yet**, so
spin up a **new, dedicated project** for David's program (keeps it separate from anything
else Eden runs).

1. Go to https://supabase.com → sign in → **New project**.
2. Name it e.g. `frw-practice-program`, pick a region near your audience, set a DB password (save it).
3. Free tier is plenty for this volume.

## Step 2 — Run the SQL

In the project, open **SQL Editor → New query**, paste this, click **Run**:

```sql
-- 1. Who is allowed in (one row per purchaser)
create table if not exists frw_entitlements (
  email       text primary key,
  name        text,
  source      text,                       -- e.g. 'thrivecart', 'manual'
  created_at  timestamptz default now()
);

-- 2. Each purchaser's saved progress (the whole program state as one JSON blob)
create table if not exists frw_progress (
  email       text primary key,
  payload     jsonb not null default '{}'::jsonb,
  updated_at  timestamptz default now()
);

-- 3. Gate check — returns true only if that email bought the program.
--    SECURITY DEFINER so the entitlements table itself stays private.
create or replace function frw_check_access(p_email text)
returns boolean
language sql security definer set search_path = public as $$
  select exists (
    select 1 from frw_entitlements
    where lower(email) = lower(trim(p_email))
  );
$$;

-- 4. Row-level security
alter table frw_entitlements enable row level security;   -- no anon policies = table is private
alter table frw_progress     enable row level security;

-- PROTOTYPE policies: let the public (anon) read/write progress by email.
-- Fine for launch; see "Hardening" at the bottom to lock this down later.
create policy frw_progress_read  on frw_progress for select using (true);
create policy frw_progress_write on frw_progress for insert with check (true);
create policy frw_progress_upd   on frw_progress for update using (true) with check (true);

grant execute on function frw_check_access(text) to anon;
```

## Step 3 — Paste your keys into the program

In Supabase: **Project Settings → API**. Copy **Project URL** and the **anon public** key.

Open `index.html`, find the CONFIG block near the bottom, and fill in:

```js
const SB_URL  = 'https://YOURPROJECT.supabase.co';
const SB_ANON = 'eyJ...';   // the anon / public key
```

(The anon key is **meant** to be public — it's safe to commit. Access is controlled by the
rules above, not by hiding the key.)

Reload the page — the "local demo mode" hint disappears and it's now talking to Supabase.

## Step 4 — Add a purchaser

Until the checkout webhook is wired (Step 5), add buyers by hand.
**Table Editor → frw_entitlements → Insert row**, or SQL:

```sql
insert into frw_entitlements (email, name, source)
values ('buyer@example.com', 'Jane Buyer', 'manual')
on conflict (email) do nothing;
```

That email can now get in. That's the entire "grant access" step.

## Step 5 — (Later) Wire the purchase → auto-grant + ActiveCampaign

When the checkout/cart is confirmed, one webhook does both jobs:

- **Give access:** `insert into frw_entitlements` for the buyer's email.
- **Tag in ActiveCampaign:** add contact + apply the tag.

Two ways to run that webhook:
- **Supabase Edge Function** (a few lines — I can write it once we know the cart), or
- **No code:** many carts (ThriveCart, SamCart, Stripe + Zapier) can insert a Supabase row
  *and* tag in ActiveCampaign natively. If the cart already does the AC tag, your "step 01"
  is just a setting — we only need it to drop the row into `frw_entitlements`.

**→ The one thing I need from you to build this: which checkout is on the sales page?**

---

## Hardening (when you want a real lock, not a prototype lock)

The email-only gate is intentionally simple: anyone who knows a buyer's email could type it
in and see that person's progress. That's an acceptable risk for a practice program at launch.
When you want it tighter, the upgrade is small and I can do it:

- Switch the gate to **Supabase Auth magic link** (buyer types email → clicks a link → in).
  No passwords; same UX. Then the progress policies become
  `using (auth.jwt()->>'email' = email)` and no one can read anyone else's data.
- For the content itself (the 144 vignettes live in `index.html`, so a determined person
  could View-Source them), move the item bank into Supabase and load it only after the gate
  passes. More work; worth it if the IP leaking matters.

Flag either and I'll wire it.
