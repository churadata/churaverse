export interface IAlchemyItemBoxContainer {
  initialize: () => void
  show: () => void
  updateAlchemyItemBox: (itemImage: string) => void
  hide: () => void
  remove: () => void
}
