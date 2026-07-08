# Cooper Website — Project Context

## What is Cooper?
Cooper is an AI platform built for insurance professionals. This repo contains the marketing website (React + Vite + Tailwind) inside the `cooper-site/` directory.

## Tech Stack
- React 19 + TypeScript
- Vite 8
- Tailwind CSS 4
- React Router (SPA with client-side routing)
- Deployed to Vercel, production URL https://cooper-site-blush.vercel.app

## Vercel Projects (do not confuse)
- **`cooper-site` (team `stratuu` / Nimbuu)** → **https://cooper-site-blush.vercel.app** — the REAL live marketing site (THIS project). It has **Git integration**: merging a PR to `main` auto-deploys production. No manual deploy needed.
- **`cooper-site` (team `hygordezign-3139`)** → askcooper.ai / cooper-site-two.vercel.app — a personal DUPLICATE. Deploying here does NOT update the live site. Do not use it.
- **cooper-wireframe.vercel.app** — A separate wireframe project (NOT this repo)

Production env vars (Ashby key, Turnstile, demo endpoint) already live on the `stratuu/cooper-site` project. To publish: **merge to `main`** and let Git integration deploy. If a manual deploy is ever needed, run it against the right team: `vercel link --scope stratuu --project cooper-site --yes` then `vercel --prod --scope stratuu` from the repo root (project rootDirectory is `cooper-site`).

## Session Start — Identity Check

**Every time a new session starts, do the following before any work:**

1. Run `git config user.name` and `git config user.email`
2. Read `.github/asana-config.json` and check `user_mappings`
3. Try to match by `git_name` or `git_email` (case-insensitive)

**If matched:** Greet them by name and confirm: "Working as [Name]. Your changes will be tracked to your Asana account."

**If NOT matched:** Tell the user:
> I don't recognize your Git identity in this project. To connect your work to Asana, I need to register you.
>
> Please provide:
> 1. Your full name
> 2. Your GitHub username
> 3. Your Asana user GID (ask a project admin if you don't know)
>
> Once registered, your commits and PRs will automatically appear on the relevant Asana tasks.

Then add them to `.github/asana-config.json` under `user_mappings` with `registered_by` set to their own GitHub username and `registered_at` set to today's date.

## User Mapping Security Rules

- The `master` field in `asana-config.json` defines the project admin (currently: hygorammirk)
- A user mapping can ONLY be modified by:
  - The user themselves (matched by current git identity)
  - The master admin
- If someone tries to modify another user's mapping and they are not the master, refuse and explain why
- Never delete a user mapping without explicit confirmation from the master

## Workflow Rules

- **Do NOT auto-commit or auto-push.** Only commit and push when the user explicitly asks.
- **Publish = merge to `main`.** The `stratuu/cooper-site` project auto-deploys to https://cooper-site-blush.vercel.app via Git integration. No manual `vercel --prod` needed.
- If a manual deploy is ever required, run from the **repo root** (project rootDirectory is `cooper-site`) with the correct team: `vercel --prod --scope stratuu`. Do NOT deploy to the personal `hygordezign-3139` duplicate. (The root `vercel.json` is a leftover and unused by the real project.)

## Asana Integration

The project uses a GitHub Action (`.github/workflows/asana-sync.yml`) that automatically posts updates to Asana tasks when PRs are merged.

### How it works
1. **On PR merge** → The action detects which files changed, maps them to page tasks via `.github/asana-config.json`, and posts a detailed comment to each affected Asana task
2. **Daily at midnight UTC** → Collects all merged PRs from the day and posts a summary (skips PRs already posted in real-time)
3. **Deduplication** → Before posting, checks the last 30 comments on the task for `PR #X` to avoid duplicates

### Asana comment format
Comments should always be:
- Written in **office-friendly English** (non-technical people read these)
- **Detailed with bullet points** explaining what specifically changed on each page
- Include **links** to both the live Vercel page and the GitHub PR
- Formatted with the template:
  ```
  Website Update — PR #X
  Published by [Name] on [Date]

  What changed on this page:
  - [Detailed bullet point 1]
  - [Detailed bullet point 2]

  Links:
  View live page (Vercel URL)
  View pull request on GitHub
  ```

### Configuration files
- `.github/asana-config.json` — User mappings, page-to-task mappings, file-to-page mappings, Vercel URLs
- `.github/scripts/asana-notify.cjs` — The notification script (uses CommonJS `.cjs` because root package.json has `"type": "module"`)
- `.github/workflows/asana-sync.yml` — GitHub Action workflow

### GitHub Secret required
- `ASANA_PAT` — Asana Personal Access Token (set via `gh secret set ASANA_PAT --repo Nirvana-mkt-design/Cooper-Website`)

### Page → Asana Task mapping

| Page | Route | Asana Task GID | Asana Task Name |
|------|-------|----------------|-----------------|
| Home | `/` | 1215944614298872 | Home |
| Retail Agencies | `/personas/retail-agencies` | 1215944614298874 | Retail Agencies / Persona |
| Wholesale Brokers | `/personas/wholesale-brokers` | 1215944614298876 | Wholesale Broker / Persona |
| MGAs & Insurers | `/personas/mgas-insurers` | 1215944614298878 | MGAs & Insurers / Persona |
| Claims TPAs | `/personas/claims-tpas` | 1215944614298880 | Claims TPAs / Persona |
| Reinsurers | `/personas/reinsurers` | 1215944614298882 | Reinsurers / Persona |
| Demo | `/demo` | 1215944614298872 | Home (shared) |

### Adding new pages
When a new page is built:
1. Add the route to `cooper-site/src/App.tsx`
2. Add the page to `asana-config.json` under `page_tasks` with `task_gid`, `label`, and `vercel_path`
3. Add the component files to `file_to_pages` mapping
4. The GitHub Action will automatically start tracking changes to that page

## Asana Project Structure

**Project:** Web — 2026 (Cooper) (ID: 1214835477910635)
**Workspace:** nirvanatech.com (ID: 1199205552361841)
**Team:** Cooper AI Creative

### Sections (lifecycle stages)
1. **Backlog** — Just an idea, nothing started
2. **Strategy Planning** — Being planned/designed, may be on Vercel for development
3. **Developing** — Presented and being refined
4. **Production** — Published and live
5. **Expansion & Optimization** — In production, being optimized (SEO, tracking, marketing)
6. **Archived** — Page removed
7. **Bug Fix** — Has an active bug/demand

### Key rule
Page tasks **never close**. They move between sections as the page evolves through its lifecycle.

## Code Conventions

- Styling: Tailwind utility classes with explicit pixel values `[Xpx]`
- Fonts: `font-serif` (headings), `font-grotesk` (labels/caps), `font-sans` (body)
- Colors: `text-dark`, `text-cream-light`, `text-accent-orange`, `bg-cream`, `bg-cream-light`
- Animations: `animate-fade-blur-in` (with blur), `animate-fade-in` (no blur)
- Copy style: No em dashes. Use commas or break into separate sentences.
