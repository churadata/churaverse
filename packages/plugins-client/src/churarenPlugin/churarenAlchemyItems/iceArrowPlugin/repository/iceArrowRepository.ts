import type { IceArrow } from '../domain/iceArrow'

export class IceArrowRepository {
  private readonly iceArrows = new Map<string, IceArrow>()

  public set(id: string, entity: IceArrow): void {
    this.iceArrows.set(id, entity)
  }

  public delete(id: string): void {
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
