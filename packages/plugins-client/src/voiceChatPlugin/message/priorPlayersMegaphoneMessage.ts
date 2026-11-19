import { BaseMessage, type SendableObject } from '@churaverse/network-plugin-client'
import type { IMainScene } from 'churaverse-engine-client'

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

declare module '@churaverse/network-plugin-client' {
  export interface MainMessageMap {
    priorPlayersMegaphoneData: PriorPlayersMegaphoneMessage
  }
}
