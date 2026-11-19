import type { ITopBarIconRenderer } from '@churaverse/core-ui-plugin-client'

export interface IVideoChatIcon extends ITopBarIconRenderer {
  enableButton: () => void
}
