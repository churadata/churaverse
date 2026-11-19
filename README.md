# ちゅらバース / Churaverse

ブラウザでアバターを動かし、会話やゲームを楽しめる2Dメタバースです。
Hugkun＆ちゅらデータのインターン学生チームが開発しています。

## できること

- 同じマップに集まり、アバターを動かして交流する
- テキストチャットや、距離に応じて音量が変わるボイスチャットで会話する
- カメラ映像や画面を共有する
- ミニゲームで遊ぶ

クライアントはPhaser・React・Vite、ゲームサーバーはExpress・Socket.IOを使用しています。
音声・映像の通信にはLiveKitを使い、各機能はプラグインとして実装しています。

## ローカルで動かす

### 必要なもの

- Git
- [mise](https://mise.jdx.dev/getting-started.html)
- DockerとDocker Compose
- ブラウザ（音声・映像の確認にはマイクやカメラ）

Node.jsのバージョンは[.mise.toml](.mise.toml)、pnpmのバージョンは[package.json](package.json)の`packageManager`で管理しています。
以下では[mise exec](https://mise.jdx.dev/cli/exec.html)を使い、指定されたNode.jsでコマンドを実行します。

### セットアップ

```bash
git clone https://github.com/churadata/churaverse.git
cd churaverse

mise trust
mise install
mise exec -- corepack enable
mise exec -- pnpm install --frozen-lockfile
```

Dockerを起動してから、リポジトリのルートで実行します。

```bash
mise exec -- pnpm dev
```

初回は共通パッケージをビルドした後、フロントエンド・ゲームサーバー・トークン発行APIを起動します。
LiveKitはDocker Composeで起動し、ソースやアセットの変更も自動で監視します。

起動後、ブラウザで<http://localhost:3000>を開いてください。
別のブラウザかシークレットウィンドウでも開くと、複数プレイヤーの動作を確認できます。
音声や映像を使うときは、ブラウザでマイク・カメラの利用を許可してください。

停止する場合はターミナルでCtrl+Cを押します。アプリとLiveKitの終了処理が実行されます。

### ローカルの設定とポート

同梱の設定で起動できます。最初に実環境の認証情報を用意する必要はありません。

| 設定ファイル | 用途 |
| --- | --- |
| [apps/frontend/.env](apps/frontend/.env) | Vite経由のAPI・LiveKit接続先とログレベル |
| [apps/backend_livekit/local.env](apps/backend_livekit/local.env) | トークン発行APIのLiveKit接続用キーと許可するOrigin |
| [apps/livekit/livekit.local.yaml](apps/livekit/livekit.local.yaml) | ローカルのLiveKitサーバー設定 |

LiveKitの`devkey` / `secret`はローカル開発用のサンプル値です。実環境の認証情報はコミットしないでください。

| サービス | ポート |
| --- | --- |
| フロントエンド | `3000` |
| ゲームサーバー | `12100` |
| トークン発行API | `12150` |
| LiveKit | `7880`・`7881`（TCP）、`7882`（UDP） |

`pnpm dev`は起動前に`3000`・`12100`・`12150`・`9229`・`9230`を使用するプロセスを停止します。
同じポートで別のアプリを動かしている場合は、起動前に確認してください。

### 起動で困ったとき

- **Dockerへの接続に失敗する場合**：Dockerを起動し、`docker info`が成功することを確認してから起動し直してください。
- **パッケージの変更が反映されない場合**：開発サーバーを止め、`mise exec -- pnpm dev --build`で初回のパッケージビルドを再実行してください。
- **終了後もLiveKitが残っている場合**：`docker compose -f docker-compose.dev.yml down`で停止できます。

## リポジトリの構成

pnpm workspaceとTurborepoでアプリ・エンジン・プラグインを管理しています。

| パス | 役割 |
| --- | --- |
| [apps/frontend](apps/frontend) | ブラウザクライアント |
| [apps/backend](apps/backend) | ゲームサーバー |
| [apps/backend_livekit](apps/backend_livekit) | LiveKitのアクセストークンを発行するAPI |
| `packages/engine-*` | クライアント・サーバーの共通エンジン |
| `packages/plugins-*` | ゲーム・チャット・UIなどのプラグイン |
| [packages/shared-types-client](packages/shared-types-client) | クライアント共通の型 |
| [scripts](scripts) | ローカル開発・ビルド用のツール |

プラグインの有効化は[クライアント設定](apps/frontend/src/defineConfig.ts)と[サーバー設定](apps/backend/src/defineConfig.ts)で行います。
個々の機能については、[クライアント側](packages/plugins-client/src)・[サーバー側](packages/plugins-server/src)の各プラグインにあるREADMEを参照してください。

## 開発時のチェック

リポジトリのルートで、次の順に実行してください。
型チェックと依存境界チェックはworkspace内のビルド成果物を参照するため、先にbuildを実行します。

```bash
mise exec -- pnpm exec biome check .
mise exec -- pnpm exec turbo run build --concurrency=4
mise exec -- pnpm exec turbo run typecheck --concurrency=4
mise exec -- pnpm exec turbo run check-arch --concurrency=4
mise exec -- pnpm check-arch:plugins
```

miseをシェルで有効にしている場合は、`mise exec --`を省略できます。
Dockerイメージ用の成果物は`mise exec -- bash scripts/build-for-deploy.sh`で用意します。

## 開発への参加

不具合や改善案は[Issues](https://github.com/churadata/churaverse/issues)へお願いします。
不具合報告には、再現手順・期待する動作・実際の動作を記載してください。

PRには変更の目的と確認した内容を記載し、上記のチェックと変更した機能の動作確認を行ってください。
現在、このリポジトリのCI/CDとイメージ公開は準備中です。チェックはローカルで実行してください。

## ライセンス

[MIT License](LICENSE)
