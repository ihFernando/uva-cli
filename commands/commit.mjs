import { select, text, multiselect, confirm, isCancel, log } from '@clack/prompts'
import { bannerIntro, bannerOutro, bannerCancelled } from '../lib/banner.mjs'
import { getChangedFiles, getCurrentBranch, addFiles, commit } from '../lib/git.mjs'
import { COMMIT_TYPES } from '../lib/types.mjs'
import { requireConfig } from '../lib/config.mjs'
import { buildCommitMessage } from '../lib/format.mjs'
import { getLocale } from '../lib/i18n.mjs'

function extractTicketFromBranch(branch, prefix) {
  if (!prefix) return ''
  const m = branch.match(new RegExp(`(${prefix}-\\d+)`, 'i'))
  return m ? m[1].toUpperCase() : ''
}

// Called by commander as runCommit(options, command)
export async function runCommit(opts = {}) {
  bannerIntro('commit')

  const config = requireConfig()
  const t = getLocale(config)
  const files = getChangedFiles()

  if (files.length === 0) {
    log.info(t.commit.nothingToCommit)
    process.exit(0)
  }

  // ── Commit type ──────────────────────────────────────────────────────────
  let type
  if (opts.type) {
    const valid = COMMIT_TYPES.map((t) => t.value)
    if (!valid.includes(opts.type)) {
      log.error(t.commit.invalidType(opts.type, valid.join(', ')))
      process.exit(1)
    }
    type = opts.type
  } else {
    type = await select({ message: t.commit.type, options: COMMIT_TYPES })
    if (isCancel(type)) {
      bannerCancelled(t.common.cancelled)
      process.exit(0)
    }
  }

  // ── Ticket ───────────────────────────────────────────────────────────────
  let ticket = ''
  if (config.commit.ticketEnabled) {
    if (opts.ticket) {
      ticket = opts.ticket
    } else {
      const branchTicket = extractTicketFromBranch(getCurrentBranch(), config.commit.ticketPrefix)
      const input = await text({
        message: t.commit.ticket,
        placeholder: config.commit.ticketPlaceholder,
        initialValue: branchTicket,
        validate: (v) => (v.trim() ? undefined : t.commit.ticketError),
      })
      if (isCancel(input)) {
        bannerCancelled(t.common.cancelled)
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
        message: t.commit.message,
        placeholder: t.commit.messagePlaceholder,
        validate: (v) => (v.trim() ? undefined : t.commit.messageError),
      })
      if (isCancel(input)) {
        bannerCancelled(t.common.cancelled)
        process.exit(0)
      }
      message = input.trim().toLowerCase()
    }

    if (message.length > 72) {
      log.warn(t.commit.messageLong)
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
        log.error(t.commit.unknownFiles(invalid.join(', '), availablePaths.join(', ')))
        process.exit(1)
      }
      selected = paths
    } else {
      const fileOptions = files.map((f) => ({
        value: f.path,
        label: `${f.status.padEnd(2)}  ${f.path}`,
      }))
      if (files.length >= 5) {
        fileOptions.unshift({ value: '__all__', label: t.commit.allFiles })
      }
      selected = await multiselect({
        message: t.commit.files,
        options: fileOptions,
        required: true,
      })
      if (isCancel(selected)) {
        bannerCancelled(t.common.cancelled)
        process.exit(0)
      }
      if (selected.includes('__all__')) {
        selected = files.map((f) => f.path)
      }
    }

    finalMessage = buildCommitMessage(config.commit.format, { type, ticket, message })

    // Skip confirmation when fully scripted (all values came from flags)
    const scripted = opts.type && opts.message && (opts.all || opts.files)
    if (scripted) break

    const confirmed = await confirm({ message: t.commit.confirm(finalMessage) })
    if (isCancel(confirmed)) {
      bannerCancelled(t.common.cancelled)
      process.exit(0)
    }
    if (confirmed) break

    if (opts.message) break // message is fixed, can't retry
    log.info(t.commit.retry)
  }

  try {
    addFiles(selected)
    commit(finalMessage)
    bannerOutro(t.commit.done(finalMessage))
  } catch (e) {
    log.error(t.commit.failed(e.message))
    process.exit(1)
  }
}
