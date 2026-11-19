import type { SendableObject } from '@churaverse/network-plugin-server'
import { BaseMessage } from '@churaverse/network-plugin-server'
import type { IMainScene } from 'churaverse-engine-server'

export interface UseHealingPotionData extends SendableObject {
  playerId: string
  healAmount: number
}

export class UseHealingPotionMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: UseHealingPotionData) {
    super('useHealingPotion', data)
  }
}

declare module '@churaverse/network-plugin-server' {
  export interface MainMessageMap {
    useHealingPotion: UseHealingPotionMessage
  }
}
