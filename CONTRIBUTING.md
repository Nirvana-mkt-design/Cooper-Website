# Contributing to Cooper Website

## Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/Nirvana-mkt-design/Cooper-Website.git
cd Cooper-Website/cooper-site
npm install
npm run dev
```

### 2. Register yourself

Before you start working, make sure your Git identity is set up:

```bash
git config user.name   # should show your name
git config user.email  # should show your email
```

If you're using Claude Code or another AI assistant, it will automatically detect your identity and help you register on your first session.

If you prefer to register manually, add yourself to `.github/asana-config.json` under `user_mappings`:

```json
"your-github-username": {
  "asana_gid": "your-asana-user-gid",
  "name": "Your Full Name",
  "git_name": "YourGitName",
  "git_email": "your@email.com",
  "registered_by": "your-github-username",
  "registered_at": "2026-06-22"
}
```

**How to find your Asana GID:** Ask the project admin (Hygor) or check your Asana profile URL — the number in the URL is your GID.

### 3. How your work gets tracked

Every time a Pull Request is merged, a GitHub Action automatically:
- Detects which pages were affected by your changes
- Posts a friendly summary to the relevant Asana task
- Tags it with your name

A daily summary also runs at midnight (UTC) collecting everything that happened that day.

## Workflow

1. Make your changes locally
2. Test on `localhost:5173`
3. When ready, ask to commit and push
4. Create a Pull Request to `main`
5. Once merged, the Asana update happens automatically

## Deploying to Vercel

Deployments are done via the Vercel CLI from the `cooper-site/` directory. Only push to Vercel when you're ready for the changes to go live.

## Project Structure

```
Cooper-Website/
├── .github/
│   ├── asana-config.json      # User mappings + page-to-task mappings
│   ├── scripts/
│   │   └── asana-notify.cjs   # Asana notification script
│   └── workflows/
│       └── asana-sync.yml     # GitHub Action
├── cooper-site/               # The actual website
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── data/              # Persona data, etc.
│   │   └── index.css          # Global styles + animations
│   ├── public/images/         # Static assets
│   └── vercel.json            # SPA routing rewrites
├── CLAUDE.md                  # AI assistant project context
└── CONTRIBUTING.md            # This file
```

## Questions?

Reach out to Hygor Ammirk (project admin) on Asana or Slack.
