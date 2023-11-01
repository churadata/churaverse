export interface IJoinLeaveLogRender {
  join: (id: string, name: string) => void
  leave: (id: string, name: string) => void
}
