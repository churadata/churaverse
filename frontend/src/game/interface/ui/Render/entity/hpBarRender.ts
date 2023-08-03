import { Scene } from 'phaser'

/**
 * PlayerRenderのcontainerからHPバーの相対座標
 */
const _relativePositionToHpBar = { x: 0, y: -27 }

export class HpBarRender {
  private readonly container: Phaser.GameObjects.Container
  private hpBar: Phaser.GameObjects.Graphics

  private constructor(
    private readonly scene: Scene,
    private readonly maxValue: number,
    hp: number,
    width: number,
    height: number,
    origin: { x: number; y: number }
  ) {
    this.container = scene.add.container(_relativePositionToHpBar.x, _relativePositionToHpBar.y)
    this.hpBar = this.makeBar(origin.x * -width, origin.y * -height, width, height)

    this.container.add(this.hpBar)
  }

  private makeBar(x: number, y: number, width: number, height: number, color = 0x00ff00): Phaser.GameObjects.Graphics {
    const bar = this.scene.add.graphics()
    const background = this.scene.add.graphics()

    // 背景の描画
    const backgroundColor = 0x000000 // 背景の色（黒色）
    const backgroundAlpha = 1 // 背景の透明度
    background.fillStyle(backgroundColor, backgroundAlpha)
    background.fillRect(0, 0, width, height)
    background.x = x
    background.y = y
    // 枠線の描画
    const borderColor = 0x000000 // 枠線の色
    const borderWidth = 2 // 枠線の太さ
    background.lineStyle(borderWidth, borderColor)
    background.strokeRect(0, 0, width, height)
    this.container.add(background)

    bar.fillStyle(color, 1)

    // x=0で伸び縮みした時に左端の位置を固定
    bar.fillRect(0, 0, width, height)

    bar.x = x
    bar.y = y

    return bar
  }

  public static async build(
    scene: Scene,
    maxValue: number,
    currentHp: number,
    width: number = 38,
    height: number = 6,
    origin = { x: 0.5, y: 0.5 }
  ): Promise<HpBarRender> {
    return await new Promise<HpBarRender>((resolve) => {
      resolve(new HpBarRender(scene, maxValue, currentHp, width, height, origin))
    })
  }

  /**
   * 受け取ったコンテナにHPバーをaddする
   */
  public addContainer(container: Phaser.GameObjects.Container): void {
    container.add(this.container)
  }

  public update(hp: number): void {
    const scaleX = hp / this.maxValue
    this.hpBar.scaleX = scaleX
  }

  /**
   * 姿を現す関数
   */
  public appear(): void {
    this.container.setVisible(true)
  }

  /**
   * 姿を消す関数
   */
  public disappear(): void {
    this.container.setVisible(false)
  }

  /**
   * hpcontainerを消滅させる関数
   */
  public destroy(): void {
    this.hpBar.destroy()
  }
}
