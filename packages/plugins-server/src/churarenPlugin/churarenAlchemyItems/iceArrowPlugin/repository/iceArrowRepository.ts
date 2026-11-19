import { CollidableEntityRepository } from '@churaverse/collision-detection-plugin-server'
import type { IIceArrowRepository } from '../domain/IIceArrowRepository'
import type { IceArrow } from '../domain/iceArrow'

export class IceArrowRepository extends CollidableEntityRepository<IceArrow> implements IIceArrowRepository {
  private readonly iceArrows = new Map<string, IceArrow>()

  public set(id: string, entity: IceArrow): void {
    super.set(id, entity)
    this.iceArrows.set(id, entity)
  }

  public delete(id: string): void {
    super.delete(id)
    this.iceArrows.delete(id)
  }

  public get(id: string): IceArrow | undefined {
    return this.iceArrows.get(id)
  }

  public getAllId(): string[] {
    return Array.from(this.iceArrows.keys())
  }

  public get size(): number {
    return this.iceArrows.size
  }
}
