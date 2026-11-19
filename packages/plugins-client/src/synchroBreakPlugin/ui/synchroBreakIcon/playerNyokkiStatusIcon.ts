import type { IPlayerRenderer } from '@churaverse/player-plugin-client'
import type { Scene } from 'phaser'
import MISS_PATH from '../../assets/nyokkiOrderIcons/miss.png'
import RANK_NUMBER_PATH from '../../assets/nyokkiOrderIcons/rank_number.png'
import RANK1_PATH from '../../assets/nyokkiOrderIcons/rank1.png'
import RANK2_PATH from '../../assets/nyokkiOrderIcons/rank2.png'
import RANK3_PATH from '../../assets/nyokkiOrderIcons/rank3.png'
import RANK_FRAME_PATH from '../../assets/nyokkiOrderIcons/rankFrame.png'
import { UnsupportedNyokkiStatusError } from '../../errors/unsupportedNyokkiStatusError'
import type { NyokkiStatus } from '../../type/nyokkiStatus'

const rankPaths = [RANK1_PATH, RANK2_PATH, RANK3_PATH]
const TEXTURE_RANK_FRAME = 'rank_frame'
const TEXTURE_SUCCESS = 'success'
const TEXTURE_MISS = 'miss'
const TEXTURE_RANK_NUMBER = 'rank_number'

export class PlayerNyokkiStatusIcon {
  private readonly successIconActive: Phaser.GameObjects.Image
  private readonly successRankFrame: Phaser.GameObjects.Image
  private readonly nyokkiIconActive: Phaser.GameObjects.Image

  public constructor(scene: Scene, playerRenderer: IPlayerRenderer) {
    const iconPosX = 0
    const iconPosY = -88
    const iconSizeX = 35
    const iconSizeY = 35
    const missSizeX = 50
    const missSizeY = 30

    this.successRankFrame = scene.add
      .image(iconPosX, iconPosY, TEXTURE_RANK_FRAME)
      .setDisplaySize(iconSizeX, iconSizeY)
      .setAlpha(0)
      .setDepth(1) // 背景の深度を1に設定

    this.successIconActive = scene.add
      .image(iconPosX, iconPosY, TEXTURE_SUCCESS)
      .setDisplaySize(iconSizeX, iconSizeY)
      .setAlpha(0)
      .setDepth(2) // 順位画像の深度を2に設定

    this.nyokkiIconActive = scene.add
      .image(iconPosX, iconPosY, TEXTURE_MISS)
      .setDisplaySize(missSizeX, missSizeY)
      .setAlpha(0)
      .setDepth(3) // 順位画像の深度を3に設定

    this.init(playerRenderer)
  }

  private init(playerRenderer: IPlayerRenderer): void {
    playerRenderer.addToPlayerFrontContainer(this.successRankFrame)
    playerRenderer.addToPlayerFrontContainer(this.successIconActive)
    playerRenderer.addToPlayerFrontContainer(this.nyokkiIconActive)
  }

  public static loadAssets(scene: Scene): void {
    scene.load.image(TEXTURE_RANK_FRAME, RANK_FRAME_PATH)
    scene.load.image(TEXTURE_MISS, MISS_PATH)

    for (let order = 1; order <= 3; order++) {
      const rankKey = `rank${order}`
      const rankPath = rankPaths[order - 1]
      scene.load.image(rankKey, rankPath)
    }

    scene.load.spritesheet(TEXTURE_RANK_NUMBER, RANK_NUMBER_PATH, {
      frameWidth: 16,
      frameHeight: 24,
    })
  }

  /**
   * プレイヤーのニョッキステータスアイコンを表示する
   * @param order ニョッキした順位
   * @param status ニョッキの状態
   */
  public handlePlayerSynchroBreakIcons(order: number, status: NyokkiStatus): void {
    // 10位以上の場合は結果を表示しない
    if (order >= 10) return

    // ステータスごとの表示処理
    switch (status) {
      case 'nyokki':
        this.displayMissIcon()
        break
      case 'success':
        this.displaySuccessIcon(order)
        break
      case 'yet':
        this.resetStatusIcon()
        break
      default:
        throw new UnsupportedNyokkiStatusError(status)
    }
  }

  /**
   * ニョッキ失敗アイコンを表示
   */
  private displayMissIcon(): void {
    this.nyokkiIconActive.setTexture(TEXTURE_MISS)
    this.nyokkiIconActive.setAlpha(1)
  }

  /**
   * nyokki成功のアイコンを表示
   */
  private displaySuccessIcon(order: number): void {
    // 1位~3位は専用アイコンを表示
    if (order <= 3) {
      const iconKey = `rank${order}`
      this.successIconActive.setTexture(iconKey)
      this.successIconActive.setAlpha(1)
    }

    // 4位~9位は枠と数字を表示
    if (order >= 4 && order < 10) {
      this.successRankFrame.setTexture(TEXTURE_RANK_FRAME)
      this.successRankFrame.setAlpha(1)

      this.successIconActive.setTexture(TEXTURE_RANK_NUMBER)
      this.successIconActive.setFrame(order)
      this.successIconActive.setAlpha(1)
    }
  }

  public resetStatusIcon(): void {
    this.successIconActive.setAlpha(0)
    this.successRankFrame.setAlpha(0)
    this.nyokkiIconActive.setAlpha(0)
  }
}
