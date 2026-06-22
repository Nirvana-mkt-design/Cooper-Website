/**
 * Asana ↔ GitHub Sync
 *
 * Posts friendly, non-technical updates to Asana tasks
 * when PRs are merged or as a daily summary.
 *
 * Usage:
 *   node asana-notify.js pr       — called on PR merge
 *   node asana-notify.js daily    — called by midnight cron
 */

const https = require('https')
const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

// ── Config ──────────────────────────────────────────────
const CONFIG_PATH = path.join(__dirname, '..', 'asana-config.json')
const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'))

const ASANA_TOKEN = process.env.ASANA_PAT
const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const REPO = process.env.GITHUB_REPOSITORY // e.g. "Nirvana-mkt-design/Cooper-Website"

if (!ASANA_TOKEN) {
  console.error('Missing ASANA_PAT secret')
  process.exit(1)
}

// ── Asana API helpers ───────────────────────────────────
function asanaRequest(method, endpoint, body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'app.asana.com',
      path: `/api/1.0${endpoint}`,
      method,
      headers: {
        'Authorization': `Bearer ${ASANA_TOKEN}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    }

    const req = https.request(options, (res) => {
      let data = ''
      res.on('data', (chunk) => (data += chunk))
      res.on('end', () => {
        try {
          resolve(JSON.parse(data))
        } catch {
          resolve(data)
        }
      })
    })

    req.on('error', reject)
    if (body) req.write(JSON.stringify(body))
    req.end()
  })
}

async function postComment(taskGid, htmlText) {
  return asanaRequest('POST', `/tasks/${taskGid}/stories`, {
    data: { html_text: htmlText },
  })
}

// ── Detect affected pages from changed files ────────────
function detectAffectedPages(changedFiles) {
  const pages = new Set()

  for (const file of changedFiles) {
    // Strip the cooper-site/ prefix if present
    const cleanFile = file.replace(/^cooper-site\//, '')

    for (const [pattern, pageKeys] of Object.entries(config.file_to_pages)) {
      if (cleanFile === pattern || cleanFile.includes(pattern)) {
        for (const key of pageKeys) {
          pages.add(key)
        }
      }
    }
  }

  return [...pages]
}

// ── Get Asana user from GitHub username ──────────────────
function getAsanaUser(githubUsername) {
  const mapping = config.user_mappings[githubUsername]
  return mapping || { asana_gid: null, name: githubUsername }
}

// ── Summarize changes in plain English ──────────────────
function summarizeChanges(commits) {
  // Extract commit messages, clean them up
  const messages = commits
    .map((c) => c.message || c)
    .filter((m) => !m.startsWith('Merge'))
    .filter((m) => !m.includes('Co-Authored-By'))
    .map((m) => m.split('\n')[0]) // first line only

  if (messages.length === 0) return 'Minor updates and maintenance.'

  // Group by type of change
  const updates = []
  for (const msg of messages) {
    // Make it office-friendly: remove technical prefixes
    let clean = msg
      .replace(/^(fix|feat|chore|refactor|style|docs)(\(.+?\))?:\s*/i, '')
      .replace(/^(Add|Update|Remove|Fix|Change)\s+/i, (match) => match)

    // Capitalize first letter
    clean = clean.charAt(0).toUpperCase() + clean.slice(1)
    updates.push(clean)
  }

  return updates.join('. ') + '.'
}

// ── PR Merge Handler ────────────────────────────────────
async function handlePRMerge() {
  const eventPath = process.env.GITHUB_EVENT_PATH
  if (!eventPath) {
    console.error('No GITHUB_EVENT_PATH found')
    process.exit(1)
  }

  const event = JSON.parse(fs.readFileSync(eventPath, 'utf8'))
  const pr = event.pull_request

  if (!pr || !pr.merged) {
    console.log('PR was not merged, skipping.')
    return
  }

  const prTitle = pr.title
  const prUrl = pr.html_url
  const prNumber = pr.number
  const prAuthor = pr.user.login
  const asanaUser = getAsanaUser(prAuthor)

  // Get changed files from the PR
  const changedFilesRaw = execSync(
    `gh pr view ${prNumber} --json files --jq '.files[].path'`,
    { encoding: 'utf8' }
  ).trim()
  const changedFiles = changedFilesRaw.split('\n').filter(Boolean)

  // Get commits
  const commitsRaw = execSync(
    `gh pr view ${prNumber} --json commits --jq '.commits[].messageHeadline'`,
    { encoding: 'utf8' }
  ).trim()
  const commits = commitsRaw.split('\n').filter(Boolean)

  const affectedPages = detectAffectedPages(changedFiles)
  const summary = summarizeChanges(commits)

  if (affectedPages.length === 0) {
    console.log('No page-specific tasks affected. Skipping Asana update.')
    return
  }

  // Deduplicate task GIDs (multiple pages might map to same task)
  const taskUpdates = new Map()
  for (const pageKey of affectedPages) {
    const taskInfo = config.page_tasks[pageKey]
    if (!taskInfo) continue

    if (!taskUpdates.has(taskInfo.task_gid)) {
      taskUpdates.set(taskInfo.task_gid, {
        label: taskInfo.label,
        pages: [],
      })
    }
    taskUpdates.get(taskInfo.task_gid).pages.push(pageKey)
  }

  // Post to each affected Asana task
  for (const [taskGid, info] of taskUpdates) {
    const html = `<body>
<strong>Website Update</strong> by ${asanaUser.name}

${summary}

<em>PR #${prNumber}: ${prTitle}</em>
<a href="${prUrl}">View pull request on GitHub</a>
</body>`

    console.log(`Posting to Asana task: ${info.label} (${taskGid})`)
    const result = await postComment(taskGid, html)

    if (result.errors) {
      console.error(`Error posting to ${info.label}:`, result.errors)
    } else {
      console.log(`Posted successfully to ${info.label}`)
    }
  }
}

// ── Daily Summary Handler ───────────────────────────────
async function handleDailySummary() {
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  const since = yesterday.toISOString().split('T')[0]
  const until = today.toISOString().split('T')[0]

  // Get all merged PRs from the last 24h
  let prsRaw = ''
  try {
    prsRaw = execSync(
      `gh pr list --state merged --search "merged:${since}..${until}" --json number,title,author,files,commits,mergedAt,url --limit 50`,
      { encoding: 'utf8' }
    ).trim()
  } catch {
    console.log('No merged PRs found for today.')
    return
  }

  const prs = JSON.parse(prsRaw || '[]')
  if (prs.length === 0) {
    console.log('No merged PRs today. Skipping daily summary.')
    return
  }

  // Group by author
  const byAuthor = new Map()
  for (const pr of prs) {
    const author = pr.author.login
    if (!byAuthor.has(author)) byAuthor.set(author, [])
    byAuthor.get(author).push(pr)
  }

  // Group by affected Asana task
  const taskSummaries = new Map()

  for (const pr of prs) {
    const changedFiles = (pr.files || []).map((f) => f.path)
    const affectedPages = detectAffectedPages(changedFiles)
    const commits = (pr.commits || []).map((c) => c.messageHeadline)
    const summary = summarizeChanges(commits)
    const author = getAsanaUser(pr.author.login)

    for (const pageKey of affectedPages) {
      const taskInfo = config.page_tasks[pageKey]
      if (!taskInfo) continue

      if (!taskSummaries.has(taskInfo.task_gid)) {
        taskSummaries.set(taskInfo.task_gid, {
          label: taskInfo.label,
          entries: [],
        })
      }

      taskSummaries.get(taskInfo.task_gid).entries.push({
        author: author.name,
        summary,
        prNumber: pr.number,
        prTitle: pr.title,
        prUrl: pr.url,
      })
    }
  }

  // Post daily summary to each affected task
  for (const [taskGid, info] of taskSummaries) {
    const entriesHtml = info.entries
      .map(
        (e) =>
          `<li><strong>${e.author}</strong>: ${e.summary} (<a href="${e.prUrl}">PR #${e.prNumber}</a>)</li>`
      )
      .join('\n')

    const html = `<body>
<strong>Daily Summary — ${until}</strong>

Here's what happened on this page today:
<ul>
${entriesHtml}
</ul>
</body>`

    console.log(`Posting daily summary to: ${info.label}`)
    const result = await postComment(taskGid, html)

    if (result.errors) {
      console.error(`Error posting to ${info.label}:`, result.errors)
    } else {
      console.log(`Daily summary posted to ${info.label}`)
    }
  }
}

// ── Main ────────────────────────────────────────────────
const mode = process.argv[2]

if (mode === 'pr') {
  handlePRMerge().catch(console.error)
} else if (mode === 'daily') {
  handleDailySummary().catch(console.error)
} else {
  console.log('Usage: node asana-notify.js [pr|daily]')
  process.exit(1)
}
