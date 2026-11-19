#!/bin/sh
set -e

# SERVER_DOMAIN 環境変数が設定されている場合、ビルド済みファイル内の placeholder を置換
if [ -n "$SERVER_DOMAIN" ]; then
  echo "Replacing __SERVER_DOMAIN__ with $SERVER_DOMAIN..."
  find /usr/src/app/dist -type f \( -name "*.js" -o -name "*.html" \) -exec sed -i "s/__SERVER_DOMAIN__/$SERVER_DOMAIN/g" {} +
fi

# LiveKit を専用サブドメインで公開する構成のため、SERVER_DOMAIN とは独立して差し替える
if [ -z "$LIVEKIT_URL" ] && [ -n "$SERVER_DOMAIN" ]; then
  LIVEKIT_URL="wss://${SERVER_DOMAIN}/livekit"
fi

if [ -n "$LIVEKIT_URL" ]; then
  echo "Replacing __LIVEKIT_URL__ with $LIVEKIT_URL..."
  find /usr/src/app/dist -type f \( -name "*.js" -o -name "*.html" \) -exec sed -i "s#__LIVEKIT_URL__#$LIVEKIT_URL#g" {} +
fi

# 元のコマンドを実行
exec "$@"
