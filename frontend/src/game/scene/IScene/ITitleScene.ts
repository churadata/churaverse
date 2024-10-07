import { EventBus } from '../../eventbus/eventBus'
import { Store } from '../../plugins/store/store'
import { Scenes } from '../types'
import { BaseScene } from './baseScene'

export abstract class ITitleScene extends BaseScene {
  protected readonly store = new Store<ITitleScene>()
  protected readonly eventBus = new EventBus<Scenes>()

  public constructor() {
    super('TitleScene', {
      key: 'TitleScene',
      active: false,
    })
  }

  public init(): void {
    super.preInit()
    this.initUtilStore()
    super.init()
  }

  public initUtilStore(): void {
    this.store.setInit('util', {})
  }
}
