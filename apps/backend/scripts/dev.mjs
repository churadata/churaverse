#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs'
import { execa } from 'execa'

function loadDotEnv(path) {
  if (!existsSync(path)) return {}
  return Object.fromEntries(
    readFileSync(path, 'utf8')
      .split('\n')
      .map((line) => line.replace(/#.*$/, '').trim())
      .filter((line) => line.includes('='))
      .map((line) => line.split('=', 2))
  )
}

const appVersion = process.env.APP_VERSION ?? process.env.npm_package_version ?? '0.0.0'

// tsx watch を使う。子を確実に終了してから再起動するため、node --watch の二段構成で
// 起きていたポート/inspector の解放漏れ(EADDRINUSE、特に Windows)を避けられる。
// inspector は引数で渡す(NODE_OPTIONS だと watcher と子が 9229 を奪い合う)。
const child = execa({
  stdio: 'inherit',
  env: {
    ...loadDotEnv('.env'), // .env の値をデフォルトとして使用
    ...process.env, // シェルの環境変数で上書き可能
    APP_VERSION: appVersion,
  },
})`tsx watch --inspect=0.0.0.0:9229 src/server.ts`

const shutdownSignals = ['SIGINT', 'SIGTERM']
for (const signal of shutdownSignals) {
  process.on(signal, () => {
    if (child.pid) child.kill(signal)
  })
}

child.nodeChildProcess.on('exit', (code, signal) => {
  if (signal) process.exit(0)
  process.exit(code ?? 0)
})
