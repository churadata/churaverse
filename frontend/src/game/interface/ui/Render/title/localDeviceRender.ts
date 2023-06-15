import { GameObjects, Scene } from 'phaser'
import { createUIContainer } from '../../util/container'
import { ILocalDevice } from '../../../../interactor/ILocalDeviceManager/ILocalDevice'

/**
 * 接続されているマイク・カメラの名前を表示する. Titleで表示される
 */
export class LocalDeviceRender {
  private readonly container: GameObjects.Container
  public constructor(scene: Scene, localDevice: ILocalDevice) {
    const x = 10
    const audioLabelY = 10
    const videoLabelY = 28

    // 接続されているマイクの名前を表示
    const audioDeviceLabel = scene.add.text(x, audioLabelY, 'Microphone: ', {
      color: '0x000000',
    })
    if (localDevice.microphoneManager.current !== null) {
      audioDeviceLabel.setText(`Microphone: ${localDevice.microphoneManager.current.name}`)
    } else {
      audioDeviceLabel.setText('Microphone: 取得に失敗しました')
    }

    // 接続されているカメラの名前を表示
    const videoDeviceLabel = scene.add.text(x, videoLabelY, 'Camera: ', {
      color: '0x000000',
    })
    if (localDevice.cameraManager.current !== null) {
      videoDeviceLabel.setText(`Camera: ${localDevice.cameraManager.current.name}`)
    } else {
      videoDeviceLabel.setText('Camera: 取得に失敗しました')
    }

    this.container = createUIContainer(scene, 0, 0)
    this.container.add(audioDeviceLabel)
    this.container.add(videoDeviceLabel)
  }

  // 書き方統一のためbuild実装
  public static async build(scene: Scene, localDevice: ILocalDevice): Promise<LocalDeviceRender> {
    return await new Promise<LocalDeviceRender>((resolve) => {
      resolve(new LocalDeviceRender(scene, localDevice))
    })
  }
}
