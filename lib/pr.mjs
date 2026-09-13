import { spawnSync } from 'child_process'

export function parseRemoteUrl(remoteUrl) {
  if (!remoteUrl) return null

  // SSH: git@github.com:owner/repo.git
  const sshMatch = remoteUrl.match(/^git@([^:]+):(.+?)(?:\.git)?$/)
  if (sshMatch) return { host: sshMatch[1], path: sshMatch[2] }

  // HTTPS: https://github.com/owner/repo.git
  const httpsMatch = remoteUrl.match(/^https?:\/\/([^/]+)\/(.+?)(?:\.git)?$/)
  if (httpsMatch) return { host: httpsMatch[1], path: httpsMatch[2] }

  return null
}

export function buildPrUrl(remoteUrl, branch) {
  const parsed = parseRemoteUrl(remoteUrl)
  if (!parsed) return null

  const { host, path } = parsed
  const b = encodeURIComponent(branch)

  if (host.includes('github.com')) {
    return `https://github.com/${path}/compare/${b}?expand=1`
  }
  if (host.includes('gitlab')) {
    return `https://${host}/${path}/-/merge_requests/new?merge_request[source_branch]=${b}`
  }
  if (host.includes('bitbucket.org')) {
    return `https://bitbucket.org/${path}/pull-requests/new?source=${b}`
  }

  return null
}

export function openBrowser(url) {
  if (process.platform === 'win32') {
    spawnSync('cmd', ['/c', 'start', url], { stdio: 'ignore' })
  } else if (process.platform === 'darwin') {
    spawnSync('open', [url], { stdio: 'ignore' })
  } else {
    spawnSync('xdg-open', [url], { stdio: 'ignore' })
  }
}
