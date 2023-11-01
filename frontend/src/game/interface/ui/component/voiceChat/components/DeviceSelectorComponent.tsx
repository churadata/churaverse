import { Device } from '../../../../../domain/model/localDevice/device'
import { JSXFunc } from '../../../util/domManager'
import style from './DeviceSelectorComponent.module.scss'

interface Props {
  selectorId: string
  devices: Device[]
}

export const DeviceSelectorComponent: JSXFunc<Props> = ({ selectorId, devices }: Props) => {
  return (
    <select className={style.deviceSelector} id={selectorId}>
      {devices.map((device) => {
        return (
          <option key={device.id} value={device.id}>
            {device.name}
          </option>
        )
      })}
    </select>
  )
}
