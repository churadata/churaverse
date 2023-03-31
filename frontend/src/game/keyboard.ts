import { Scene } from 'phaser'

export type SceneName = 'Title' | 'Main'

export type KeyCode = keyof typeof Phaser.Input.Keyboard.KeyCodes

export class Keyboard {
  private readonly scene: Scene

  private readonly keys: Map<KeyCode, Phaser.Input.Keyboard.Key>
  protected holdFrames: Map<KeyCode, number>

  private readonly addedKeyCodes: KeyCode[]

  private readonly checkForcusElements: Element[] = []

  // isTextInputting とかにしたい
  public inputtingText = false // 文字を入力している場合false. チャット中にプレイヤーを操作させない場合などに使用

  constructor(scene: Scene, sceneName: SceneName) {
    this.scene = scene
    this.addedKeyCodes = [] // 追加したキーのリスト
    this.keys = new Map<KeyCode, Phaser.Input.Keyboard.Key>()
    this.holdFrames = new Map<KeyCode, number>()
    this.init(sceneName)
  }

  public init(sceneName: SceneName): void {
    // sceneがどのclassかで判別しません?
    switch (sceneName) {
      case 'Title':
        break
      case 'Main':
        this.initInMainScene()
        break
      default:
    }
  }

  public addCheckForcusElement(el: Element): void {
    this.checkForcusElements.push(el)

    el.addEventListener('focus', () => {
      this.inputtingText = true
    })
    el.addEventListener('blur', () => {
      this.inputtingText = false
    })
  }

  public key(keyCode: KeyCode): Phaser.Input.Keyboard.Key | undefined {
    return this.keys.get(keyCode)
  }

  public holdFrame(keyCode: KeyCode): number {
    return this.holdFrames.get(keyCode) ?? 0
  }

  public isDown(keyCode: KeyCode): boolean {
    return this.keys.get(keyCode)?.isDown ?? false
  }

  public isJustDown(keyCode: KeyCode): boolean {
    const key = this.keys.get(keyCode)
    if (key == null) {
      return false
    }
    return Phaser.Input.Keyboard.JustDown(key)
  }

  public isUp(keyCode: KeyCode): boolean {
    return this.keys.get(keyCode)?.isUp ?? false
  }

  public isJustUp(keyCode: KeyCode): boolean {
    const key = this.keys.get(keyCode)
    if (key == null) {
      return false
    }
    return Phaser.Input.Keyboard.JustUp(key)
  }

  public resetHold(keyCode: KeyCode): void {
    this.holdFrames.set(keyCode, 0)
  }

  public holdCheck(): void {
    for (const keycode of this.addedKeyCodes) {
      if (this.isDown(keycode) !== undefined) {
        this.holdFrames.set(keycode, (this.holdFrames.get(keycode) ?? 0) + 1)
      } else {
        this.resetHold(keycode)
      }
    }
  }

  private addKey(keyCode: KeyCode): void {
    this.keys.set(
      keyCode,
      this.scene.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes[keyCode],
        false
      )
    )
    this.holdFrames.set(keyCode, 0)
    this.addedKeyCodes.push(keyCode)
  }

  private addCursorKeys(): void {
    const cursorKeys: KeyCode[] = ['UP', 'DOWN', 'LEFT', 'RIGHT']

    for (const k of cursorKeys) {
      this.addKey(k)
    }
  }

  // MainScene中で使用するキーを定義する
  private initInMainScene(): void {
    this.addCursorKeys()
    this.addKey('V')
    this.addKey('X')
    this.addKey('Z')
    this.addKey('ENTER')
  }
}
