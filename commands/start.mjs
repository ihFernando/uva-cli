import { select, isCancel, intro, outro } from '@clack/prompts'
import pc from 'picocolors'
import { banner as brandBanner, uva, folha } from '../lib/colors.mjs'
import { loadConfig } from '../lib/config.mjs'
import { getLocale } from '../lib/i18n.mjs'
import { runInit } from './init.mjs'
import { runCommit } from './commit.mjs'
import { runBranch } from './branch.mjs'
import { runNewFile } from './new-file.mjs'
import { runPush } from './push.mjs'

export async function runStart() {
  const t = getLocale(loadConfig())

  intro(brandBanner('UVA CLI'))

  console.log('')
  console.log(uva('  uva-cli') + pc.dim(` ${t.start.tagline}`))
  console.log('')
  console.log(pc.dim(`  ${t.start.desc1}`))
  console.log(pc.dim(`  ${t.start.desc2}`))
  console.log('')

  const o = t.start.options
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
    ],
  })

  if (isCancel(action)) {
    outro(pc.dim(t.common.cancelled))
    process.exit(0)
  }

  console.log('')

  if (action === 'init') return runInit()
  if (action === 'commit') return runCommit()
  if (action === 'branch') return runBranch()
  if (action === 'new-file') return runNewFile()
  if (action === 'push') return runPush()
}
