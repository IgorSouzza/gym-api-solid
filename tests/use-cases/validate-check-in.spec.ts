import { expect, describe, it, beforeEach, afterEach } from 'vitest'

import { ValidateCheckInUseCase } from '@/use-cases/validate-check-in.usecase'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found.error'

import { InMemoryCheckInsRepository } from 'tests/repositories/in-memory-checkins-repository'

let checkInsRepository: InMemoryCheckInsRepository
let sut: ValidateCheckInUseCase

describe('Validate Check-in Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new ValidateCheckInUseCase(checkInsRepository)

    // vi.useFakeTimers()
  })

  afterEach(() => {
    // vi.useRealTimers()
  })

  it('should be able to validate the check-in', async () => {
    const createdCheckIn = await checkInsRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    })

    const { checkIn } = await sut.execute({
      checkInId: createdCheckIn.id,
    })

    expect(checkIn.validated_at).toEqual(expect.any(Date))
    expect(checkInsRepository.checkins[0].validated_at).toEqual(
      expect.any(Date),
    )
  })

  it('should not be able to validate an inexistent check-in', async () => {
    await expect(() =>
      sut.execute({
        checkInId: 'inexistent-checkin-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
