import type { ISettingDialog } from '@churaverse/core-ui-plugin-client'
import type { IDataPersistence } from '@churaverse/data-persistence-plugin-client'
import { DomManager, type IEventBus, type IMainScene, type JSXFunc } from 'churaverse-engine-client'
import type { Device } from '../../domain/localDevice/device'
import { SwitchLocalDeviceEvent } from '../../event/switchLocalDeviceEvent'
import type { IBaseLocalDeviceManager } from '../../interface/ILocalDeviceManager/IBaseLocalDeviceManager'

/**
 * 前回選択したデバイスのidを保存するキー
 */
export interface WebRtcPluginKeyNameMap {
  microphoneId: string
  speakerId: string
  cameraId: string
}

declare module '@churaverse/data-persistence-plugin-client' {
  export interface PersistentDataMap {
    webRtc: WebRtcPluginKeyNameMap
  }
}

export class DeviceSelector<DeviceType extends Device> {
  private readonly selectTag: HTMLSelectElement

  public constructor(
    private readonly eventBus: IEventBus<IMainScene>,
    private readonly deviceManager: IBaseLocalDeviceManager<DeviceType>,
    private readonly dataPersistence: IDataPersistence,
    private readonly persistenceKey: keyof WebRtcPluginKeyNameMap,
    settingDialog: ISettingDialog,
    devices: DeviceType[],
    selectTagId: string,
    component: JSXFunc<{ devices: DeviceType[] }>
  ) {
    const content = DomManager.jsxToDom(component({ devices }))
    settingDialog.addContent('peripheralSetting', content)

    this.selectTag = DomManager.getElementById<HTMLSelectElement>(selectTagId)
    this.selectTag.addEventListener('change', () => {
      this.onSelect()
    })
  }

  /**
   * デバイスを選択した際に実行するメソッド
   */
  private onSelect(): void {
    this.deviceManager
      .getDevices()
      .then((devices) => {
        devices.forEach((device) => {
          if (device.id === this.selectTag.value) {
            this.eventBus.post(new SwitchLocalDeviceEvent(device))
            this.deviceManager.switchDevice(device)
            this.dataPersistence.add('webRtc', this.persistenceKey, device.id)
          }
        })
      })
      .catch(() => {
        console.error('デバイスを取得できませんでした')
      })
  }

  public updateLocalDevices(devices: DeviceType[]): void {
    this.setOptions(devices)

    // 前回選択したデバイスが接続されていればそれを、なければ先頭(OSの既定デバイス)を選択する
    const savedDeviceId = this.dataPersistence.get('webRtc', this.persistenceKey)
    const target = devices.find((device) => device.id === savedDeviceId) ?? devices[0]
    if (target === undefined) return

    for (const option of this.selectTag.options) {
      if (option.value === target.id) {
        option.selected = true
        this.deviceManager.switchDevice(target)
        return
      }
    }
  }

  /**
   * セレクトタグに選択肢を定義する
   */
  private setOptions(devices: DeviceType[]): void {
    // 既にある選択肢を全て削除
    while (this.selectTag.firstChild != null) {
      this.selectTag.removeChild(this.selectTag.firstChild)
    }

    for (const device of devices) {
      this.addOption(device)
    }
  }

  /**
   * セレクトタグに選択肢を追加する
   */
  private addOption(device: DeviceType): void {
    const option = document.createElement('option')
    option.value = device.id
    option.textContent = device.name

    const noDeviceMsg = '利用可能なデバイスを取得できません'
    if (option.textContent === '') {
      option.textContent = noDeviceMsg
    }

    this.selectTag.appendChild(option)
  }
}
