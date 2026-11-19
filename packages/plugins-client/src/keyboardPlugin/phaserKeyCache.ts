import type { Scene } from 'phaser'
import type { KeyCode } from './types/keyCode'

export class PhaserKeyCache {
  private readonly cache = new Map<KeyCode, Phaser.Input.Keyboard.Key>()

  public constructor(private readonly scene: Scene) {}

  public get(keyCode: KeyCode): Phaser.Input.Keyboard.Key {
    let phaserKey = this.cache.get(keyCode)

    if (phaserKey === undefined) {
      phaserKey = this.scene.input.keyboard?.addKey(keyCode, false)
      this.cache.set(keyCode, phaserKey!)
    }

    return phaserKey!
  }
}
