import { SearchGymUseCase } from '../search-gyms.usecase'
import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms.repository'

export function makeSearchGymUseCase() {
  const gymsRepository = new PrismaGymsRepository()
  const useCase = new SearchGymUseCase(gymsRepository)

  return useCase
}
