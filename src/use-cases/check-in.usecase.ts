import { CheckIn } from '@prisma/client'

import { CheckInsRepository } from '@/protocols/db/repositories/checkins.repository'

type CheckInUseCaseRequest = {
  userId: string
  gymId: string
}

type CheckInUseCaseResponse = {
  checkIn: CheckIn
}

export class CheckInUseCase {
  constructor(private readonly checkinsRepository: CheckInsRepository) {}

  async execute({
    userId,
    gymId,
  }: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse> {
    const checkIn = await this.checkinsRepository.create({
      gym_id: gymId,
      user_id: userId,
    })

    return {
      checkIn,
    }
  }
}
