import { Room } from 'livekit-client'

class TitleScene extends Phaser.Scene {
  constructor() {
    super({ key: 'Title', active: false })
  }

  create(): void {
    const gameHeight = this.scale.gameSize.height
    const margin = 10

    this.cameras.main.setBackgroundColor('0xEFEFEF')

    const audioDeviceLabel = this.add.text(margin, margin, 'Microphone: ', {
      color: '0x000000',
    })
    this.getDefaultDevice()
      .then((device) => {
        audioDeviceLabel.setText(`Microphone: ${device.label}`)
      })
      .catch(() => {
        audioDeviceLabel.setText(`Microphone: 取得に失敗しました`)
      })

    const videoDeviceLabel = this.add.text(margin, margin + 18, 'Camera: ', {
      color: '0x000000',
    })
    this.getDefaultVideoDevice()
      .then((device) => {
        videoDeviceLabel.setText(`Camera: ${device.label}`)
      })
      .catch(() => {
        videoDeviceLabel.setText(`Camera: 取得に失敗しました`)
      })

    const frontendVersionLabel = this.add
      .text(margin, gameHeight - margin - 36, 'Frontend Version: ', {
        color: '0x000000',
      })
      .setOrigin(0, 1)
    if (import.meta.env.VITE_FRONT_VERSION == null) {
      frontendVersionLabel.setText(
        'Frontend Version: Versionの取得ができませんでした。'
      )
    } else {
      frontendVersionLabel.setText(
        `Frontend Version: ${import.meta.env.VITE_FRONT_VERSION}`
      )
    }
    this.scale.on(Phaser.Scale.Events.RESIZE, () => {
      frontendVersionLabel.setPosition(
        margin,
        this.scale.gameSize.height - margin - 36
      )
    })

    const backendVersionLabel = this.add
      .text(margin, gameHeight - margin - 18, 'Backend Version: ', {
        color: '0x000000',
      })
      .setOrigin(0, 1)
    fetch(import.meta.env.VITE_BACKEND_URL.replace(/\/$/, '') + '/version')
      .then((response) => {
        response
          .text()
          .then((text) =>
            backendVersionLabel.setText(`Backend Version: ${text}`)
          )
          .catch(() => {
            backendVersionLabel.setText(
              'Backend Version: Versionの取得ができませんでした。'
            )
          })
      })
      .catch(() => {
        backendVersionLabel.setText(
          'Backend Version: Versionの取得ができませんでした。'
        )
      })
    this.scale.on(Phaser.Scale.Events.RESIZE, () => {
      backendVersionLabel.setPosition(
        margin,
        this.scale.gameSize.height - margin - 18
      )
    })

    const deployVersionLabel = this.add
      .text(margin, gameHeight - margin, 'Deploy Version: ', {
        color: '0x000000',
      })
      .setOrigin(0, 1)
    if (import.meta.env.VITE_DEPLOY_VERSION == null) {
      deployVersionLabel.setText(
        'Deploy Version: Versionの取得ができませんでした。'
      )
    } else {
      deployVersionLabel.setText(
        `Deploy Version: ${import.meta.env.VITE_DEPLOY_VERSION}`
      )
    }
    this.scale.on(Phaser.Scale.Events.RESIZE, () => {
      deployVersionLabel.setPosition(
        margin,
        this.scale.gameSize.height - margin
      )
    })

    const { width, height } = this.scale.gameSize
    const joinButtom = this.add
      .text(width / 2, (height / 3) * 2, 'Join')
      .setOrigin(0.5)
      .setPadding(40, 20)
      .setStyle({ backgroundColor: '#1292e2', align: 'center' })
      .setInteractive({ useHandCursor: true })
      .on('pointerover', () =>
        joinButtom.setStyle({ backgroundColor: '#64bbf2' })
      )
      .on('pointerout', () =>
        joinButtom.setStyle({ backgroundColor: '#1292e2' })
      )
      .on('pointerdown', () => {
        joinButtom.disableInteractive() // 処理が重複しないように処理中はボタンを押せないようにロック
        this.scene.start('Main')
      })

    this.scale.on(Phaser.Scale.Events.RESIZE, () => {
      const { width, height } = this.scale.gameSize
      joinButtom.setPosition(width / 2, (height / 3) * 2)
    })
  }

  private async getDefaultDevice(): Promise<MediaDeviceInfo> {
    const devices = await Room.getLocalDevices('audioinput', true)
    return devices[0]
  }

  private async getDefaultVideoDevice(): Promise<MediaDeviceInfo> {
    const devices = await Room.getLocalDevices('videoinput', true)
    return devices[0]
  }
}

export default TitleScene
