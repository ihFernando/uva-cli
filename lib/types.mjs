export const COMMIT_TYPES = [
  { value: 'feat', label: 'feat     · New feature' },
  { value: 'fix', label: 'fix      · Bug fix' },
  { value: 'docs', label: 'docs     · Documentation change' },
  { value: 'style', label: 'style    · Formatting, no logic change' },
  { value: 'refactor', label: 'refactor · Refactor without behavior change' },
  { value: 'test', label: 'test     · Add or fix tests' },
  { value: 'chore', label: 'chore    · Build tasks, configs, dependencies' },
]

export const COMMIT_FORMATS = [
  {
    value: 'conventional-ticket',
    label: 'feat(PROJ-42): add login screen',
    hint: 'Conventional Commits with ticket',
  },
  {
    value: 'conventional',
    label: 'feat: add login screen',
    hint: 'Conventional Commits, no ticket',
  },
  {
    value: 'ticket-conventional',
    label: '[PROJ-42] feat: add login screen',
    hint: 'Ticket first, then conventional type',
  },
]

export const BRANCH_FORMATS = [
  {
    value: 'type-ticket-name',
    label: 'feat/PROJ-42_add-login-screen',
    hint: 'type/ticket_name',
  },
  {
    value: 'type-name',
    label: 'feat/add-login-screen',
    hint: 'type/name (no ticket in branch)',
  },
  {
    value: 'ticket-type-name',
    label: 'PROJ-42/feat/add-login-screen',
    hint: 'ticket/type/name',
  },
]
