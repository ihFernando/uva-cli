import { text, select, confirm, isCancel } from '@clack/prompts'
import { bannerIntro, bannerOutro, bannerCancelled } from '../lib/banner.mjs'
import { loadConfig, saveConfig } from '../lib/config.mjs'
import { COMMIT_FORMATS, BRANCH_FORMATS } from '../lib/types.mjs'

export async function runInit() {
  bannerIntro('init')

  const existing = loadConfig()
  if (existing) {
    const overwrite = await confirm({
      message: 'A configuration already exists. Do you want to overwrite it?',
    })
    if (isCancel(overwrite) || !overwrite) {
      bannerCancelled()
      process.exit(0)
    }
  }

  const projectName = await text({
    message: 'Project name',
    placeholder: 'My Awesome Project',
    validate: (v) => (v.trim() ? undefined : 'Project name cannot be empty.'),
  })
  if (isCancel(projectName)) {
    bannerCancelled()
    process.exit(0)
  }

  const useTicket = await confirm({
    message: 'Do you use a ticket/issue tracker? (e.g., Jira, Linear, GitHub Issues)',
  })
  if (isCancel(useTicket)) {
    bannerCancelled()
    process.exit(0)
  }

  let ticketPrefix = ''
  let ticketPlaceholder = ''

  if (useTicket) {
    const prefix = await text({
      message: 'Ticket prefix',
      placeholder: 'PROJ',
      validate: (v) => (v.trim() ? undefined : 'Ticket prefix cannot be empty.'),
    })
    if (isCancel(prefix)) {
      bannerCancelled()
      process.exit(0)
    }
    ticketPrefix = prefix.trim().toUpperCase()
    ticketPlaceholder = `${ticketPrefix}-42`
  }

  let commitFormat = 'conventional'
  if (useTicket) {
    const selectedCommitFormat = await select({
      message: 'Choose a commit message format',
      options: COMMIT_FORMATS.map((f) => ({
        ...f,
        label: f.label.replace(/PROJ/g, ticketPrefix || 'PROJ'),
      })),
    })
    if (isCancel(selectedCommitFormat)) {
      bannerCancelled()
      process.exit(0)
    }
    commitFormat = selectedCommitFormat
  }

  const sourcesInput = await text({
    message: 'Branches to branch from (comma-separated)',
    placeholder: 'main,develop',
    initialValue: 'main,develop',
    validate: (v) => {
      const parts = v
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
      return parts.length > 0 ? undefined : 'At least one branch is required.'
    },
  })
  if (isCancel(sourcesInput)) {
    bannerCancelled()
    process.exit(0)
  }
  const sources = sourcesInput
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)

  let branchFormat = 'type-name'
  if (useTicket) {
    const selectedBranchFormat = await select({
      message: 'Choose a branch naming format',
      options: BRANCH_FORMATS.map((f) => ({
        ...f,
        label: f.label.replace(/PROJ/g, ticketPrefix || 'PROJ'),
      })),
    })
    if (isCancel(selectedBranchFormat)) {
      bannerCancelled()
      process.exit(0)
    }
    branchFormat = selectedBranchFormat
  }

  const useArea = await confirm({
    message: 'Do you want to categorize branches by area? (e.g., FE, BE, DOC)',
    initialValue: false,
  })
  if (isCancel(useArea)) {
    bannerCancelled()
    process.exit(0)
  }

  let areas = []
  if (useArea) {
    const areasInput = await text({
      message: 'Area labels (comma-separated)',
      placeholder: 'FE,BE,DOC',
      initialValue: 'FE,BE,DOC',
      validate: (v) => {
        const parts = v
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
        return parts.length > 0 ? undefined : 'At least one area is required.'
      },
    })
    if (isCancel(areasInput)) {
      bannerCancelled()
      process.exit(0)
    }
    areas = areasInput
      .split(',')
      .map((s) => s.trim().toUpperCase())
      .filter(Boolean)
  }

  const config = {
    project: { name: projectName.trim() },
    commit: {
      ticketEnabled: Boolean(useTicket),
      ticketPrefix,
      ticketPlaceholder,
      format: commitFormat,
    },
    branch: {
      sources,
      ticketEnabled: Boolean(useTicket),
      areaEnabled: Boolean(useArea),
      areas,
      format: branchFormat,
    },
  }

  const configPath = saveConfig(config)
  bannerOutro(`Configuration saved to ${configPath}`)
}
