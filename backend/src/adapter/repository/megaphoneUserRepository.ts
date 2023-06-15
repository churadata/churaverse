import { IMegaphoneUserRepository } from '../../domain/IRepository/IMegaphoneUserRepository'

export class MegaphoneUserRepository implements IMegaphoneUserRepository {
  private readonly users = new Set<string>()

  public add(id: string): void {
    this.users.add(id)
  }

  public delete(id: string): void {
    this.users.delete(id)
  }

  public isUsingMegaphone(id: string): boolean {
    return this.users.has(id)
  }

  public getIds(): string[] {
    return Array.from(this.users.keys())
  }
}
