import { BaseMessage, type SendableObject } from '@churaverse/network-plugin-server'
import type { IMainScene } from 'churaverse-engine-server'

export interface ExistPlayersMegaphone {
  [id: string]: boolean
}

/**
 * サーバーから返される各Playerのメガホン情報の初期化データ
 */
export interface PriorPlayersMegaphoneData extends SendableObject {
  existPlayersMegaphone: ExistPlayersMegaphone
}

export class PriorPlayersMegaphoneMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: PriorPlayersMegaphoneData) {
    super('priorPlayersMegaphoneData', data)
  }
}

declare module '@churaverse/network-plugin-server' {
  export interface MainMessageMap {
    priorPlayersMegaphoneData: PriorPlayersMegaphoneMessage
  }
}
