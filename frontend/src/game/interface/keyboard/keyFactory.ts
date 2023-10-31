import { Scene } from 'phaser'
import { IKey } from '../../adapter/controller/keyboard/IKey'
import { KeyCode } from '../../domain/model/core/types'
import { Key } from './key'
import { IKeyFactory } from '../../adapter/controller/keyboard/IKeyFactory'

export class KeyFactory implements IKeyFactory {
  public constructor(private readonly scene: Scene) {}
  public createKey(keyCode: KeyCode, callback: () => void, durationMs: number): IKey {
    return new Key(this.scene, keyCode, callback, durationMs)
  }
}
