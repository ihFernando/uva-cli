import os from 'node:os'
import { intro, outro } from '@clack/prompts'
import pc from 'picocolors'
import { banner as brandBanner, folha, uva } from './colors.mjs'
import { getLocale } from './i18n.mjs'

export function bannerIntro(command) {
  intro(brandBanner('UVA CLI') + '  ' + pc.dim(command))
}

export function bannerOutro(message) {
  outro(folha('+ ' + message))
}

export function bannerCancelled(message = 'Operation cancelled.') {
  outro(pc.dim(message))
}

// ── Welcome screen ──────────────────────────────────────────────────────────

const W = 36 // inner width of the welcome box

function wrapLine(plain, applyColor = (s) => s) {
  const pad = W - plain.length
  const l = Math.floor(pad / 2)
  const r = pad - l
  return uva('│') + ' '.repeat(l) + applyColor(plain) + ' '.repeat(r) + uva('│')
}

function grapeLine(plain) {
  return wrapLine(plain, (s) =>
    s
      .replace(/●/g, uva('●'))
      .replace(/│/g, folha('│'))
      .replace(/~/g, folha('<'))
      .replace(/</g, folha('<'))
      .replace(/>/g, folha('>')),
  )
}

export function printWelcome(config) {
  const t = getLocale(config)
  const projectName = config?.project?.name
  const rawDir = process.cwd().replace(os.homedir(), '~')
  const dir = rawDir.length > W - 2 ? '…' + rawDir.slice(-(W - 3)) : rawDir

  const h = uva('─'.repeat(W))
  console.log(uva('╭') + h + uva('╮'))
  console.log(wrapLine(''))
  console.log(grapeLine('<│>'))
  console.log(grapeLine('● ● ●'))
  console.log(grapeLine('● ● ● ●'))
  console.log(grapeLine('● ● ●'))
  console.log(grapeLine('● ●'))
  console.log(grapeLine('●'))
  console.log(wrapLine(''))
  console.log(wrapLine(t.start.welcome, (s) => pc.bold(pc.white(s))))
  console.log(wrapLine(''))
  if (projectName) console.log(wrapLine(projectName, (s) => uva(s)))
  console.log(wrapLine(dir, (s) => pc.dim(s)))
  console.log(wrapLine(''))
  console.log(uva('╰') + h + uva('╯'))
}
