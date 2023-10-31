import { WorldMap } from '../model/worldMap'

export interface EntityRepository<T> {
  set: (id: string, entity: T) => void
  delete: (id: string) => void
  updateMap: (worldMap: WorldMap) => void
  get: (id: string) => T | undefined
  getAllId: () => string[]
}
