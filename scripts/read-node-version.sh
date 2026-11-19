#!/bin/bash
# =============================================================
# .mise.toml の [tools] セクションから node のバージョンを読み取り、
# 標準出力に1行で出力する。
#
# build_images.sh(Dockerイメージへのbuild-arg用)と、
# ローカルのDockerビルドなど、Node.jsバージョンを揃える処理で使用する
# の両方から、共通のロジックとして呼び出される。
#
# 使い方:
#   NODE_VERSION=$(./scripts/read-node-version.sh)
# =============================================================
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
MISE_CONFIG="${REPO_ROOT}/.mise.toml"

NODE_VERSION=$(awk '
    /^\[tools\][[:space:]]*$/ { in_tools = 1; next }
    /^\[/ { in_tools = 0 }
    in_tools && $1 == "node" {
        version = $3
        gsub(/["[:space:]]/, "", version)
        print version
        exit
    }
' "$MISE_CONFIG")

if [[ ! "$NODE_VERSION" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
    echo "Error: Could not read a valid Node.js version from ${MISE_CONFIG}" >&2
    exit 1
fi

echo "$NODE_VERSION"
