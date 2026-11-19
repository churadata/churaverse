```mermaid
  flowchart TD

  subgraph Initialization
  init --> start
  end

  start --> update

  subgraph GameLoop
  update --> update
  end
```
