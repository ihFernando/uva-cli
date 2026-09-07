import { slugify } from './slugify.mjs'

export function buildCommitMessage(format, { type, ticket, message }) {
  switch (format) {
    case 'conventional-ticket':
      return `${type}(${ticket}): ${message}`
    case 'ticket-conventional':
      return `[${ticket}] ${type}: ${message}`
    case 'conventional':
    default:
      return `${type}: ${message}`
  }
}

export function buildBranchName(format, { type, ticket, name }) {
  const slug = slugify(name)
  switch (format) {
    case 'type-ticket-name':
      return `${type}/${ticket}_${slug}`
    case 'ticket-type-name':
      return `${ticket}/${type}/${slug}`
    case 'type-name':
    default:
      return `${type}/${slug}`
  }
}
