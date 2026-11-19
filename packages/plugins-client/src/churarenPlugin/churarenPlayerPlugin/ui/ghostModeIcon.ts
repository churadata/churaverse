import type { ITopBarIconContainer } from '@churaverse/core-ui-plugin-client'
import { TopBarIconRenderer } from '@churaverse/core-ui-plugin-client'

import CHURAREN_GHOST_MODE_ICON_PATH from '../assets/ghostModeIcon.png'

export class GhostModeIcon extends TopBarIconRenderer {
  public constructor(iconContainer: ITopBarIconContainer) {
    super({
      activeIconImgPath: CHURAREN_GHOST_MODE_ICON_PATH,
      inactiveIconImgPath: CHURAREN_GHOST_MODE_ICON_PATH,
      onClick: (_isActive) => {},
      isActive: false,
      order: 400,
    })
    iconContainer.addIcon(this)
  }

  /**
   * アイコンの画像をactiveにする
   * @override
   */
  public activate(): void {
    super.activate()
    this.imgElement.style.display = 'inline'
  }

  /**
   * アイコンの画像をinactiveにする
   * @override
   */
  public deactivate(): void {
    super.deactivate()
    this.imgElement.style.display = 'none'
  }
}
