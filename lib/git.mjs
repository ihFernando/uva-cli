import { execSync, spawnSync } from 'child_process'

function exec(cmd) {
  return execSync(cmd, { encoding: 'utf-8', stdio: 'pipe' }).trim()
}

export function getCurrentBranch() {
  return exec('git rev-parse --abbrev-ref HEAD')
}

export function getGitRoot() {
  return exec('git rev-parse --show-toplevel')
}

export function getChangedFiles() {
  const output = exec('git status --porcelain')
  if (!output) return []
  return output
    .split('\n')
    .filter((line) => line.trim())
    .map((line) => {
      // format: XY<space>path (3 chars) or X<space>path (2 chars when Y is space)
      const pathStart = line[2] === ' ' ? 3 : 2
      return {
        status: line.slice(0, pathStart - 1).trim(),
        path: line.slice(pathStart).trim(),
      }
    })
}

export function hasUncommittedChanges() {
  return getChangedFiles().length > 0
}

export function checkout(branch) {
  exec(`git checkout ${branch}`)
}

export function pull() {
  exec('git pull')
}

export function createBranch(name) {
  exec(`git checkout -b ${name}`)
}

export function addFiles(paths) {
  // spawnSync with an array of args avoids any shell quoting issues
  // cwd must be the git root because git status --porcelain returns paths
  // relative to the root, not the current working directory
  const result = spawnSync('git', ['add', '--', ...paths], {
    encoding: 'utf-8',
    stdio: 'pipe',
    cwd: getGitRoot(),
  })
  if (result.status !== 0) {
    throw new Error(result.stderr || 'git add failed')
  }
}

export function commit(message) {
  // pipe stdin to avoid conflicts with the interactive terminal of clack
  // inherit stdout/stderr so that lefthook/commitlint appear normally
  const result = spawnSync('git', ['commit', '-m', message], {
    stdio: ['pipe', 'inherit', 'inherit'],
    cwd: getGitRoot(),
  })
  if (result.status !== 0) {
    throw new Error('git commit failed — see output above')
  }
}
