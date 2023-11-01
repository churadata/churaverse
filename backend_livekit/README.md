# Backend LiveKit

LiveKit Server へアクセスするためのアクセストークンを発行する用のAPIサーバーです。

## 準備

`.env.example` ファイル を元に `.env` ファイルを作成してください

## API

### GetAccessToken

指定したクエリパラメータを元にアクセストークンを発行し返します。

#### リクエスト

```
GET http://localhost:12150/
```

##### パラメータ

| パラメータ | 型 | 説明 |
| :--- | :--- | :--- |
| roomName | string | 参加したいルーム名 |
| userName | string | ルーム内で一意の名前 |


#### レスポンス

```
{
    "token": "access_token"
}
```

##### プロパティ

| プロパティ | 型 | 説明 |
| :--- | :--- | :--- |
| token | string | 発行されたトークン |