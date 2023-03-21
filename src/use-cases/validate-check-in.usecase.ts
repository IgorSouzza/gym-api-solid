import dayjs from 'dayjs'
import { CheckIn } from '@prisma/client'

import { CheckInsRepository } from '@/protocols/db/repositories/checkins.repository'
import { ResourceNotFoundError } from './errors/resource-not-found.error'
import { LateCheckInValidationError } from './errors/late-check-in-validation.error'

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

    const distanceInMinutesFromCheckInCreation = dayjs(new Date()).diff(
      checkIn.created_at,
      'minutes',
    )

    if (distanceInMinutesFromCheckInCreation > 20)
      throw new LateCheckInValidationError()

    checkIn.validated_at = new Date()

    await this.checkinsRepository.save(checkIn)

    return {
      checkIn,
    }
  }
}
