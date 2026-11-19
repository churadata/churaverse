#!/usr/bin/env node
import { existsSync, mkdirSync, readdirSync, readFileSync, utimesSync, writeFileSync } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { setTimeout as sleep } from 'node:timers/promises'
import { fileURLToPath } from 'node:url'
import { execa } from 'execa'
import treeKill from 'tree-kill'
import { generateDevTsconfigs } from './gen-dev-tsconfigs.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')

const composeFile = path.join(root, 'docker-compose.dev.yml')
const stateDir = path.join(root, '.dev-state')
const readyFile = path.join(stateDir, 'packages-ready.txt')

// --- 設定値 ---
const PACKAGES_FILTER = './packages/**' // 初回 turbo build の対象
const SIGKILL_GRACE_MS = 3000 // SIGTERM 後に SIGKILL するまでの猶予
const DIST_MTIME = new Date('2000-01-01T00:00:00Z') // reload 誤検知を防ぐため dist に設定する過去日時
const WATCH_DIRS = ['packages', 'apps'] // mtime を揃える探索対象
const VIRTUAL_NET_PREFIXES = ['172.', '100.'] // getLocalIp で除外する Docker/Tailscale 等
// local.env を読み込んで起動するbackend,backend_livekit
const SERVER_APPS = [
  { filter: 'backend', envFile: 'apps/backend/local.env' },
  { filter: 'backend_livekit', envFile: 'apps/backend_livekit/local.env' },
]

const baseOptions = { cwd: root, stdout: 'inherit', stderr: 'inherit' }

// signal は execa に渡さない(親を先に殺すと孫が孤児化して tree-kill が辿れないため)。
const controller = new AbortController()
const children = new Set()
let shuttingDown = false

function loadEnvFile(filePath) {
  if (!existsSync(filePath)) return {}
  const env = {}
  for (const line of readFileSync(filePath, 'utf8').split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq < 0) continue
    env[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim()
  }
  return env
}

// detached で Ctrl+C が子孫へ直接届かないようにし、終了を shutdown に一本化する。
// Windows は detached が新コンソールウィンドウを開くため無効化(終了は tree-kill)。
function startProcess(cmd, args, options = {}) {
  const child = execa(cmd, args, {
    ...baseOptions,
    ...options,
    detached: process.platform !== 'win32',
    windowsHide: true,
  })
  children.add(child)
  child.catch(() => {}) // kill による reject は正常系として無視
  child.nodeChildProcess.once('exit', () => children.delete(child))
  return child
}

// pnpm→turbo→tsc のような孫まで確実に終了するためツリーごと落とす(Win/Unix 両対応)。
function killTree(pid, signal) {
  return new Promise((resolve) => treeKill(pid, signal, () => resolve()))
}

async function shutdown() {
  if (shuttingDown) return
  shuttingDown = true

  const pids = [...children].map((child) => child.pid).filter((pid) => pid !== undefined)

  // 親が生きているうちにツリーを辿って kill する(先に親を殺すと孫が孤児化して辿れない)
  await Promise.all(pids.map((pid) => killTree(pid, 'SIGTERM')))
  await sleep(SIGKILL_GRACE_MS)
  await Promise.all(pids.map((pid) => killTree(pid, 'SIGKILL')))

  try {
    await execa(baseOptions)`docker compose -f ${composeFile} down`
  } catch {}
}

// 終了シグナルと想定外エラーを AbortController に集約し、shutdown を一度だけ実行する
controller.signal.addEventListener(
  'abort',
  () => {
    shutdown().finally(() => process.exit(0))
  },
  { once: true }
)
// SIGHUP: ターミナルを閉じた場合。子は detached で SIGHUP が届かないため、ここで片付けないと孤児として残る
for (const signal of ['SIGINT', 'SIGTERM', 'SIGHUP']) {
  process.once(signal, () => controller.abort())
}
process.on('unhandledRejection', (err) => {
  console.error('[dev] 予期しないエラーで終了します:', err)
  controller.abort()
})

// LAN からアクセスできる IPv4 を取得する(LiveKit のノード IP に使用)。
function getLocalIp() {
  for (const addresses of Object.values(os.networkInterfaces())) {
    for (const iface of addresses ?? []) {
      if (iface.family !== 'IPv4' || iface.internal) continue
      if (VIRTUAL_NET_PREFIXES.some((prefix) => iface.address.startsWith(prefix))) continue
      return iface.address
    }
  }
  return '127.0.0.1'
}

// turbo cache 復元で dist の mtime が現在時刻になり、vite が変更と誤検知して
// 大量 reload するのを防ぐため、mtime を過去へ揃える。
function resetDistMtime(baseDirs) {
  const walk = (dir, insideDist) => {
    let entries
    try {
      entries = readdirSync(dir, { withFileTypes: true })
    } catch {
      return
    }
    for (const entry of entries) {
      if (entry.name === 'node_modules') continue
      const full = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        walk(full, insideDist || entry.name === 'dist')
      } else if (insideDist) {
        try {
          utimesSync(full, DIST_MTIME, DIST_MTIME)
        } catch {}
      }
    }
  }
  for (const base of baseDirs) walk(path.join(root, base), false)
}

// 起動シーケンス。await する処理(docker/build)が失敗したら shutdown で
// 起動済みのコンテナ・子プロセスを片付けてから終了する。
try {
  process.env.LIVEKIT_NODE_IP = getLocalIp()
  console.log(`[dev] Using LIVEKIT_NODE_IP: ${process.env.LIVEKIT_NODE_IP}`)

  // LiveKit: 依存なしで即起動(-d なので即 return)
  await execa(baseOptions)`docker compose -f ${composeFile} up -d`

  // --build か packages-ready.txt が無ければ packages をビルド
  const forceBuild = process.argv.includes('--build')
  if (forceBuild || !existsSync(readyFile)) {
    console.log('[dev] Building packages...')
    await execa(baseOptions)`pnpm turbo run build --filter ${PACKAGES_FILTER}`
    console.log('[dev] Build complete')
    resetDistMtime(WATCH_DIRS)
    mkdirSync(stateDir, { recursive: true })
    writeFileSync(readyFile, `${new Date().toISOString()}\n`)
  } else {
    console.log('[dev] Skipping build (packages already built — run with --build to rebuild)')
  }

  // 全パッケージを1プロセスの tsc -b --watch で監視する。
  // パッケージごとに tsc --watch を立てると、Phaser 等の共通の型定義をプロセスごとに読み込むため
  // 70超のプロセスで十数GBのメモリを使っていた。project references で1プロセスにまとめる
  const solution = await generateDevTsconfigs()
  startProcess('pnpm', ['exec', 'tsc', '--build', '--watch', '--preserveWatchOutput', solution])

  // アセット変更監視
  startProcess(process.execPath, [path.join(__dirname, 'watch-assets.mjs')])

  // server アプリ(それぞれ local.env を読み込む)
  for (const app of SERVER_APPS) {
    startProcess('pnpm', ['--filter', app.filter, 'run', 'dev'], {
      env: loadEnvFile(path.join(root, app.envFile)),
    })
  }

  // フロントエンドは最後(ターミナルでクリックしやすくするため)
  startProcess('pnpm', ['--filter', 'frontend', 'run', 'dev'])
} catch (err) {
  console.error('[dev] 起動に失敗しました:', err.shortMessage ?? err.message ?? err)
  await shutdown()
  process.exit(1)
}
