#!/usr/bin/env node
/**
 * Copies non-TypeScript source files (scss, css, png, etc.) into dist/.
 * Mirrors the source directory structure under dist/.
 *
 * Options:
 *   --src <dir>  Source root relative to cwd (default: ".")
 *
 * Run from the package root:
 *   node <repo>/scripts/build-assets.mjs
 *   node <repo>/scripts/build-assets.mjs --src src
 */
import { copyFileSync, mkdirSync, readdirSync } from 'node:fs'
import { dirname, join, relative } from 'node:path'

const ASSET_EXTS = new Set(['.scss', '.css', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.ico'])
const SKIP_DIRS = new Set(['dist', 'node_modules', '.git'])
const SKIP_FILES = new Set(['package.json', 'tsconfig.json'])

const args = process.argv.slice(2)
const srcIdx = args.indexOf('--src')
const srcDir = srcIdx >= 0 ? args[srcIdx + 1] : '.'

const srcRoot = join(process.cwd(), srcDir)
const distRoot = join(process.cwd(), 'dist')

function copyAssets(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.has(entry.name)) copyAssets(join(dir, entry.name))
      continue
    }
    if (!entry.isFile()) continue
    if (SKIP_FILES.has(entry.name)) continue
    const dot = entry.name.lastIndexOf('.')
    if (dot < 0 || !ASSET_EXTS.has(entry.name.slice(dot))) continue

    const srcPath = join(dir, entry.name)
    const destPath = join(distRoot, relative(srcRoot, srcPath))
    mkdirSync(dirname(destPath), { recursive: true })
    copyFileSync(srcPath, destPath)
  }
}

copyAssets(srcRoot)
console.log('[build-assets] done')
