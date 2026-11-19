import { EventBus } from '../../eventbus/eventBus'
import { Store } from '../../store/store'
import { BaseScene } from './baseScene'

export abstract class IMainScene extends BaseScene {
  protected readonly store = new Store<IMainScene>()
  protected readonly eventBus = new EventBus<IMainScene>()

  public constructor() {
    super('MainScene')
  }
}
