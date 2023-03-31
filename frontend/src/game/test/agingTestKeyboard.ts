import { Keyboard, KeyCode, SceneName } from '../keyboard'
import { WalkAnimState, WalkAnimStateAry } from '../domain/player'

const WeaponAry = ['shark', 'bomb', ''] as const
type Weapon = typeof WeaponAry[number]

export class AgingTestKeyboard extends Keyboard {
  private moveState: WalkAnimState = ''
  private weapon: Weapon = ''

  constructor(scene: any, sceneName: SceneName) {
    super(scene, sceneName)

    this.initAgingTest()
  }

  public isDown(keyCode: KeyCode): boolean {
    return this.isDownAgingTestMode(keyCode)
  }

  public holdCheck(): void {
    this.holdCheckAgingTestMode()
  }

  private initAgingTest(): void {
    setInterval(() => {
      this.updateMoveState()
    }, 1000)

    setInterval(() => {
      this.updateWeapon()
    }, 1000)
  }

  private updateMoveState(): void {
    this.moveState =
      WalkAnimStateAry[Math.floor(Math.random() * WalkAnimStateAry.length)]
  }

  private updateWeapon(): void {
    this.weapon = WeaponAry[Math.floor(Math.random() * WeaponAry.length)]
  }

  private isDownAgingTestMode(keyCode: KeyCode): boolean {
    const moveKeyDict: { [key: string]: string } = {
      UP: 'walk_back',
      DOWN: 'walk_front',
      LEFT: 'walk_left',
      RIGHT: 'walk_right',
    }

    const weaponKeyDict: { [key: string]: string } = {
      X: 'shark',
      Z: 'bomb',
    }
    if (
      moveKeyDict[keyCode] === this.moveState ||
      weaponKeyDict[keyCode] === this.weapon
    ) {
      return true
    } else {
      return false
    }
  }

  private holdCheckAgingTestMode(): void {
    const moveKeys = ['UP', 'DOWN', 'RIGHT', 'LEFT', '']
    const moveDict: { [state in WalkAnimState]: string } = {
      walk_back: 'UP',
      walk_front: 'DOWN',
      walk_left: 'LEFT',
      walk_right: 'RIGHT',
      '': '',
    }

    if (this.moveState === '') {
      for (const moveKey of moveKeys) {
        this.resetHold(moveKey as KeyCode)
      }
    } else {
      for (const state of Object.keys(moveDict)) {
        const keycode = moveDict[state as WalkAnimState]
        if (this.moveState === state) {
          this.holdFrames.set(
            keycode as KeyCode,
            (this.holdFrames.get(keycode as KeyCode) ?? 0) + 1
          )
        } else {
          this.resetHold(keycode as KeyCode)
        }
      }
    }

    const weaponKeys = ['X', 'Z', '']
    const weaponDict: { [state in Weapon]: string } = {
      shark: 'X',
      bomb: 'Z',
      '': '',
    }

    if (this.weapon === '') {
      for (const weaponKey of weaponKeys) {
        this.resetHold(weaponKey as KeyCode)
      }
    } else {
      for (const state of Object.keys(weaponDict)) {
        const keycode = weaponDict[state as Weapon]
        if (this.weapon === state) {
          this.holdFrames.set(
            keycode as KeyCode,
            (this.holdFrames.get(keycode as KeyCode) ?? -1) + 1
          )
        } else {
          this.resetHold(keycode as KeyCode)
        }
      }
    }
  }
}
