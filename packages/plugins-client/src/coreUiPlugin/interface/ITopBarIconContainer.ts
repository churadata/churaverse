import type { TopBarIconRenderer } from '../topBarIcon'

export interface ITopBarIconContainer {
  addIcon: (icon: TopBarIconRenderer) => void
}
