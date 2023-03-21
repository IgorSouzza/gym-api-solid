import { Gym } from '@prisma/client'

import { GymsRepository } from '@/protocols/db/repositories/gyms.repository'

type SearchGymUseCaseRequest = {
  query: string
  page: number
}

type SearchGymCaseResponse = {
  gyms: Gym[]
}

export class SearchGymUseCase {
  constructor(private readonly gymsRepository: GymsRepository) {}

  async execute({
    query,
    page,
  }: SearchGymUseCaseRequest): Promise<SearchGymCaseResponse> {
    const gyms = await this.gymsRepository.searchMany(query, page)

    return { gyms }
  }
}
