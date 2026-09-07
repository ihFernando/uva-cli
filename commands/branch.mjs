import { select, text, confirm, isCancel, log } from '@clack/prompts'
import { bannerIntro, bannerOutro, bannerCancelled } from '../lib/banner.mjs'
import { hasUncommittedChanges, checkout, pull, createBranch } from '../lib/git.mjs'
import { COMMIT_TYPES } from '../lib/types.mjs'
import { requireConfig } from '../lib/config.mjs'
import { buildBranchName } from '../lib/format.mjs'

// Called by commander as runBranch(options, command)
export async function runBranch(opts = {}) {
  bannerIntro('branch')

  const config = requireConfig()

  if (hasUncommittedChanges()) {
    const proceed = await confirm({
      message: 'You have uncommitted changes. They will carry over to the new branch. Continue?',
    })
    if (isCancel(proceed) || !proceed) {
      log.info('Tip: run `uva commit` first to commit pending changes.')
      bannerCancelled()
      process.exit(0)
    }
  }

  // ── Source branch ────────────────────────────────────────────────────────
  let source
  if (opts.source) {
    if (!config.branch.sources.includes(opts.source)) {
      log.warn(`"${opts.source}" is not in the configured source branches. Proceeding anyway.`)
    }
    source = opts.source
  } else {
    source = await select({
      message: 'Branch from',
      options: config.branch.sources.map((b) => ({ value: b, label: b })),
    })
    if (isCancel(source)) {
      bannerCancelled()
      process.exit(0)
    }
  }

  // ── Ticket ───────────────────────────────────────────────────────────────
  let ticket = ''
  if (config.branch.ticketEnabled) {
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

  // ── Branch type ──────────────────────────────────────────────────────────
  let type
  if (opts.type) {
    const valid = COMMIT_TYPES.map((t) => t.value)
    if (!valid.includes(opts.type)) {
      log.error(`Invalid --type "${opts.type}". Valid values: ${valid.join(', ')}`)
      process.exit(1)
    }
    type = opts.type
  } else {
    type = await select({ message: 'Branch type', options: COMMIT_TYPES })
    if (isCancel(type)) {
      bannerCancelled()
      process.exit(0)
    }
  }

  // ── Task name ────────────────────────────────────────────────────────────
  let taskName
  if (opts.name) {
    taskName = opts.name
  } else {
    const input = await text({
      message: 'Task name',
      placeholder: 'add login screen',
      validate: (v) => (v.trim() ? undefined : 'Task name cannot be empty.'),
    })
    if (isCancel(input)) {
      bannerCancelled()
      process.exit(0)
    }
    taskName = input.trim()
  }

  const branchName = buildBranchName(config.branch.format, { type, ticket, name: taskName })

  // Skip confirmation when fully scripted
  const ticketDone = !config.branch.ticketEnabled || opts.ticket
  const scripted = opts.source && opts.type && opts.name && ticketDone

  if (!scripted) {
    const confirmed = await confirm({ message: `Create branch:\n  ${branchName}` })
    if (isCancel(confirmed) || !confirmed) {
      bannerCancelled()
      process.exit(0)
    }
  }

  try {
    checkout(source)
  } catch {
    log.error(
      `Could not switch to ${source}. Make sure the branch exists and there are no conflicts.`,
    )
    process.exit(1)
  }

  try {
    pull()
  } catch {
    log.error('Could not pull. Check your connection or resolve any conflicts.')
    process.exit(1)
  }

  try {
    createBranch(branchName)
  } catch (err) {
    if (err.stderr?.includes('already exists') || err.message?.includes('already exists')) {
      log.error(`Branch "${branchName}" already exists. Choose a different name or ticket.`)
    } else {
      log.error('Could not create the branch. Check if the name is valid.')
    }
    process.exit(1)
  }

  bannerOutro(`Branch created: ${branchName}`)
}
