export interface EntityRepository<T> {
  set: (id: string, entity: T) => void
  delete: (id: string) => void
  get: (id: string) => T | undefined
  getAllId: () => string[]
}
