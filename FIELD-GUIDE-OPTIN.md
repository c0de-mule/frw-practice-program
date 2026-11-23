# Field Guide opt-in — what's built and what's needed

David approved collecting an email before sending the free Field Guide. This is the
plumbing note: what's live on our side, and what Amber (ActiveCampaign) and IT (main
domain) still need to do to turn capture on.

## The flow

```
Someone wants the Field Guide
  → sign-up page  (go.energytapping.com/receive-field-guide/)
  → enters first name + email (optional "keep me posted" checkbox)
  → ActiveCampaign captures them + emails the Guide link
  → thank-you page shows the Guide right away (read online + download PDF)
```

## Built and verified on our site (go.energytapping.com)

- **Sign-up page** `/receive-field-guide/` — our brand, stack-of-papers cover, Carrie's
  copy, first name + email + optional checkbox, Peta Stapleton's endorsement under the form.
- **Thank-you page** `/receive-field-guide/thank-you/` — shows the Guide immediately
  (Read the Field Guide + Download the PDF) and says the link was emailed too.
- **Every promoted route now points at the sign-up page:** the site nav "Field Guide",
  the two links on the landing page, and both links in the Announcements template.
- **`/guideonapage/` redirects to the sign-up page** (its standalone page is retired; the
  Guide on a Page now lives only inside the Practice Program).
- **Field Guide cleanup** (per David): the three "Get the Guide on a Page" CTAs removed,
  and the print line that printed the guideonapage URL removed.
- **Landing page CE copy** and the Practice Program "Personal Reflection" heading updated.

The on-page form currently sends people to the thank-you page (so they get the Guide), but
**it does not capture the email yet** — that waits on the ActiveCampaign setup below.

## What Amber needs to do (ActiveCampaign) — turns capture on

1. Create an AC form for the free Field Guide with three fields: **First name**, **Email**,
   and the optional marketing checkbox.
2. Give us the form's connection details so we can wire our own styled form to it:
   either the form's **action URL + field names**, or an **API key + the list/tag IDs**.
   (No API key goes in the browser; if it's the API route we'll proxy it server-side.)
3. Build the **delivery automation**: everyone who submits gets an email with the Field
   Guide link (`go.energytapping.com/fieldguide/` and/or the PDF).
4. The **checkbox maps to a tag** (e.g. "FRW Marketing OK"). The marketing emails — clinical
   examples, research updates, news from David — go **only to people who tick the box.**
   *(This replaces the Field Guide's old "a few short emails to help you put it into
   practice" offer, which has been removed from the Guide.)*
5. Set the form's post-submit redirect to `…/receive-field-guide/thank-you/`.

## What IT / Karen needs to do (main energytapping.com domain)

These are redirects on the main WordPress site, pointing at the sign-up page:

- `energytapping.com/receive-field-guide` → the sign-up page (its public address).
- `energytapping.com/language` → the sign-up page (the *Frontiers* paper points here).
- `energytapping.com/guideonapage/` → the sign-up page.
- Point the **Announcements page** on the main site at the sign-up page too.
- **Keep** `energytapping.com/practiceprogram/guideonapage.pdf` as-is — the Practice
  Program links to it.

## The downloadable PDF — done

The `fieldguide.pdf` download is a 40-page print of David's standalone **Field_Guide.html**
(not of our interactive web page). The same three deletions were applied to that file and
the PDF was reprinted and verified: still 40 pages, cover unchanged, the two "Get the Guide
on a Page" buttons removed from page 2 and the final CTA page, page breaks intact.

The edited source is kept at `pdf-source/Field_Guide.html` (outside the served site). To
regenerate after a future edit:

```
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless=new --no-pdf-header-footer \
  --print-to-pdf="site/public/fieldguide/fieldguide.pdf" \
  "file://$PWD/pdf-source/Field_Guide.html"
```

If David sends a newer Field_Guide.html, replace `pdf-source/Field_Guide.html` with it
(re-applying the three deletions if they aren't already in his copy) and rerun the command.
