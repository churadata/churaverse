import type { KeyboardPluginStore } from '@churaverse/keyboard-plugin-client'
import { createUIContainer, type IEventBus, type ITitleScene, type Store } from 'churaverse-engine-client'
import type { GameObjects, Scene } from 'phaser'
import type { TitlePlayerPluginStore } from '../../titlePlayerPlugin/store/defTitlePlayerPlugin'
import churaDataLogoImage from '../assets/churaDataLogo.png'
import { TitlePlayerRoleChangeEvent } from '../event/titlePlayerRoleChangeEvent'

const CHURADATA_LOGO_IMAGE_KEY = 'churaData-logo-image'

/**
 * ちゅらデータのロゴを表示する
 */
export class ChuraDataLogoRenderer {
  private readonly container: GameObjects.Container
  private readonly image: Phaser.GameObjects.Image
  private readonly titlePlayerPluginStore: TitlePlayerPluginStore
  private readonly keyboardPluginStore: KeyboardPluginStore<ITitleScene>

  public constructor(
    scene: Scene,
    store: Store<ITitleScene>,
    private readonly eventbus: IEventBus<ITitleScene>
  ) {
    this.titlePlayerPluginStore = store.of('titlePlayerPlugin')
    this.keyboardPluginStore = store.of('keyboardPlugin')
    this.keyboardPluginStore.keyStateGetter.isDown('SPACE')
    this.keyboardPluginStore.keyStateGetter.isDown('SHIFT')

    this.image = scene.add
      .image(-45, -35, CHURADATA_LOGO_IMAGE_KEY)
      .setDisplaySize(70, 70)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
        this.onClick()
      })
    this.container = createUIContainer(scene, 1, 1)
    this.container.add(this.image)
  }

  public static loadAssets(scene: Scene): void {
    scene.load.image(CHURADATA_LOGO_IMAGE_KEY, churaDataLogoImage)
  }

  /** クリックした時の動作 */
  private onClick(): void {
    // spaceKeyが押されているか判定
    const isSpaceKeyDown = this.keyboardPluginStore.keyStateGetter.isDown('SPACE')
    // shiftKeyが押されているか判定
    const isShiftKeyDown = this.keyboardPluginStore.keyStateGetter.isDown('SHIFT')

    if (isSpaceKeyDown && isShiftKeyDown) {
      const playerRoleChangeEvent = new TitlePlayerRoleChangeEvent(this.titlePlayerPluginStore.ownPlayer.role)
      this.eventbus.post(playerRoleChangeEvent)
    }
  }
}
