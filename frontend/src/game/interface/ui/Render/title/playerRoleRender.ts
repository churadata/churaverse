import { GameObjects, Scene } from 'phaser'
import { createUIContainer } from '../../util/container'
import { IPlayerRoleRender } from '../../../../domain/IRender/IPlayerRoleRender'
import { PlayerRoleName } from '../../../../domain/model/types'

export class PlayerRoleRender implements IPlayerRoleRender {
  private readonly container: GameObjects.Container
  public constructor(scene: Scene, playerRole: PlayerRoleName) {
    const adminLabel = scene.add.text(0, 0, 'your role: admin', {
      color: '0x000000',
    })
    adminLabel.setOrigin(1, 0)
    this.container = createUIContainer(scene, 1, 0, -10, 10)
    this.container.add(adminLabel)
    if (playerRole === 'admin') {
      this.appear()
    } else {
      this.disappear()
    }
  }

  public static async build(scene: Scene, playerRole: PlayerRoleName): Promise<PlayerRoleRender> {
    return await new Promise<PlayerRoleRender>((resolve) => {
      resolve(new PlayerRoleRender(scene, playerRole))
    })
  }

  // タイトル画面右上にadminを表示
  public appear(): void {
    this.container.setVisible(true)
  }

  // タイトル画面右上のadmin表示を隠す
  public disappear(): void {
    this.container.setVisible(false)
  }
}
