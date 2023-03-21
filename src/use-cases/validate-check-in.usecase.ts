import { CheckIn } from '@prisma/client'

import { CheckInsRepository } from '@/protocols/db/repositories/checkins.repository'
import { ResourceNotFoundError } from './errors/resource-not-found.error'

type ValidateCheckInUseCaseRequest = {
  checkInId: string
}

type ValidateCheckInUseCaseResponse = {
  checkIn: CheckIn
}

export class ValidateCheckInUseCase {
  constructor(private readonly checkinsRepository: CheckInsRepository) {}

  async execute({
    checkInId,
  }: ValidateCheckInUseCaseRequest): Promise<ValidateCheckInUseCaseResponse> {
    const checkIn = await this.checkinsRepository.findById(checkInId)

    if (!checkIn) {
      throw new ResourceNotFoundError()
    }

    checkIn.validated_at = new Date()

    await this.checkinsRepository.save(checkIn)

    return {
      checkIn,
    }
  }
}
