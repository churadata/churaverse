export interface IMaterialItemBoxContainer {
  initialize: () => void
  show: () => void
  updateMaterialItemBox: (itemImageList: string[]) => void
  hide: () => void
  remove: () => void
}
