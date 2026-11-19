const assert = require('node:assert/strict')
const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')
const vm = require('node:vm')
const { spawnSync } = require('node:child_process')
const { test } = require('node:test')

const root = path.resolve(__dirname, '../..')
const frontend = path.join(root, 'apps/frontend')
const wrapper = fs.readFileSync(path.join(frontend, 'versionUpdate.cjs'), 'utf8')

// OOM時にspawnSyncが返すstatus:null / signal:SIGABRTを再現する。
for (const [name, result, expected] of [
  ['success', { status: 0 }, 0],
  ['build failure', { status: 7 }, 7],
  ['OOM abort', { status: null, signal: 'SIGABRT' }, 1],
  ['OS kill', { status: null, signal: 'SIGKILL' }, 1],
  ['spawn error', { status: null, error: new Error('spawn failed') }, 1],
  ['dev Ctrl+C', { status: null, signal: 'SIGINT' }, 0],
]) {
  test(`wrapper exit: ${name}`, () => {
    const exited = Symbol('exit')
    let exitCode
    assert.throws(
      () =>
        vm.runInNewContext(wrapper, {
          __dirname: frontend,
          require: (id) =>
            id === 'node:child_process'
              ? { spawnSync: () => result }
              : id === './package.json'
                ? { version: '0.1.0' }
                : require(id),
          process: {
            env: {},
            argv: ['node', 'versionUpdate.cjs', 'vite', ...(name === 'dev Ctrl+C' ? [] : ['build'])],
            on: () => {},
            exit: (code) => {
              exitCode = code
              throw exited
            },
          },
        }),
      (err) => err === exited
    )
    assert.equal(exitCode, expected)
  })
}

test('deploy stops when Turbo succeeds without producing frontend output, even with stale dist', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'frontend-build-exit-'))
  try {
    for (const name of ['scripts', 'bin', 'apps/frontend/dist']) fs.mkdirSync(path.join(dir, name), { recursive: true })
    fs.copyFileSync(path.join(root, 'scripts/build-for-deploy.sh'), path.join(dir, 'scripts/build-for-deploy.sh'))
    fs.writeFileSync(path.join(dir, 'apps/frontend/dist/index.html'), 'stale output')
    fs.writeFileSync(path.join(dir, 'bin/pnpm'), '#!/bin/sh\necho "$*" >> "$BUILD_TEST_CALLS"\nexit 0\n', {
      mode: 0o755,
    })
    const result = spawnSync('bash', ['scripts/build-for-deploy.sh'], {
      cwd: dir,
      encoding: 'utf8',
      env: { ...process.env, PATH: `${dir}/bin:${process.env.PATH}`, BUILD_TEST_CALLS: `${dir}/calls` },
    })
    assert.equal(result.status, 1)
    assert.match(result.stderr, /frontend.*index\.html/)
    assert.equal(fs.existsSync(path.join(dir, '.deploy/frontend')), false)
    assert.doesNotMatch(fs.readFileSync(path.join(dir, 'calls'), 'utf8'), /deploy --prod/)
  } finally {
    fs.rmSync(dir, { recursive: true, force: true })
  }
})
