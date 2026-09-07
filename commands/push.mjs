import { confirm, isCancel, log } from '@clack/prompts'
import { bannerIntro, bannerOutro, bannerCancelled } from '../lib/banner.mjs'
import { getCurrentBranch } from '../lib/git.mjs'
import { loadConfig } from '../lib/config.mjs'
import { getLocale } from '../lib/i18n.mjs'
import { spawnSync } from 'child_process'

// Called by commander as runPush(options, command)
export async function runPush(opts = {}) {
  bannerIntro('push')

  const t = getLocale(loadConfig())
  const branch = getCurrentBranch()

  if (!opts.yes) {
    const confirmed = await confirm({ message: t.push.confirm(branch) })
    if (isCancel(confirmed) || !confirmed) {
      bannerCancelled(t.common.cancelled)
      process.exit(0)
    }
  }

  const result = spawnSync('git', ['push', 'origin', branch], {
    stdio: ['pipe', 'inherit', 'inherit'],
  })
  if (result.status !== 0) {
    log.error(t.push.failed)
    process.exit(1)
  }

  bannerOutro(t.push.done(branch))
}
