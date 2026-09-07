import { select, isCancel, intro, outro } from '@clack/prompts'
import pc from 'picocolors'
import { banner as brandBanner, uva, folha } from '../lib/colors.mjs'
import { runInit } from './init.mjs'
import { runCommit } from './commit.mjs'
import { runBranch } from './branch.mjs'
import { runNewFile } from './new-file.mjs'
import { runPush } from './push.mjs'

export async function runStart() {
  intro(brandBanner('UVA CLI'))

  console.log('')
  console.log(uva('  uva-cli') + pc.dim(' — Git workflow automation'))
  console.log('')
  console.log(pc.dim('  Guides your team through branch creation and commits'))
  console.log(pc.dim('  following whatever conventions your project defines.'))
  console.log('')

  const action = await select({
    message: 'What do you want to do?',
    options: [
      {
        value: 'init',
        label: folha('uva init') + '     Set up UVA CLI for this project',
        hint: 'configure commit and branch patterns',
      },
      {
        value: 'commit',
        label: uva('uva commit') + '   Create an interactive commit',
        hint: 'select files, type, ticket and message',
      },
      {
        value: 'branch',
        label: uva('uva branch') + '   Create a new branch',
        hint: 'checks out source and pulls automatically',
      },
      {
        value: 'new-file',
        label: uva('uva new-file') + ' Scaffold a file from a template',
        hint: 'docs, frontend (React), or backend (Express)',
      },
      {
        value: 'push',
        label: uva('uva push') + '     Push the current branch to origin',
        hint: 'confirms the branch and runs git push',
      },
    ],
  })

  if (isCancel(action)) {
    outro(pc.dim('Operation cancelled.'))
    process.exit(0)
  }

  console.log('')

  if (action === 'init') return runInit()
  if (action === 'commit') return runCommit()
  if (action === 'branch') return runBranch()
  if (action === 'new-file') return runNewFile()
  if (action === 'push') return runPush()
}
