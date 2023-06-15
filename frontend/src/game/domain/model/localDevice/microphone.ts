import { Device } from './device'

export class Microphone implements Device {
  public constructor(public readonly name: string, public readonly id: string) {}
}
