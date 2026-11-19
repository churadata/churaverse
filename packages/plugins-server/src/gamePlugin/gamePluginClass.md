# gamePluginのクラス図

一般的なUML図の表記に基づいている。

```mermaid
classDiagram
    BasePlugin <|-- BaseGamePlugin : extend
    BaseGamePlugin <|-- CoreGamePlugin : extend
    IGameInfo <|.. CoreGamePlugin : implement
    CoreGamePlugin *-- GameHostingManager : composite
    IGameHostingManager <|.. GameHostingManager : implement

    class BasePlugin {
        <<abstract>>
        #store: Store<Scene>
        #bus: IEventBus<Scene>

        listenEvent() void *
    }

    class IGameInfo {
        <<interface>>
        gameId: GameIds
        isActive: boolean
        ownerId: string | undefined
        joinedPlayerIds: string[]
        gameState: GameState
        gamePolicy: GamePolicy
    }

    class BaseGamePlugin {
        <<abstract>>
        gameId: GameIds *

        #isActive() boolean
        #subscribeGameEvent() void
        #unsubscribeGameEvent() void
        handleGameStart() void *
        handleGameTermination() void *
    }

    class CoreGamePlugin {
        <<abstract>>
        gameId: GameIds *
        gamePolicy: GamePolicy *
        -gameHostingManager: IGameHostingManager

        #subscribeGameEvent() void
        #unsubscribeGameEvent() void
        handlePlayerLeave(playerId: string) void *
        handlePlayerQuitGame(playerId: string) void *
    }

    class GameHostingManager {
        - allPlayers Set~string~
        - joinedPlayers Set~string~
        - respondedPlayers Set~string~
    }

    class IGameHostingManager {
        <<interface>>

        +set(playerId: string, willJoin: boolean) void
        +getJoinedPlayerIds() string[]
        +isAllPlayerResponse() boolean
        +timeoutResponse() void
    }
```


## 表記について
|表記|意味|
|---|---|
|*斜体*|抽象関数 or 抽象プロパティ|
|+|public|
|-|private|
|#|protected|
