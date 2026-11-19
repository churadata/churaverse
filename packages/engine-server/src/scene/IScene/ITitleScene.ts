import { EventBus } from '../../eventbus/eventBus'
import { Store } from '../../store/store'
import { BaseScene } from './baseScene'

export abstract class ITitleScene extends BaseScene {
  protected readonly store = new Store<ITitleScene>()
  protected readonly eventBus = new EventBus<ITitleScene>()

  public constructor() {
    super('TitleScene')
  }
}
