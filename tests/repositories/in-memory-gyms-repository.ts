import { Gym } from '@prisma/client'

import { GymsRepository } from '@/protocols/db/repositories/gyms.repository'

export class InMemoryGymsRepository implements GymsRepository {
  public gyms: Gym[] = []

  async findById(id: string) {
    const gym = this.gyms.find((item) => item.id === id)

    if (!gym) return null

    return gym
  }
}
