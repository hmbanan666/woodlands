import { useDatabase } from '../database'

class Repository {
  async checkHealth(): Promise<boolean> {
    await useDatabase().query.users.findFirst()
    return true
  }
}

export const repository = new Repository()
