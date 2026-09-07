import { select, text, confirm, isCancel, log } from '@clack/prompts'
import { bannerIntro, bannerOutro, bannerCancelled } from '../lib/banner.mjs'
import { hasUncommittedChanges, checkout, pull, createBranch } from '../lib/git.mjs'
import { COMMIT_TYPES } from '../lib/types.mjs'
import { requireConfig } from '../lib/config.mjs'
import { buildBranchName } from '../lib/format.mjs'
import { getLocale } from '../lib/i18n.mjs'

// Called by commander as runBranch(options, command)
export async function runBranch(opts = {}) {
  bannerIntro('branch')

  const config = requireConfig()
  const t = getLocale(config)

  if (hasUncommittedChanges()) {
    const proceed = await confirm({ message: t.branch.uncommittedConfirm })
    if (isCancel(proceed) || !proceed) {
      log.info(t.branch.uncommittedTip)
      bannerCancelled(t.common.cancelled)
      process.exit(0)
    }
  }

  // ── Source branch ────────────────────────────────────────────────────────
  let source
  if (opts.source) {
    if (!config.branch.sources.includes(opts.source)) {
      log.warn(t.branch.sourceWarn(opts.source))
    }
    source = opts.source
  } else {
    source = await select({
      message: t.branch.source,
      options: config.branch.sources.map((b) => ({ value: b, label: b })),
    })
    if (isCancel(source)) {
      bannerCancelled(t.common.cancelled)
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
        message: t.branch.ticket,
        placeholder: config.commit.ticketPlaceholder,
        validate: (v) => (v.trim() ? undefined : t.branch.ticketError),
      })
      if (isCancel(input)) {
        bannerCancelled(t.common.cancelled)
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
      log.error(t.branch.invalidType(opts.type, valid.join(', ')))
      process.exit(1)
    }
    type = opts.type
  } else {
    type = await select({ message: t.branch.type, options: COMMIT_TYPES })
    if (isCancel(type)) {
      bannerCancelled(t.common.cancelled)
      process.exit(0)
    }
  }

  // ── Task name ────────────────────────────────────────────────────────────
  let taskName
  if (opts.name) {
    taskName = opts.name
  } else {
    const input = await text({
      message: t.branch.name,
      placeholder: t.branch.namePlaceholder,
      validate: (v) => (v.trim() ? undefined : t.branch.nameError),
    })
    if (isCancel(input)) {
      bannerCancelled(t.common.cancelled)
      process.exit(0)
    }
    taskName = input.trim()
  }

  const branchName = buildBranchName(config.branch.format, { type, ticket, name: taskName })

  // Skip confirmation when fully scripted
  const ticketDone = !config.branch.ticketEnabled || opts.ticket
  const scripted = opts.source && opts.type && opts.name && ticketDone

  if (!scripted) {
    const confirmed = await confirm({ message: t.branch.confirm(branchName) })
    if (isCancel(confirmed) || !confirmed) {
      bannerCancelled(t.common.cancelled)
      process.exit(0)
    }
  }

  try {
    checkout(source)
  } catch {
    log.error(t.branch.checkoutError(source))
    process.exit(1)
  }

  try {
    pull()
  } catch {
    log.error(t.branch.pullError)
    process.exit(1)
  }

  try {
    createBranch(branchName)
  } catch (err) {
    if (err.stderr?.includes('already exists') || err.message?.includes('already exists')) {
      log.error(t.branch.branchExists(branchName))
    } else {
      log.error(t.branch.createError)
    }
    process.exit(1)
  }

  bannerOutro(t.branch.done(branchName))
}
