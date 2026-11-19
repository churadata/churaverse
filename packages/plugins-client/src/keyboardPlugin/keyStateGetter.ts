import type { Scene } from 'phaser'
import type { IKeyStateGetter } from './interface/IKeyStateGetter'
import { PhaserKeyCache } from './phaserKeyCache'
import type { KeyCode } from './types/keyCode'

export class KeyStateGetter implements IKeyStateGetter {
  private readonly phaserKeyCache: PhaserKeyCache

  public constructor(scene: Scene) {
    this.phaserKeyCache = new PhaserKeyCache(scene)
  }

  public isJustDown(keyCode: KeyCode): boolean {
    return Phaser.Input.Keyboard.JustDown(this.phaserKeyCache.get(keyCode))
  }

  public isDown(keyCode: KeyCode): boolean {
    return this.phaserKeyCache.get(keyCode).isDown
  }

  public isJustUp(keyCode: KeyCode): boolean {
    return Phaser.Input.Keyboard.JustUp(this.phaserKeyCache.get(keyCode))
  }

  public isUp(keyCode: KeyCode): boolean {
    return this.phaserKeyCache.get(keyCode).isUp
  }
}
