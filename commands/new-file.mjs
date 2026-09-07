import { select, text, confirm, isCancel, log } from '@clack/prompts'
import { bannerIntro, bannerOutro, bannerCancelled } from '../lib/banner.mjs'
import { getGitRoot } from '../lib/git.mjs'
import { slugify } from '../lib/slugify.mjs'
import { execSync } from 'child_process'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// ── Template registry ──────────────────────────────────────────────────────

const CATEGORIES = {
  docs: {
    label: 'Docs — documentation files',
    types: [
      {
        value: 'adr',
        label: 'ADR            Architecture Decision Record',
        folder: 'docs/decisions',
      },
      {
        value: 'decision-log',
        label: 'Decision Log   Lightweight decision entry',
        folder: 'docs/decisions',
      },
      {
        value: 'meeting-notes',
        label: 'Meeting Notes  Agenda, notes, and action items',
        folder: 'docs/meetings',
      },
      { value: 'rfc', label: 'RFC            Technical proposal / spec', folder: 'docs/rfcs' },
      {
        value: 'runbook',
        label: 'Runbook        Operational step-by-step guide',
        folder: 'docs/runbooks',
      },
    ],
  },
  git: {
    label: 'Git — GitHub workflow files',
    types: [
      {
        value: 'pull-request',
        label: 'PR Template    GitHub pull request template',
        folder: '.github',
        fixedName: 'pull_request_template.md',
      },
    ],
  },
}

const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'pt-br', label: 'Português (BR)' },
]

// ── Helpers ────────────────────────────────────────────────────────────────

function getAuthor() {
  try {
    return execSync('git config user.name', { encoding: 'utf-8' }).trim() || 'unknown'
  } catch {
    return 'unknown'
  }
}

function getDate() {
  return new Date().toISOString().split('T')[0]
}

function applyTemplate(content, vars) {
  return content
    .replace(/\{\{title\}\}/g, vars.title)
    .replace(/\{\{date\}\}/g, vars.date)
    .replace(/\{\{author\}\}/g, vars.author)
}

// ── Command ────────────────────────────────────────────────────────────────

// Called by commander as runNewFile(options, command)
export async function runNewFile(opts = {}) {
  bannerIntro('new-file')

  // ── Language ─────────────────────────────────────────────────────────────
  let lang
  if (opts.lang) {
    const valid = LANGUAGES.map((l) => l.value)
    if (!valid.includes(opts.lang)) {
      log.error(`Invalid --lang "${opts.lang}". Valid values: ${valid.join(', ')}`)
      process.exit(1)
    }
    lang = opts.lang
  } else {
    lang = await select({ message: 'Language', options: LANGUAGES })
    if (isCancel(lang)) {
      bannerCancelled()
      process.exit(0)
    }
  }

  // ── Category ─────────────────────────────────────────────────────────────
  let category
  if (opts.category) {
    const valid = Object.keys(CATEGORIES)
    if (!valid.includes(opts.category)) {
      log.error(`Invalid --category "${opts.category}". Valid values: ${valid.join(', ')}`)
      process.exit(1)
    }
    category = opts.category
  } else {
    category = await select({
      message: 'Category',
      options: Object.entries(CATEGORIES).map(([value, { label }]) => ({ value, label })),
    })
    if (isCancel(category)) {
      bannerCancelled()
      process.exit(0)
    }
  }

  // ── Type ─────────────────────────────────────────────────────────────────
  const types = CATEGORIES[category].types
  let type
  if (opts.type) {
    const valid = types.map((t) => t.value)
    if (!valid.includes(opts.type)) {
      log.error(
        `Invalid --type "${opts.type}" for category "${category}". Valid values: ${valid.join(', ')}`,
      )
      process.exit(1)
    }
    type = opts.type
  } else {
    type = await select({
      message: 'File type',
      options: types.map((t) => ({ value: t.value, label: t.label })),
    })
    if (isCancel(type)) {
      bannerCancelled()
      process.exit(0)
    }
  }

  const def = types.find((t) => t.value === type)
  const templatePath = join(__dirname, '../templates', lang, category, `${type}.md`)

  if (!existsSync(templatePath)) {
    log.error(`Template not found: templates/${lang}/${category}/${type}.md`)
    process.exit(1)
  }

  const author = getAuthor()
  const date = getDate()

  // ── Git templates: fixed output path, no name needed ─────────────────────
  if (def.fixedName) {
    const root = getGitRoot()
    const absFolder = join(root, def.folder)
    const absFile = join(absFolder, def.fixedName)
    const relPath = join(def.folder, def.fixedName)

    if (existsSync(absFile)) {
      const overwrite = await confirm({ message: `"${relPath}" already exists. Overwrite?` })
      if (isCancel(overwrite) || !overwrite) {
        bannerCancelled()
        process.exit(0)
      }
    }

    const content = applyTemplate(readFileSync(templatePath, { encoding: 'utf-8' }), {
      title: '',
      date,
      author,
    })
    if (!existsSync(absFolder)) mkdirSync(absFolder, { recursive: true })
    writeFileSync(absFile, content, { encoding: 'utf-8' })
    bannerOutro(`Created: ${relPath}`)
    return
  }

  // ── Docs templates: need a title and output folder ────────────────────────
  let rawName
  if (opts.name) {
    rawName = opts.name
  } else {
    const input = await text({
      message: 'Title',
      placeholder: 'Switch auth library to Lucia',
      validate: (v) => (v.trim() ? undefined : 'Title cannot be empty.'),
    })
    if (isCancel(input)) {
      bannerCancelled()
      process.exit(0)
    }
    rawName = input.trim()
  }

  const fileName = `${slugify(rawName)}.md`

  let outputFolder
  if (opts.folder) {
    outputFolder = opts.folder
  } else {
    const input = await text({
      message: 'Output folder',
      initialValue: def.folder,
      validate: (v) => (v.trim() ? undefined : 'Folder cannot be empty.'),
    })
    if (isCancel(input)) {
      bannerCancelled()
      process.exit(0)
    }
    outputFolder = input.trim()
  }

  const root = getGitRoot()
  const absFolder = join(root, outputFolder)
  const absFile = join(absFolder, fileName)
  const relPath = join(outputFolder, fileName)

  if (existsSync(absFile)) {
    const overwrite = await confirm({ message: `"${relPath}" already exists. Overwrite?` })
    if (isCancel(overwrite) || !overwrite) {
      bannerCancelled()
      process.exit(0)
    }
  }

  const content = applyTemplate(readFileSync(templatePath, { encoding: 'utf-8' }), {
    title: rawName,
    date,
    author,
  })

  if (!existsSync(absFolder)) mkdirSync(absFolder, { recursive: true })
  writeFileSync(absFile, content, { encoding: 'utf-8' })
  bannerOutro(`Created: ${relPath}`)
}
