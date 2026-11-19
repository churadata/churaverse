import type { SendableObject } from '@churaverse/network-plugin-client'
import { BaseMessage } from '@churaverse/network-plugin-client'
import type { IMainScene } from 'churaverse-engine-client'

export interface UseHealingPotionData extends SendableObject {
  playerId: string
  healAmount: number
}

export class UseHealingPotionMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: UseHealingPotionData) {
    super('useHealingPotion', data)
  }
}

declare module '@churaverse/network-plugin-client' {
  export interface MainMessageMap {
    useHealingPotion: UseHealingPotionMessage
  }
}
