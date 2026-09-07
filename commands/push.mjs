import { confirm, isCancel, log } from '@clack/prompts'
import { bannerIntro, bannerOutro, bannerCancelled } from '../lib/banner.mjs'
import { getCurrentBranch } from '../lib/git.mjs'
import { spawnSync } from 'child_process'

// Called by commander as runPush(options, command)
export async function runPush(opts = {}) {
  bannerIntro('push')

  const branch = getCurrentBranch()

  if (!opts.yes) {
    const confirmed = await confirm({
      message: `Push current branch: ${branch}?`,
    })
    if (isCancel(confirmed) || !confirmed) {
      bannerCancelled()
      process.exit(0)
    }
  }

  const result = spawnSync('git', ['push', 'origin', branch], {
    stdio: ['pipe', 'inherit', 'inherit'],
  })
  if (result.status !== 0) {
    log.error('Push failed — see the output above.')
    process.exit(1)
  }

  bannerOutro(`Pushed: origin/${branch}`)
}
