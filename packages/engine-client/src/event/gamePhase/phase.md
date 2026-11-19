```mermaid
  flowchart TD
  subgraph PhaserSceneInitialization
  phaserSceneInit --> phaserScenePreload
  phaserScenePreload --> phaserLoadAssets
  phaserLoadAssets --> phaserSceneCreate
  end

  phaserSceneCreate --> init

  subgraph Initialization
  init --> start
  end

  start --> update

  subgraph GameLoop
  update --> update
  end

  subgraph Decommissioning
  update --> onGameShutdown
  end
```
