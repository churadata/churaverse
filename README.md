# ちゅらバース

## このプロジェクトについて

Hugkun＆ちゅらデータのインターン学生チームが、メタバースプロジェクトをR&Dした成果物

### サービス構成

| サービス | 概要 |
| --- | --- |
| Frontend | ユーザー向けクライアント。Phaser3を使用。 |
| Backend | マルチプレイヤーを実現するためのバックエンドサーバー。 express.js, socket.ioを使用。 |
| Backend Livekit | LiveKit Server へアクセスするためのアクセストークンを発行する用のAPIサーバー。express.jsを使用。 |
| [Livekit](https://livekit.io/) | WebRTC サーバー |
| [Nginx](https://www.nginx.com/) | リバースプロキシ用 |
| [Certbot](https://certbot.eff.org/) | SSL/TSL証明書を取得するためのツール |

## local環境での動作方法について

### 起動

この階層でdocker-compose実行

```bash
docker-compose up -d
```

### 動作確認

ブラウザで `http://localhost:8080` を確認

ブラウザでこのWebアプリを２つ立ち上げて、
片方でキャラを立ち上げたらもう片方で(触らないでも)
キャラが動いてくれるとOK

#### Q. ブラウザを2つ立ち上げてもどうも同じ画面が出力されている。(例：アプリを2つ立ち上げているにもかかわらず、キャラを動かしても一人しかいない)

A. 同じスレッドにアクセスしている可能性があります。シークレットモードで立ち上げると解消される可能性があります。

#### Q. 起動後に `http://localhost:8080` にアクセスしてもアプリケーションが表示されない

A. 特に初回起動時は少し立ち上がりに時間がかかるのでしばらく待ちましょう。
待てないあなたは `dockeer compose logs` を確認し、frontのログが流れてくるのを見ましょう
