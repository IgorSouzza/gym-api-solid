import { Gym } from '@prisma/client'

import { GymsRepository } from '@/protocols/db/repositories/gyms.repository'

type SearchGymsUseCaseRequest = {
  query: string
  page: number
}

type SearchGymsCaseResponse = {
  gyms: Gym[]
}

export class SearchGymsUseCase {
  constructor(private readonly gymsRepository: GymsRepository) {}

  async execute({
    query,
    page,
  }: SearchGymsUseCaseRequest): Promise<SearchGymsCaseResponse> {
    const gyms = await this.gymsRepository.searchMany(query, page)

    return { gyms }
  }
}
