import { existsSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { log } from '@clack/prompts'
import { getGitRoot } from './git.mjs'

function getConfigPath() {
  const root = getGitRoot()
  return join(root, 'uva.config.json')
}

export function loadConfig() {
  const path = getConfigPath()
  if (!existsSync(path)) return null
  try {
    return JSON.parse(readFileSync(path, { encoding: 'utf-8' }))
  } catch {
    return null
  }
}

export function saveConfig(config) {
  const path = getConfigPath()
  writeFileSync(path, JSON.stringify(config, null, 2) + '\n', { encoding: 'utf-8' })
  return path
}

export function requireConfig() {
  const config = loadConfig()
  if (!config) {
    log.error('No configuration found. Run `uva init` to set up your project.')
    process.exit(1)
  }
  return config
}
