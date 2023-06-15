import { DeathLog } from '../model/deathLog'

export interface IDeathLogRender {
  add: (deathLog: DeathLog) => void
}

export type DamageCause = 'shark' | 'bomb'

export type DamageMessages = {
  [key in DamageCause]: string
}
