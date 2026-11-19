#!/bin/bash
# =============================================================
# CIランナー上(Dockerの外)でモノレポ全体を1回だけビルドし、
# 各アプリのDockerイメージに必要な成果物を .deploy/<app> にまとめるスクリプト。
#
# 既存の各Dockerfile(builderステージ)が個別に行っていた
# turbo prune → pnpm install → turbo run build → pnpm deploy --prod
# の流れを、ここに一本化する。
#
# 実行後、.deploy/frontend, .deploy/backend, .deploy/backend_livekit
# のそれぞれが、対応するDockerfileのproductionステージが
# COPYするだけで完結する形に仕上がる。
# =============================================================
set -e

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

DEPLOY_DIR="${ROOT_DIR}/.deploy"
CONCURRENCY="${TURBO_BUILD_CONCURRENCY:-2}"

echo "🧹 過去の .deploy を削除..."
rm -rf "$DEPLOY_DIR"
mkdir -p "$DEPLOY_DIR"

echo "📦 pnpm install (モノレポ全体, frozen-lockfile)..."
pnpm install --frozen-lockfile

# 前回の成果物で今回のビルド失敗を隠さない。キャッシュヒット時はTurboが復元する。
rm -rf "${ROOT_DIR}/apps/frontend/dist"

echo "🔨 turbo run build (concurrency=${CONCURRENCY})..."
pnpm turbo run build --concurrency="${CONCURRENCY}"

echo "📁 frontend: dist をそのままコピー"
# frontendのエントリーポイントが生成されていることを確認する。
# 子プロセスの終了コードが握りつぶされても、壊れた成果物でイメージを作らないようここで止める
if [ ! -f "${ROOT_DIR}/apps/frontend/dist/index.html" ]; then
  echo "❌ apps/frontend/dist/index.html がありません。frontend のビルドが失敗しています" >&2
  exit 1
fi
mkdir -p "${DEPLOY_DIR}/frontend"
cp -r "${ROOT_DIR}/apps/frontend/dist" "${DEPLOY_DIR}/frontend/dist"

echo "📁 backend: pnpm deploy --prod + dist"
pnpm --filter=./apps/backend deploy --prod --legacy "${DEPLOY_DIR}/backend"
# pnpm deploy --legacy はパッケージディレクトリを丸ごとコピーするため、
# Dockerfile/webpack設定/.envなど実行に不要なファイルも混入する。
# node_modules と package.json 以外を一旦削除してから、ビルド済みdistだけを配置し直す
# (cp -r をそのまま使うと、既にdistが存在する場合にネストしてしまう懸念があるため)
find "${DEPLOY_DIR}/backend" -mindepth 1 -maxdepth 1 \
  ! -name node_modules ! -name package.json -exec rm -rf {} +
cp -r "${ROOT_DIR}/apps/backend/dist" "${DEPLOY_DIR}/backend/dist"

echo "📁 backend_livekit: pnpm deploy --prod + lib"
pnpm --filter=./apps/backend_livekit deploy --prod --legacy "${DEPLOY_DIR}/backend_livekit"
find "${DEPLOY_DIR}/backend_livekit" -mindepth 1 -maxdepth 1 \
  ! -name node_modules ! -name package.json -exec rm -rf {} +
cp -r "${ROOT_DIR}/apps/backend_livekit/lib" "${DEPLOY_DIR}/backend_livekit/lib"

echo ""
echo "✅ 完了。成果物は以下に生成されました:"
echo "   ${DEPLOY_DIR}/frontend/dist"
echo "   ${DEPLOY_DIR}/backend/       (node_modules + package.json + dist/)"
echo "   ${DEPLOY_DIR}/backend_livekit/ (node_modules + package.json + lib/)"