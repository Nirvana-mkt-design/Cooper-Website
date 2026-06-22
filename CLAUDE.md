# Cooper Website — Project Context

## What is Cooper?
Cooper is an AI platform built for insurance professionals. This repo contains the marketing website (React + Vite + Tailwind) inside the `cooper-site/` directory.

## Tech Stack
- React 19 + TypeScript
- Vite 8
- Tailwind CSS 4
- React Router (SPA with client-side routing)
- Deployed via Vercel CLI to https://askcooper.vercel.app

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
- Deploy to Vercel with `npx vercel --prod` from the `cooper-site/` directory, then alias with `npx vercel alias <deploy-url> askcooper.vercel.app`
- When deploying, always deploy from `cooper-site/` (not from root)

## Asana Integration

- Every PR merge triggers a GitHub Action that posts to the relevant Asana task
- The file-to-page mapping in `asana-config.json` determines which Asana tasks get updated
- Daily summary runs at midnight UTC
- Comments on Asana are posted in office-friendly English, not technical jargon

## Code Conventions

- Styling: Tailwind utility classes with explicit pixel values `[Xpx]`
- Fonts: `font-serif` (headings), `font-grotesk` (labels/caps), `font-sans` (body)
- Colors: `text-dark`, `text-cream-light`, `text-accent-orange`, `bg-cream`, `bg-cream-light`
- Animations: `animate-fade-blur-in` (with blur), `animate-fade-in` (no blur)
- Copy style: No em dashes. Use commas or break into separate sentences.
