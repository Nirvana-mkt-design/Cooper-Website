# Cooper demo-form worker (stopgap)

Temporary backend for the `/demo` request form on the Cooper marketing site.
It exists to give the form **spam protection now**, without waiting on changes
to the team's own API.

## What it does

1. The site posts the demo request (plus a Cloudflare Turnstile token) to this
   Worker instead of `api.askcooper.ai`.
2. The Worker verifies the Turnstile token **server-side** (this is the only
   place the captcha is actually enforced — client-side checks can be bypassed).
3. On success it stores the lead in a Cloudflare **D1** database (`demo_leads`).

If Turnstile fails, the lead is rejected with `400 { error: "captcha_failed" }`.

## Current deployment (Cooper's Cloudflare account)

| Resource | Value |
| --- | --- |
| Worker | `cooper-demo-form` → https://cooper-demo-form.askcooper.workers.dev |
| D1 database | `cooper-demo-leads`, table `demo_leads` |
| Turnstile widget | `Cooper Demo Form` (managed mode) |
| Worker secret | `TURNSTILE_SECRET_KEY` (set out-of-band, never committed) |

The site is wired to it through two Vercel **production** env vars on the
`cooper-site` project:

- `VITE_DEMO_ENDPOINT` = the Worker URL
- `VITE_TURNSTILE_SITE_KEY` = the public Turnstile site key

**Gating:** if either env var is missing, the form falls back to posting to
`api.askcooper.ai` exactly as before. Nothing breaks in a deploy without them.

## Local development

```bash
cd demo-form-worker
npm install
echo -n "<turnstile secret>" | npx wrangler secret put TURNSTILE_SECRET_KEY
npx wrangler dev      # local worker
npx wrangler tail     # live logs
```

## Reading / exporting leads

```bash
npx wrangler d1 execute cooper-demo-leads --remote \
  --command "SELECT * FROM demo_leads ORDER BY created_at DESC;"
```

## Handoff — moving this to the team's own infrastructure

This is a stopgap. To take it over, the team has two paths:

**A. Keep posting to your own API (retire this Worker).**
1. Add Turnstile server-side verification to your `/api/v1/demo-requests/`
   endpoint (verify the `turnstile_token` field against
   `https://challenges.cloudflare.com/turnstile/v0/siteverify`).
2. Create your own Turnstile widget and set `VITE_TURNSTILE_SITE_KEY` +
   `TURNSTILE_SECRET_KEY` on your side.
3. Point `VITE_DEMO_ENDPOINT` at your endpoint (or clear it to use the default
   `VITE_API_ORIGIN` path, which already sends the same payload).
4. Export the leads collected here (command above) and delete the D1 database.

**B. Keep this Worker, move it to your Cloudflare account.**
1. Recreate the Turnstile widget + D1 database on your account.
2. Update `account_id` and `database_id` in `wrangler.toml`, re-set the secret,
   and `wrangler deploy`.
3. Repoint `VITE_DEMO_ENDPOINT` to your Worker URL.

The request payload is identical to what the site already sends to
`api.askcooper.ai`, with one extra field: `turnstile_token`.
