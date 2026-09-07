import { select, text, multiselect, confirm, isCancel, log } from '@clack/prompts'
import { bannerIntro, bannerOutro, bannerCancelled } from '../lib/banner.mjs'
import { getChangedFiles, addFiles, commit } from '../lib/git.mjs'
import { COMMIT_TYPES } from '../lib/types.mjs'
import { requireConfig } from '../lib/config.mjs'
import { buildCommitMessage } from '../lib/format.mjs'

// Called by commander as runCommit(options, command)
export async function runCommit(opts = {}) {
  bannerIntro('commit')

  const config = requireConfig()
  const files = getChangedFiles()

  if (files.length === 0) {
    log.info('Nothing to commit here.')
    process.exit(0)
  }

  // ── Commit type ──────────────────────────────────────────────────────────
  let type
  if (opts.type) {
    const valid = COMMIT_TYPES.map((t) => t.value)
    if (!valid.includes(opts.type)) {
      log.error(`Invalid --type "${opts.type}". Valid values: ${valid.join(', ')}`)
      process.exit(1)
    }
    type = opts.type
  } else {
    type = await select({ message: 'Commit type', options: COMMIT_TYPES })
    if (isCancel(type)) {
      bannerCancelled()
      process.exit(0)
    }
  }

  // ── Ticket ───────────────────────────────────────────────────────────────
  let ticket = ''
  if (config.commit.ticketEnabled) {
    if (opts.ticket) {
      ticket = opts.ticket
    } else {
      const input = await text({
        message: 'Ticket',
        placeholder: config.commit.ticketPlaceholder,
        validate: (v) => (v.trim() ? undefined : 'Ticket cannot be empty.'),
      })
      if (isCancel(input)) {
        bannerCancelled()
        process.exit(0)
      }
      ticket = input.trim()
    }
  }

  // ── Message + files (retry loop for interactive use) ─────────────────────
  let finalMessage
  let selected

  while (true) {
    // Message
    let message
    if (opts.message) {
      message = opts.message.trim().toLowerCase()
    } else {
      const input = await text({
        message: 'Commit message',
        placeholder: 'add login screen',
        validate: (v) => (v.trim() ? undefined : 'Message cannot be empty.'),
      })
      if (isCancel(input)) {
        bannerCancelled()
        process.exit(0)
      }
      message = input.trim().toLowerCase()
    }

    if (message.length > 72) {
      log.warn(
        'Message is long (over 72 characters). Shorter messages are recommended, but you can continue.',
      )
    }

    // Files
    if (opts.all) {
      selected = files.map((f) => f.path)
    } else if (opts.files) {
      const paths = opts.files
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
      const availablePaths = files.map((f) => f.path)
      const invalid = paths.filter((p) => !availablePaths.includes(p))
      if (invalid.length) {
        log.error(`Unknown file(s): ${invalid.join(', ')}\nAvailable: ${availablePaths.join(', ')}`)
        process.exit(1)
      }
      selected = paths
    } else {
      selected = await multiselect({
        message: 'Which files to include in the commit?',
        options: files.map((f) => ({ value: f.path, label: `${f.status.padEnd(2)}  ${f.path}` })),
        required: true,
      })
      if (isCancel(selected)) {
        bannerCancelled()
        process.exit(0)
      }
    }

    finalMessage = buildCommitMessage(config.commit.format, { type, ticket, message })

    // Skip confirmation when fully scripted (all values came from flags)
    const scripted = opts.type && opts.message && (opts.all || opts.files)
    if (scripted) break

    const confirmed = await confirm({ message: `Commit with message:\n  ${finalMessage}` })
    if (isCancel(confirmed)) {
      bannerCancelled()
      process.exit(0)
    }
    if (confirmed) break

    if (opts.message) break // message is fixed, can't retry
    log.info("OK! Let's rewrite the message.")
  }

  try {
    addFiles(selected)
    commit(finalMessage)
    bannerOutro(`Committed: ${finalMessage}`)
  } catch (e) {
    log.error(`Commit failed: ${e.message}`)
    process.exit(1)
  }
}
