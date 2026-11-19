import { CVEvent, type IMainScene } from 'churaverse-engine-client'
import type { DataDumper } from '../debugScreen/dataDumper'

export class DumpDebugDataEvent extends CVEvent<IMainScene> {
  public constructor(public readonly dataDumper: DataDumper) {
    super('dumpDebugData', true)
  }
}

declare module 'churaverse-engine-client' {
  export interface CVMainEventMap {
    dumpDebugData: DumpDebugDataEvent
  }
}
