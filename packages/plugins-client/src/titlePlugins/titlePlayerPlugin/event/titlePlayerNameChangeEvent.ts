import { CVEvent, type ITitleScene } from 'churaverse-engine-client'

export class TitlePlayerNameChangeEvent extends CVEvent<ITitleScene> {
  public constructor(public readonly name: string) {
    super('titlePlayerNameChange', true)
  }
}

declare module 'churaverse-engine-client' {
  export interface CVTitleEventMap {
    titlePlayerNameChange: TitlePlayerNameChangeEvent
  }
}
