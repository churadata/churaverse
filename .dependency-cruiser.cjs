const fs = require('node:fs')
const path = require('node:path')

/**
 * dependency-cruiser は import 文字列ではなく、解決後のファイルパスに対して path を照合する。
 * パッケージ名での import(例: `@churaverse/bomb-plugin-client`)は dist/index.js に解決される。
 * 一方 deep import(例: `@churaverse/bomb-plugin-client/store/x`)は、dependency-cruiser の解決では
 * package.json の exports を見ないため、ソースの .ts に解決される。その違いを下のルールで検出する。
 * (TypeScript / Vite / Node は exports を見るので、deep import はそもそも解決エラーになる。二重の防御)
 * from のキャプチャを to に流用できないため、プラグインごとのルールをディレクトリ構成から動的に生成している。
 */
// package.json を持つディレクトリを再帰的に探し、src からの相対パスをプラグインルートとして返す。
// churarenPlugin/churarenCorePlugin のように、ディレクトリの下に個別の workspace がネストしているため
// src 直下だけを見ると、それらが1つのプラグインとして扱われ相互の deep import を検出できない
function pluginRoots(side) {
  const base = path.join(__dirname, 'packages', `plugins-${side}`, 'src')
  const roots = []
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (!entry.isDirectory() || entry.name === 'node_modules' || entry.name === 'dist') continue
      const full = path.join(dir, entry.name)
      if (fs.existsSync(path.join(full, 'package.json')))
        roots.push(path.relative(base, full).split(path.sep).join('/'))
      else walk(full)
    }
  }
  walk(base)
  return roots
}

function crossPluginBoundaryRules(side) {
  return pluginRoots(side).map((name) => ({
    name: `plugin-boundary-${side}-${name}`,
    severity: 'error',
    comment: `${name} の内部ファイルを直接 import している。他プラグインからは index.ts(パッケージ名)経由で参照すること`,
    from: { path: `(?<=^|/)packages/plugins-${side}/src/(?!${name}/)` },
    // パッケージ名での import は dist/index.js に解決され(dist は除外)、ここには現れない。
    // 他プラグインのソースファイルへの依存はすべて deep import なので違反とする
    // .scss は barrel 化の対象外とし、各プラグインの package.json の exports で個別に公開する
    to: { path: `(?<=^|/)packages/plugins-${side}/src/${name}/`, pathNot: '\\.scss$' },
  }))
}

module.exports = {
  forbidden: [
    // --- engine-server: leaf layers must never import outward ---
    {
      name: 'engine-server-domain-is-leaf',
      severity: 'error',
      comment:
        'domain/error/utilTypes are the innermost layer: plain models and generic types with zero dependency on event/eventbus/scene/store/plugins.',
      from: { path: '(?<=^|/)packages/engine-server/src/(domain|error|utilTypes)/' },
      to: { path: '(?<=^|/)packages/engine-server/src/(event|eventbus|scene|store|plugins)/' },
    },
    {
      name: 'engine-server-event-store-no-runtime-deps',
      severity: 'error',
      comment:
        'event/eventbus/store only depend on scene type contracts and domain; they must not depend on the plugin loader or any concrete plugin.',
      from: { path: '(?<=^|/)packages/engine-server/src/(event|eventbus|store)/' },
      to: { path: '(?<=^|/)packages/engine-server/src/plugins/|(?<=^|/)packages/plugins-(client|server)/src/' },
    },
    {
      name: 'engine-server-plugin-core-is-generic',
      severity: 'error',
      comment:
        'plugins/core is the plugin *mechanism* (BasePlugin, loader); it must stay generic and never depend on a concrete feature plugin.',
      from: { path: '(?<=^|/)packages/engine-server/src/plugins/core/' },
      to: { path: '(?<=^|/)packages/plugins-(client|server)/src/' },
    },

    // --- engine-client: mirrors engine-server, plus rendering leaves ---
    {
      name: 'engine-client-domain-is-leaf',
      severity: 'error',
      comment:
        'domain/error/utilTypes are the innermost layer and must not depend on event/eventbus/scene/store/plugins/ui/renderer/animation.',
      from: { path: '(?<=^|/)packages/engine-client/src/(domain|error|utilTypes)/' },
      to: { path: '(?<=^|/)packages/engine-client/src/(event|eventbus|scene|store|plugins|ui|renderer|animation)/' },
    },
    {
      name: 'engine-client-event-store-no-runtime-deps',
      severity: 'error',
      comment:
        'event/eventbus/store only depend on scene type contracts and domain; they must not depend on the plugin loader, rendering leaves, or any concrete plugin.',
      from: { path: '(?<=^|/)packages/engine-client/src/(event|eventbus|store)/' },
      to: {
        path: '(?<=^|/)packages/engine-client/src/(plugins|ui|renderer|animation)/|(?<=^|/)packages/plugins-(client|server)/src/',
      },
    },
    {
      name: 'engine-client-plugin-core-is-generic',
      severity: 'error',
      comment:
        'plugins/core is the plugin *mechanism*; it must stay generic and never depend on a concrete feature plugin.',
      from: { path: '(?<=^|/)packages/engine-client/src/plugins/core/' },
      to: { path: '(?<=^|/)packages/plugins-(client|server)/src/' },
    },
    {
      name: 'engine-client-render-leaves-are-independent',
      severity: 'error',
      comment:
        'ui/renderer/animation are leaf rendering utilities pulled in by plugins; they must not depend on the engine domain/event/eventbus/store graph.',
      from: { path: '(?<=^|/)packages/engine-client/src/(ui|renderer|animation)/' },
      to: { path: '(?<=^|/)packages/engine-client/src/(domain|event|eventbus|store|plugins)/' },
    },

    // --- composition roots: only talk to public package barrels ---
    {
      name: 'backend-composition-root-uses-barrels-only',
      severity: 'error',
      comment:
        'apps/backend is a thin DI/composition root: it must import churaverse-engine-server and @churaverse/*-plugin-server top-level files only (index.ts barrel, or a deliberate sibling entry point like titlePlayerPlugin.ts), never a file nested in one of their internal subfolders (domain/, store/, ...).',
      from: { path: '(?<=^|/)apps/backend/src/' },
      to: { path: '(?<=^|/)packages/(engine-server|plugins-server/src/[^/]+)/[^/]+/.+' },
    },
    {
      name: 'frontend-composition-root-uses-barrels-only',
      severity: 'error',
      comment:
        'apps/frontend composition (App.tsx, defineConfig.ts) must import churaverse-engine-client and @churaverse/*-plugin-client top-level files only, never a file nested in one of their internal subfolders. src/game/** is legacy/dead code and is excluded (see options.exclude).',
      from: { path: '(?<=^|/)apps/frontend/src/(App|defineConfig)\\.tsx?$' },
      to: { path: '(?<=^|/)packages/(engine-client|plugins-client/src/[^/]+)/[^/]+/.+' },
    },

    // --- cross-plugin boundary: 他プラグインへはbarrel(index.ts)経由でのみ依存する ---
    ...crossPluginBoundaryRules('client'),
    ...crossPluginBoundaryRules('server'),
  ],
  options: {
    doNotFollow: {
      path: 'node_modules',
    },
    // src/game/** is dead legacy code (see CV-888 investigation). dist/** is build output
    // that would otherwise duplicate every rule violation already visible in its .ts source.
    exclude: '((?<=^|/)apps/frontend/src/game/|(?<=^|/)dist/)',
    tsPreCompilationDeps: true,
    reporterOptions: {
      dot: {
        collapsePattern: '^(packages/plugins-(client|server)/src/[^/]+|packages/[^/]+|apps/[^/]+)',
      },
    },
  },
}
