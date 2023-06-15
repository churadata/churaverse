import { Device } from './device'

export class Camera implements Device {
  public constructor(public readonly name: string, public readonly id: string) {}
}
