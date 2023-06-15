import { Device } from './device'

export class Speaker implements Device {
  public constructor(public readonly name: string, public readonly id: string) {}
}
