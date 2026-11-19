#!/usr/bin/env node
/**
 * Copies data/*.json into dist/data/.
 * Run from the package root.
 */
import { copyFileSync, mkdirSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const destDir = join(process.cwd(), 'dist', 'data')
mkdirSync(destDir, { recursive: true })

for (const file of readdirSync('data').filter((f) => f.endsWith('.json'))) {
  copyFileSync(join('data', file), join(destDir, file))
}

console.log('data files copied')
