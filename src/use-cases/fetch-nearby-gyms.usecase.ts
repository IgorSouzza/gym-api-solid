import { Gym } from '@prisma/client'

import { GymsRepository } from '@/protocols/db/repositories/gyms.repository'

type FetchNearbyGymsUseCaseRequest = {
  userLatitude: number
  userLongitude: number
}

type FetchNearbyGymsCaseResponse = {
  gyms: Gym[]
}

export class FetchNearbyGymsUseCase {
  constructor(private readonly gymsRepository: GymsRepository) {}

  async execute({
    userLatitude,
    userLongitude,
  }: FetchNearbyGymsUseCaseRequest): Promise<FetchNearbyGymsCaseResponse> {
    const gyms = await this.gymsRepository.findManyNearby({
      latitude: userLatitude,
      longitude: userLongitude,
    })

    return { gyms }
  }
}
