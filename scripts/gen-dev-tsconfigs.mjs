#!/usr/bin/env node
// dev 用に、全パッケージを1プロセスの `tsc -b --watch` で監視するための tsconfig を .dev-state/tsc/ に生成する。
// 各パッケージの tsconfig.json を extends し、composite と package.json の workspace 依存から導いた
// references を足すだけなので、パッケージ側の tsconfig は変更しない。
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { execa } from 'execa'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const outDir = path.join(root, '.dev-state', 'tsc')

function writeConfig(file, config) {
  const content = `${JSON.stringify(config, null, 2)}\n`
  // 同じ内容の設定を更新すると、tsbuildinfo が残っていても再ビルドの対象になる。
  if (existsSync(file) && readFileSync(file, 'utf8') === content) return
  writeFileSync(file, content)
}

function typeRootsOf(dir) {
  const roots = []
  for (let d = dir; d.startsWith(root); d = path.dirname(d)) {
    const typesDir = path.join(d, 'node_modules', '@types')
    if (existsSync(typesDir)) roots.push(typesDir)
    if (d === root) break
  }
  return roots
}

export async function generateDevTsconfigs() {
  const { stdout } = await execa('pnpm', ['-r', 'ls', '--depth', '-1', '--json'], { cwd: root })
  const dirs = JSON.parse(stdout)
    .map((p) => p.path)
    .sort()

  // `tsc --watch` を dev に持つパッケージ(= これまで turbo で個別に watch していたもの)が対象
  const packages = new Map()
  for (const dir of dirs) {
    const pkg = JSON.parse(readFileSync(path.join(dir, 'package.json'), 'utf8'))
    if (!pkg.scripts?.dev?.startsWith('tsc --watch')) continue
    packages.set(pkg.name, {
      dir,
      pkg,
      file: path.join(outDir, `${pkg.name.replace(/^@/, '').replace(/\//g, '__')}.json`),
    })
  }

  // 設定と tsbuildinfo を維持し、削除されたパッケージの設定だけ取り除く。
  mkdirSync(outDir, { recursive: true })
  const currentFiles = new Set(['tsconfig.json', ...[...packages.values()].map(({ file }) => path.basename(file))])
  for (const name of readdirSync(outDir)) {
    if (name.endsWith('.json') && !currentFiles.has(name)) {
      rmSync(path.join(outDir, name))
      rmSync(path.join(outDir, name.replace(/\.json$/, '.tsbuildinfo')), { force: true })
    }
  }

  for (const { dir, pkg, file } of packages.values()) {
    const deps = { ...pkg.dependencies, ...pkg.devDependencies, ...pkg.peerDependencies }
    const references = Object.keys(deps)
      .filter((name) => packages.has(name) && name !== pkg.name)
      .sort()
      .map((name) => ({ path: path.relative(outDir, packages.get(name).file) }))
    const rel = (p) => path.relative(outDir, path.join(dir, p))
    const config = {
      extends: rel('tsconfig.json'),
      compilerOptions: {
        composite: true,
        // dist 内に置くと turbo の build キャッシュ復元で古いものに戻り、最新と誤判定されるため .dev-state に置く
        tsBuildInfoFile: path.relative(outDir, file.replace(/\.json$/, '.tsbuildinfo')),
        // 生成先(.dev-state/tsc)ではなくパッケージの位置から @types を探させる(tsc の既定の探索と同じ)
        typeRoots: typeRootsOf(dir).map((p) => path.relative(outDir, p)),
      },
      // composite はプロジェクト内の全ファイルが include に含まれている必要がある。
      // .ts だけを include し .tsx を import 経由で取り込んでいるパッケージがあるため .tsx も含める
      include: [rel('**/*.ts'), rel('**/*.tsx')],
      exclude: [rel('dist'), rel('node_modules')],
      references,
      // git checkout 等でファイルが作り直される(inodeが変わる)と、ファイル単位の fs.watch では
      // 以降の変更を検知できなくなるため、親ディレクトリを監視させる
      watchOptions: { watchFile: 'useFsEventsOnParentDirectory' },
    }
    writeConfig(file, config)
  }

  const solution = path.join(outDir, 'tsconfig.json')
  const refs = [...packages.values()].map(({ file }) => ({ path: path.relative(outDir, file) }))
  writeConfig(solution, { files: [], references: refs })
  return solution
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  console.log(await generateDevTsconfigs())
}
