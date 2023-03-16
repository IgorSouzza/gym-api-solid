import { expect, describe, it, beforeEach, afterEach, vi } from 'vitest'
import { Decimal } from '@prisma/client/runtime/library'

import { CheckInUseCase } from '@/use-cases/check-in.usecase'
import { MaxDistanceError } from '@/use-cases/errors/max-distance.error'
import { MaxNumberOfCheckInsError } from '@/use-cases/errors/max-number-of-check-ins.error'

import { InMemoryGymsRepository } from 'tests/repositories/in-memory-gyms-repository'
import { InMemoryCheckInsRepository } from 'tests/repositories/in-memory-checkins-repository'

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInUseCase

describe('Check-in Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    sut = new CheckInUseCase(checkInsRepository, gymsRepository)

    await gymsRepository.create({
      id: 'gym-01',
      title: 'Js Gym',
      description: '',
      phone: '',
      latitude: new Decimal(-23.5381603),
      longitude: new Decimal(-46.3686991),
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -23.5381603,
      userLongitude: -46.3686991,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in twice on the same day', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -23.5381603,
      userLongitude: -46.3686991,
    })

    await expect(() =>
      sut.execute({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitude: -23.5381603,
        userLongitude: -46.3686991,
      }),
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
  })

  it('should be able to check in twice but in different days', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -23.5381603,
      userLongitude: -46.3686991,
    })

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0))

    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -23.5381603,
      userLongitude: -46.3686991,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in on distant gym', async () => {
    gymsRepository.gyms.push({
      id: 'gym-02',
      title: 'Ts Gym',
      description: '',
      phone: '',
      latitude: new Decimal(-23.5449155),
      longitude: new Decimal(-46.3614941),
    })

    await expect(() =>
      sut.execute({
        gymId: 'gym-02',
        userId: 'user-01',
        userLatitude: -23.5381603,
        userLongitude: -46.3686991,
      }),
    ).rejects.toBeInstanceOf(MaxDistanceError)
  })
})
