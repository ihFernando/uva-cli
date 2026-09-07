import en from './locales/en.mjs'
import ptBr from './locales/pt-br.mjs'

const locales = { en, 'pt-br': ptBr }

export function getLocale(config) {
  const lang = config?.project?.lang ?? 'en'
  return locales[lang] ?? en
}
