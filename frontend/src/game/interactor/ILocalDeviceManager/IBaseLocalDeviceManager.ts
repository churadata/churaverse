import { Device } from '../../domain/model/localDevice/device'

/**
 * 周辺機器を管理するためのinterface
 * 周辺機器の種類はDeviceTypeで表される
 */
export interface IBaseLocalDeviceManager<DeviceType extends Device> {
  /**
   * 現在アクティブになっている機器
   * アクティブになっている機器が存在しない場合はnull
   */
  current: DeviceType | null

  /**
   * 接続されている機器一覧を取得する
   * @returns
   */
  getDevices: () => Promise<DeviceType[]>

  /**
   * アクティブな機器を切り替える
   * @param target 切り替え先の機器
   */
  switchDevice: (target: DeviceType) => void
}
