import { domLayerSetting, AbstractDOMLayerNames } from './domLayer'

// eslint-disable-next-line no-undef-init
let changeableElement: HTMLElement | Element | undefined = undefined
// eslint-disable-next-line no-undef-init
let previousLayerName: AbstractDOMLayerNames | undefined = undefined

export function makeLayerHigherTemporary(
  element: HTMLElement | Element,
  defaultAbstractDOMLayer: AbstractDOMLayerNames
): void {
  if (changeableElement != null && previousLayerName != null) {
    // re-assign previous element Layer
    if (changeableElement instanceof HTMLElement) {
      domLayerSetting(changeableElement, previousLayerName)
    } else {
      changeableElement.classList.remove('higher')
    }
  }
  // assign new element to higher Layer
  changeableElement = element
  previousLayerName = defaultAbstractDOMLayer
  if (element instanceof HTMLElement) {
    domLayerSetting(element, 'higher')
  } else {
    element.classList.add('higher')
  }
}
