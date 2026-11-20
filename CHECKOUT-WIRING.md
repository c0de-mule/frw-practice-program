# Checkout wiring — Finding the Right Words

What connects a **purchase** to the buyer actually getting **into the Program**.
The pages are built and live; this doc is the plumbing for Ashley (order form + Zapier).

## The flow

```
Buyer on /enroll/  →  order form  →  pays  →  redirect to /thankyou/
        │
        └─ Zapier fires on purchase, does TWO things:
             (A) ActiveCampaign: add contact + apply the purchase tag  → welcome email
             (B) Supabase: add the buyer's email to the allow-list     → GRANTS ACCESS
        │
Buyer opens the Program link in the welcome email, enters their purchase email → in.
```

The important bit: **(A) alone does not let anyone in.** The Program checks the Supabase
allow-list. **(B) is what actually grants access.** Skip it and buyers get the email,
click the link, and hit a locked door.

---

## 1. Order form (GHL) — Ashley

- Product: **Finding the Right Words** — **$129** one-time.
- **Post-purchase redirect / "thank-you URL":**
  `https://finding-the-right-words.vercel.app/thankyou/`
  (swap to the branded subdomain once that's pointed at the site.)
- Keep the **"David's work" newsletter opt-in** inside the order form, **unticked by default**.
- Placement on the site: the `/enroll/` page has a checkout slot (`#checkout`) ready for an
  embed, **or** point its button at the hosted checkout URL — tell Everett which and he'll wire it.

## 2. Zapier — two actions on each purchase

**Trigger:** order-form purchase (GHL).

### Action A — ActiveCampaign
Add/update the contact and apply the tag **`Purchase :: Finding the Right Words`**.
That tag triggers the welcome-email automation in AC.

### Action B — grant Program access  ← the easy-to-miss one
Add the buyer's email to the Supabase allow-list, using **Webhooks by Zapier → Custom Request**:

| Field | Value |
|---|---|
| **Method** | `POST` |
| **URL** | `https://cidmtwedjspatzadacor.supabase.co/rest/v1/frw_entitlements` |
| **Data** (JSON) | `{ "email": "{{buyer_email}}", "name": "{{buyer_name}}", "source": "ghl" }` |

**Headers:**

```
apikey:        <SUPABASE_SERVICE_ROLE_KEY>
Authorization: Bearer <SUPABASE_SERVICE_ROLE_KEY>
Content-Type:  application/json
Prefer:        resolution=merge-duplicates
```

- Lowercase + trim `{{buyer_email}}` first (a Zapier **Formatter** step) to keep the list clean.
- `Prefer: resolution=merge-duplicates` makes a repeat purchase update the row instead of erroring
  (works because `email` is the table's primary key).

### The service-role key — read this
- Get it from **Supabase → Project Settings → API → `service_role` secret**
  (NOT the anon / publishable key).
- It bypasses row-level security so it can write to the private entitlements table.
- **Only ever paste it into Zapier (server side). Never put it on the website or anywhere a
  browser can see it.**

## 3. Welcome email (ActiveCampaign) — already drafted (Amber)

- Triggered by the `Purchase :: Finding the Right Words` tag.
- Its access link points at the Program:
  `https://finding-the-right-words.vercel.app/practiceprogram/`
  (swap to the branded subdomain later). The buyer enters their purchase email there → in.

---

## Test it (about 2 minutes)

1. Run a test purchase (or just fire Action B once with a test email).
2. **Supabase → Table Editor → `frw_entitlements`** — confirm the row appeared.
3. Open `/practiceprogram/`, enter that same email — you should get straight in.
4. Confirm the AC tag applied and the welcome email fired.

## Reference

- Supabase project URL: `https://cidmtwedjspatzadacor.supabase.co`
- Table: `frw_entitlements` — columns `email` (primary key), `name`, `source`, `created_at`
- The Program checks access via `frw_check_access(email)`, which matches **case-insensitively**.
- The website itself only ever uses the **publishable/anon** key; the **service-role** key lives
  only in Zapier.
