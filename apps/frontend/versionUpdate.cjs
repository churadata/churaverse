const { spawnSync } = require('node:child_process')
const fs = require('node:fs')
const path = require('node:path')

let deployVersionTxt = ''
try {
  deployVersionTxt = fs.readFileSync(path.join(__dirname, 'deploy_version.txt'), 'utf-8').trim()
} catch (_e) {
  // Ignore error if file doesn't exist
}

const timestamp = Math.floor(Date.now() / 1000)
const deployVersion = `${timestamp}:${deployVersionTxt}`

const env = {
  ...process.env,
  VITE_DEPLOY_VERSION: deployVersion,
  VITE_FRONT_VERSION: process.env.npm_package_version || require('./package.json').version,
}

process.on('SIGINT', () => process.exit(0))
process.on('SIGTERM', () => process.exit(0))

const args = process.argv.slice(2)

// If arguments are provided, spawn the command
if (args.length > 0) {
  // Use shell: true to support things like 'vite build' properly
  // Since cross-platform execution of node modules can be tricky, shell: true helps resolve 'vite'
  const result = spawnSync(args[0], args.slice(1), { stdio: 'inherit', env, shell: true })
  if (result.status != null) process.exit(result.status)
  // devサーバーをCtrl+C等で止めた場合のみ正常終了扱いにする。
  // それ以外のシグナル(OOM時のSIGABRTなど)は失敗として返さないと、ビルドの失敗が握りつぶされる
  process.exit(result.signal === 'SIGINT' || result.signal === 'SIGTERM' ? 0 : 1)
} else {
  // No command specified, just exit (graceful fallback)
  process.exit(0)
}
