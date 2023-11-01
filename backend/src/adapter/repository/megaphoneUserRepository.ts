import { IMegaphoneUserRepository } from '../../domain/IRepository/IMegaphoneUserRepository'

export class MegaphoneUserRepository implements IMegaphoneUserRepository {
  private readonly users = new Map<string, boolean>()

  public set(id: string, active: boolean): void {
    this.users.set(id, active)
  }

  public delete(id: string): void {
    this.users.delete(id)
  }

  public isUsingMegaphone(id: string): boolean {
    return this.users.has(id)
  }

  public toObject(): { [id: string]: boolean } {
    return Object.fromEntries(this.users)
  }
}
