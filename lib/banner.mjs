import { intro, outro } from '@clack/prompts'
import pc from 'picocolors'
import { banner as brandBanner, folha } from './colors.mjs'

export function bannerIntro(command) {
  intro(brandBanner('UVA CLI') + '  ' + pc.dim(command))
}

export function bannerOutro(message) {
  outro(folha('+ ' + message))
}

export function bannerCancelled(message = 'Operation cancelled.') {
  outro(pc.dim(message))
}
