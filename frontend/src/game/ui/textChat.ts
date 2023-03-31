import 'phaser'
import MainScene from '../scene/main'
import { BaseReceiveInfo, Socket } from '../socket'
import { TabPanel } from './tabPanel'
import { ButtonsManager } from './buttonsManager'
import { layerSetting } from '../layer'
import { OwnPlayer } from '../domain/ownPlayer'

interface EmitChatInfo {
  message: string
}
export class TextChat extends TabPanel {
  mainScene: MainScene
  private inputChatArea?: Phaser.GameObjects.DOMElement
  private static chatContainer: HTMLElement
  private chatBatch!: Phaser.GameObjects.Graphics
  private isFocused: boolean = false

  constructor(mainScene: MainScene) {
    super(mainScene)
    this.mainScene = mainScene
  }

  public loadAssets(): void {
    this.scene.load.html('chatform', 'assets/chatform.html')
    this.scene.load.image('chatbutton', 'assets/chat.png')
  }

  public static scrollToBottom(): void {
    TextChat.chatContainer.scrollTop = TextChat.chatContainer.scrollHeight
  }

  public offBatch(): void {
    if (!this.panelContainer.visible) {
      this.chatBatch.visible = false
    }
  }

  public focusInput(): void {
    document.getElementById('input-chat-form')?.focus()
    this.isFocused = true
  }

  public blurInput(): void {
    document.getElementById('input-chat-form')?.blur()
    this.isFocused = false
  }

  public controlInputFieldFocus(): void {
    const inputChatFieldFocus = document.getElementById('game')
    if (inputChatFieldFocus != null) {
      inputChatFieldFocus.onclick = () => {
        if (this.isFocused) {
          this.blurInput()
        } else {
          this.focusInput()
        }
      }
    }
  }

  public chatBoard(socket: Socket): void {
    this.panelContainer = this.scene.add.container(
      this.scene.scale.gameSize.width - 50 - 50,
      100
    ) // gameSize.width - margin - position
    this.inputChatArea = this.scene.add
      .dom(-300, 10)
      .createFromCache('chatform')
      .setOrigin(0, 0)
      .setScrollFactor(0)

    this.panelContainer.add(this.inputChatArea)
    this.panelContainer.visible = false
    this.panelContainer.setDepth(10)
    const documentChatContainer = document.getElementById('chat-container')
    if (documentChatContainer !== null) {
      TextChat.chatContainer = documentChatContainer
    }
    this.onClickSendChatButton(socket)

    this.scene.scale.on(
      Phaser.Scale.Events.RESIZE,
      (
        gameSize: Phaser.Structs.Size,
        baseSize: Phaser.Structs.Size,
        displaySize: Phaser.Structs.Size,
        previousWidth: number,
        previousHeight: number
      ) => {
        this.panelContainer.setPosition(gameSize.width - 50 - 50, 100)
      }
    )
  }

  public createChatButton(): void {
    const buttonsManager = new ButtonsManager(this.scene)
    this.iconImage = this.scene.add
      .image(this.scene.scale.gameSize.width - 50 - 50, 50, 'chatbutton') // gameSize.width - margin - position
      .setOrigin(1, 0)
      .setScrollFactor(0)
      .setAlpha(0.5)
    this.iconImage.setDisplaySize(40, 40)

    this.chatBatch = this.scene.add.graphics()
    this.chatBatch
      .fillStyle(0xffffff, 0)
      .setScrollFactor(0)
      .fillCircle(1165, 36, 7).visible = false
    layerSetting(this.chatBatch, 'batch')

    this.iconImage
      .setInteractive()
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
        this.offBatch()
        setTimeout(() => {
          this.focusInput()
        }, 15)
        if (this.panelContainer.visible) {
          this.iconImage.setAlpha(0.5)
          this.panelContainer.visible = false
          ButtonsManager.openedPanel = undefined
        } else {
          this.iconImage.setAlpha(1)
          buttonsManager.openPanel(this)
          this.panelContainer.visible = true
          setTimeout(() => {
            TextChat.scrollToBottom()
          }, 10)
        }
      })
    layerSetting(this.iconImage, 'ChatBoard')

    this.scene.scale.on(
      Phaser.Scale.Events.RESIZE,
      (
        gameSize: Phaser.Structs.Size,
        baseSize: Phaser.Structs.Size,
        displaySize: Phaser.Structs.Size,
        previousWidth: number,
        previousHeight: number
      ) => {
        this.iconImage.setPosition(gameSize.width - 50 - 50, 50)
      }
    )
  }

  public static renderChatText(text: string, color: string): void {
    const content = document.createElement('li')
    content.style.fontSize = '12px'
    content.style.listStyle = 'none'
    content.style.padding = '12px 15px'
    content.style.textAlign = 'left'
    content.style.color = color
    TextChat.chatContainer.appendChild(content)
    content.textContent = text
    TextChat.scrollToBottom()
  }

  public sendChat(socket: Socket): void {
    const element = document.getElementById(
      'input-chat-form'
    ) as HTMLInputElement
    const message: EmitChatInfo = { message: element.value }
    if (element.value !== '') {
      socket.allPlayersEmit('chat', message)
      element.value = ''
    }
  }

  public onClickSendChatButton(socket: Socket): void {
    const chatField = this.inputChatArea?.getChildByID('input-chat-form')
    if (chatField !== undefined) {
      this.mainScene.keyboard.addCheckForcusElement(chatField)
    }
    const send = document.getElementById('chat-send-button')
    if (send !== null) {
      send.onclick = () => {
        this.sendChat(socket)
      }
    }
  }

  private static playerViewChat(
    mainScene: MainScene,
    chatInfo: EmitChatInfo & BaseReceiveInfo
  ): void {
    const name = OwnPlayer.allPlayers.get(chatInfo.id)?.playerName
    const message = chatInfo.message
    if (!mainScene.textChat.panelContainer.visible) {
      mainScene.textChat.chatBatch.visible = true
    }
    TextChat.renderChatText(`${name ?? 'name'}:${message}`, '#333333')
  }

  public static socketOn(socket: Socket): void {
    socket.on('chat', TextChat.playerViewChat)
  }
}
