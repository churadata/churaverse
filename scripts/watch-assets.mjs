#!/usr/bin/env node
/**
 * Watches asset files across all client packages and copies changes to their dist/.
 * Run from the repo root.
 */
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync } from 'node:fs'
import path, { dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import chokidar from 'chokidar'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(__dirname, '..')

const ASSET_PATTERN = /\.(scss|css|png|jpg|jpeg|gif|svg|webp|ico)$/
const SKIP_DIRS = new Set(['dist', 'node_modules', '.git'])

// Each entry: { srcRoot, distRoot }
const watchTargets = []

function collectTargets(pkgDir, srcSubDir = '') {
  const srcRoot = srcSubDir ? join(pkgDir, srcSubDir) : pkgDir
  const distRoot = join(pkgDir, 'dist')
  if (existsSync(srcRoot)) watchTargets.push({ srcRoot, distRoot })
}

// engine-client: src/ → dist/
collectTargets(join(repoRoot, 'packages/engine-client'), 'src')

// plugins-client: 入れ子のプラグインも、それぞれの package.json を境界として扱う。
function collectPlugins(dir) {
  if (existsSync(join(dir, 'package.json'))) {
    const pkg = JSON.parse(readFileSync(join(dir, 'package.json'), 'utf8'))
    if (pkg.scripts?.build?.includes('build-assets.mjs')) collectTargets(dir)
    return
  }
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory() && !SKIP_DIRS.has(entry.name)) collectPlugins(join(dir, entry.name))
  }
}

const pluginsDir = join(repoRoot, 'packages/plugins-client/src')
if (existsSync(pluginsDir)) collectPlugins(pluginsDir)

function handleFile(srcPath, removed = false) {
  if (!ASSET_PATTERN.test(srcPath)) return
  const target = watchTargets.find((t) => srcPath.startsWith(t.srcRoot + path.sep) || srcPath === t.srcRoot)
  if (!target) return
  const rel = relative(target.srcRoot, srcPath)
  if (rel.startsWith('..')) return
  const dest = join(target.distRoot, rel)
  try {
    if (removed) {
      rmSync(dest, { force: true })
    } else {
      mkdirSync(dirname(dest), { recursive: true })
      copyFileSync(srcPath, dest)
    }
    process.stdout.write(`[watch-assets] ${relative(repoRoot, srcPath)} → ${relative(repoRoot, dest)}\n`)
  } catch (e) {
    process.stderr.write(`[watch-assets] error: ${e.message}\n`)
  }
}

const watchPaths = watchTargets.map((t) => t.srcRoot)

chokidar
  .watch(watchPaths, {
    // 出力ディレクトリは探索前に除外し、TS/JSなどアセット以外のファイルも監視しない。
    // stats がない呼び出しではディレクトリの可能性があるため、拡張子で除外しない。
    ignored: (file, stats) =>
      /[/\\](dist|node_modules|\.git)([/\\]|$)/.test(file) || (stats?.isFile() && !ASSET_PATTERN.test(file)),
    ignoreInitial: false,
    persistent: true,
  })
  .on('add', (file) => handleFile(file))
  .on('change', (file) => handleFile(file))
  .on('unlink', (file) => handleFile(file, true))

console.log(`[watch-assets] watching ${watchTargets.length} packages`)
