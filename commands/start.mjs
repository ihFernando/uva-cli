import { select, isCancel, outro } from '@clack/prompts'
import pc from 'picocolors'
import { uva, folha } from '../lib/colors.mjs'
import { printWelcome } from '../lib/banner.mjs'
import { loadConfig } from '../lib/config.mjs'
import { getLocale } from '../lib/i18n.mjs'
import { runInit } from './init.mjs'
import { runCommit } from './commit.mjs'
import { runBranch } from './branch.mjs'
import { runNewFile } from './new-file.mjs'
import { runPush } from './push.mjs'

export async function runStart() {
  const config = loadConfig()
  const t = getLocale(config)

  printWelcome(config)
  console.log('')

  const o = t.start.options

  while (true) {
    const action = await select({
      message: t.start.prompt,
      options: [
        {
          value: 'init',
          label: folha('uva init') + '     ' + o.init.label,
          hint: o.init.hint,
        },
        {
          value: 'commit',
          label: uva('uva commit') + '   ' + o.commit.label,
          hint: o.commit.hint,
        },
        {
          value: 'branch',
          label: uva('uva branch') + '   ' + o.branch.label,
          hint: o.branch.hint,
        },
        {
          value: 'new-file',
          label: uva('uva new-file') + ' ' + o.newFile.label,
          hint: o.newFile.hint,
        },
        {
          value: 'push',
          label: uva('uva push') + '     ' + o.push.label,
          hint: o.push.hint,
        },
        {
          value: 'exit',
          label: pc.dim('exit') + '          ' + o.exit.label,
        },
      ],
    })

    if (isCancel(action) || action === 'exit') {
      outro(pc.dim(t.common.cancelled))
      process.exit(0)
    }

    console.log('')

    if (action === 'init') await runInit()
    if (action === 'commit') await runCommit()
    if (action === 'branch') await runBranch()
    if (action === 'new-file') await runNewFile()
    if (action === 'push') await runPush()

    console.log('')
  }
}
