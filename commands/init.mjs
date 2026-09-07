import { text, select, confirm, isCancel } from '@clack/prompts'
import { bannerIntro, bannerOutro, bannerCancelled } from '../lib/banner.mjs'
import { loadConfig, saveConfig } from '../lib/config.mjs'
import { COMMIT_FORMATS, BRANCH_FORMATS } from '../lib/types.mjs'
import { getLocale } from '../lib/i18n.mjs'

export async function runInit() {
  bannerIntro('init')

  // Language is always the first question — no config exists yet
  const lang = await select({
    message: 'Language / Idioma',
    options: [
      { value: 'en', label: 'English' },
      { value: 'pt-br', label: 'Português (BR)' },
    ],
  })
  if (isCancel(lang)) {
    bannerCancelled()
    process.exit(0)
  }

  const t = getLocale({ project: { lang } })

  const existing = loadConfig()
  if (existing) {
    const overwrite = await confirm({ message: t.init.overwriteConfirm })
    if (isCancel(overwrite) || !overwrite) {
      bannerCancelled(t.common.cancelled)
      process.exit(0)
    }
  }

  const projectName = await text({
    message: t.init.projectName,
    placeholder: t.init.projectNamePlaceholder,
    validate: (v) => (v.trim() ? undefined : t.init.projectNameError),
  })
  if (isCancel(projectName)) {
    bannerCancelled(t.common.cancelled)
    process.exit(0)
  }

  const useTicket = await confirm({ message: t.init.ticketConfirm })
  if (isCancel(useTicket)) {
    bannerCancelled(t.common.cancelled)
    process.exit(0)
  }

  let ticketPrefix = ''
  let ticketPlaceholder = ''

  if (useTicket) {
    const prefix = await text({
      message: t.init.ticketPrefix,
      placeholder: t.init.ticketPrefixPlaceholder,
      validate: (v) => (v.trim() ? undefined : t.init.ticketPrefixError),
    })
    if (isCancel(prefix)) {
      bannerCancelled(t.common.cancelled)
      process.exit(0)
    }
    ticketPrefix = prefix.trim().toUpperCase()
    ticketPlaceholder = `${ticketPrefix}-42`
  }

  let commitFormat = 'conventional'
  if (useTicket) {
    const selectedCommitFormat = await select({
      message: t.init.commitFormat,
      options: COMMIT_FORMATS.map((f) => ({
        ...f,
        label: f.label.replace(/PROJ/g, ticketPrefix || 'PROJ'),
      })),
    })
    if (isCancel(selectedCommitFormat)) {
      bannerCancelled(t.common.cancelled)
      process.exit(0)
    }
    commitFormat = selectedCommitFormat
  }

  const sourcesInput = await text({
    message: t.init.sources,
    placeholder: t.init.sourcesPlaceholder,
    initialValue: 'main,develop',
    validate: (v) => {
      const parts = v
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
      return parts.length > 0 ? undefined : t.init.sourcesError
    },
  })
  if (isCancel(sourcesInput)) {
    bannerCancelled(t.common.cancelled)
    process.exit(0)
  }
  const sources = sourcesInput
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)

  let branchFormat = 'type-name'
  if (useTicket) {
    const selectedBranchFormat = await select({
      message: t.init.branchFormat,
      options: BRANCH_FORMATS.map((f) => ({
        ...f,
        label: f.label.replace(/PROJ/g, ticketPrefix || 'PROJ'),
      })),
    })
    if (isCancel(selectedBranchFormat)) {
      bannerCancelled(t.common.cancelled)
      process.exit(0)
    }
    branchFormat = selectedBranchFormat
  }

  const useArea = await confirm({
    message: t.init.areaConfirm,
    initialValue: false,
  })
  if (isCancel(useArea)) {
    bannerCancelled(t.common.cancelled)
    process.exit(0)
  }

  let areas = []
  if (useArea) {
    const areasInput = await text({
      message: t.init.areaLabels,
      placeholder: t.init.areaLabelsPlaceholder,
      initialValue: 'FE,BE,DOC',
      validate: (v) => {
        const parts = v
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
        return parts.length > 0 ? undefined : t.init.areaLabelsError
      },
    })
    if (isCancel(areasInput)) {
      bannerCancelled(t.common.cancelled)
      process.exit(0)
    }
    areas = areasInput
      .split(',')
      .map((s) => s.trim().toUpperCase())
      .filter(Boolean)
  }

  const config = {
    project: { name: projectName.trim(), lang },
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
  bannerOutro(t.init.saved(configPath))
}
