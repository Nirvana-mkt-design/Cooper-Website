/**
 * Asana <> GitHub Sync
 *
 * Posts friendly, non-technical updates to Asana tasks
 * when PRs are merged or as a daily summary.
 * Deduplicates: will not re-post if a PR was already reported.
 *
 * Usage:
 *   node asana-notify.cjs pr       — called on PR merge
 *   node asana-notify.cjs daily    — called by midnight cron
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
const REPO = process.env.GITHUB_REPOSITORY

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

async function getRecentComments(taskGid) {
  const result = await asanaRequest(
    'GET',
    `/tasks/${taskGid}/stories?opt_fields=text,created_at,type&limit=30`
  )
  if (!result.data) return []
  // Only return comment-type stories (not system events)
  return result.data.filter((s) => s.type === 'comment')
}

// ── Deduplication: check if a PR was already posted ─────
async function isPRAlreadyPosted(taskGid, prNumber) {
  const comments = await getRecentComments(taskGid)
  const prTag = `PR #${prNumber}`
  return comments.some((c) => c.text && c.text.includes(prTag))
}

// ── Detect affected pages from changed files ────────────
function detectAffectedPages(changedFiles) {
  const pages = new Set()

  for (const file of changedFiles) {
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

// ── Summarize changes as bullet points ──────────────────
function summarizeChanges(commits) {
  const messages = commits
    .map((c) => c.message || c)
    .filter((m) => !m.startsWith('Merge'))
    .filter((m) => !m.includes('Co-Authored-By'))
    .map((m) => m.split('\n')[0])

  if (messages.length === 0) return '<li>Minor updates and maintenance.</li>'

  const updates = []
  for (const msg of messages) {
    let clean = msg
      .replace(/^(fix|feat|chore|refactor|style|docs)(\(.+?\))?:\s*/i, '')

    clean = clean.charAt(0).toUpperCase() + clean.slice(1)
    updates.push(`<li>${clean}</li>`)
  }

  return updates.join('\n')
}

// ── Build Vercel URL for a page ─────────────────────────
function getVercelUrl(pageKey) {
  const task = config.page_tasks[pageKey]
  if (!task || !task.vercel_path) return null
  return (config.vercel_base_url || 'https://askcooper.vercel.app') + task.vercel_path
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

  const changedFilesRaw = execSync(
    `gh pr view ${prNumber} --json files --jq '.files[].path'`,
    { encoding: 'utf8' }
  ).trim()
  const changedFiles = changedFilesRaw.split('\n').filter(Boolean)

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

  // Deduplicate task GIDs
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

  // Post to each affected Asana task (skip if already posted)
  for (const [taskGid, info] of taskUpdates) {
    const alreadyPosted = await isPRAlreadyPosted(taskGid, prNumber)
    if (alreadyPosted) {
      console.log(`PR #${prNumber} already posted to ${info.label}. Skipping.`)
      continue
    }

    // Build Vercel links for all pages mapped to this task
    const vercelLinks = info.pages
      .map((p) => getVercelUrl(p))
      .filter(Boolean)
      .filter((v, i, a) => a.indexOf(v) === i)
      .map((url) => `<a href="${url}">View live page</a>`)
      .join(' | ')

    const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })

    const html = `<body><strong>Website Update — PR #${prNumber}</strong>
Published by <strong>${asanaUser.name}</strong> on ${today}

<strong>What changed on this page:</strong>
<ul>
${summary}
</ul>

<strong>Links:</strong>
${vercelLinks ? vercelLinks + '\n' : ''}<a href="${prUrl}">View pull request on GitHub</a>
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

  // Post daily summary to each affected task (skip if all PRs already posted)
  for (const [taskGid, info] of taskSummaries) {
    // Check which PRs are already posted
    const newEntries = []
    for (const entry of info.entries) {
      const alreadyPosted = await isPRAlreadyPosted(taskGid, entry.prNumber)
      if (!alreadyPosted) {
        newEntries.push(entry)
      } else {
        console.log(`PR #${entry.prNumber} already posted to ${info.label}. Skipping in daily summary.`)
      }
    }

    if (newEntries.length === 0) {
      console.log(`All PRs already posted to ${info.label}. Nothing new to summarize.`)
      continue
    }

    // Build Vercel link for this task
    const firstPage = Object.entries(config.page_tasks).find(([, v]) => v.task_gid === taskGid)
    const vercelUrl = firstPage ? getVercelUrl(firstPage[0]) : null
    const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })

    const entriesHtml = newEntries
      .map(
        (e) =>
          `<strong>${e.author}</strong> (<a href="${e.prUrl}">PR #${e.prNumber}</a>):\n<ul>\n${e.summary}\n</ul>`
      )
      .join('\n\n')

    const html = `<body><strong>Daily Summary — ${today}</strong>

Here's what happened on this page today:

${entriesHtml}

<strong>Links:</strong>
${vercelUrl ? '<a href="' + vercelUrl + '">View live page</a>\n' : ''}<a href="https://github.com/${REPO}">View repository on GitHub</a>
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
  console.log('Usage: node asana-notify.cjs [pr|daily]')
  process.exit(1)
}
