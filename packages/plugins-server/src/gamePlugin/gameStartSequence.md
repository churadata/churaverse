# ゲーム開始時のシーケンス図

以下のシーケンス図は、ゲームが開始される際のクライアントとサーバー間の通信フローを示している。

```mermaid
sequenceDiagram
    client ->>+ server: RequestGameHostMessage
    Note over client, server: ゲームのホストをサーバに通知

    server ->> server: GameHostEvent
    Note over server,server: サーバでイベントを発火

    server -->>- client: ResponseGameHostMessage
    Note over server,client: 全てのプレイヤーにゲームのホストを通知

    client ->> server: ResponseParticipationMessage
    Note over client, server: 各プレイヤーの参加可否をサーバに通知

    server ->> client: GameStartMessage
    Note over client, server: タイムアウトするか、<br> 全プレイヤーからの回答<br>があればゲームが開始する
```

# ゲーム中断時のシーケンス図

以下のシーケンス図は、ゲームが中断される際のクライアントとサーバー間の通信フローを示している。

```mermaid
sequenceDiagram
    client ->>+ server: RequestGameAbortMessage
    Note over client, server: ゲームの中断をサーバに通知

    server ->> server: GameAbortEvent
    Note over server,server: サーバでイベントを発火

    server -->>- client: ResponseGameAbortMessage
    Note over server,client: 全てのプレイヤーにゲームの中断を通知

    client ->> client: GameAbortEvent
    Note over client, client: ゲームが中断される
```

# ゲーム途中退室時のシーケンス図

以下のシーケンス図は、ゲーム途中退室時の2パターンの通信フローを示している。

### ちゅらバースから退室した場合

```mermaid
sequenceDiagram
    client ->> client: EntityDespawnEvent
    Note over client, client: 画面の移動などによるプレイヤーの退室イベントを発火

    client ->>+ server: PlayerLeaveMessage
    Note over client, server: ゲームからの離脱をサーバに通知

    server -->>- client: PlayerLeaveMessage
    Note over server, client: プレイヤーの離脱をすべてのプレイヤーに通知

    server ->> server: EntityDespawnEvent
    Note over server,server: サーバでイベントを発火
```

### ミニゲームから退室した場合
`gamePlayerQuitEvent`は、プレイヤー側で結果表示ウィンドウを閉じる操作が行われたことを通知するためのイベントである。

現在このイベントは、最終結果ウィンドウを閉じたプレイヤーをゲームから退室したと見なすために使用されている。

そのため、ミニゲームからの途中退室の他のクライアントへの通知等の処理は未対応である。


```mermaid
sequenceDiagram
    client ->> client: gamePlayerQuitEvent
    Note over client, client: 　プレイヤーの退室イベントを発火

    client ->> server: GamePlayerQuitMessage
    Note over client, server: ゲームからの離脱をサーバに通知

    server ->> server: gamePlayerQuitEvent
    Note over server,server: サーバでイベントを発火
```
