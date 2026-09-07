import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'
import { homedir } from 'os'
import { log } from '@clack/prompts'
import { getGitRoot } from './git.mjs'

function getConfigPath() {
  try {
    const root = getGitRoot()
    return join(root, 'uva.config.json')
  } catch {
    return null
  }
}

function getGlobalConfigPath() {
  return join(homedir(), '.config', 'uva', 'config.json')
}

export function loadConfig() {
  const path = getConfigPath()
  if (!path || !existsSync(path)) return null
  try {
    return JSON.parse(readFileSync(path, { encoding: 'utf-8' }))
  } catch {
    return null
  }
}

export function loadGlobalConfig() {
  const path = getGlobalConfigPath()
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

export function saveGlobalConfig(config) {
  const dir = join(homedir(), '.config', 'uva')
  const path = join(dir, 'config.json')
  mkdirSync(dir, { recursive: true })
  writeFileSync(path, JSON.stringify(config, null, 2) + '\n', { encoding: 'utf-8' })
  return path
}

export function requireConfig() {
  const config = loadConfig() ?? loadGlobalConfig()
  if (!config) {
    log.error('No configuration found. Run `uva init` to set up your project.')
    process.exit(1)
  }
  return config
}
