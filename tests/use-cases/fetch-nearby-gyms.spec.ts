import { expect, describe, it, beforeEach } from 'vitest'

import { FetchNearbyGymsUseCase } from '@/use-cases/fetch-nearby-gyms.usecase'

import { InMemoryGymsRepository } from 'tests/repositories/in-memory-gyms-repository'

let gymsRepository: InMemoryGymsRepository
let sut: FetchNearbyGymsUseCase

describe('Fetch Nearby Gyms Use Case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new FetchNearbyGymsUseCase(gymsRepository)
  })

  it('should be able to fetch nearby gyms', async () => {
    await gymsRepository.create({
      title: 'Near Gym',
      description: '',
      phone: '',
      latitude: -23.5381603,
      longitude: -46.3686991,
    })

    await gymsRepository.create({
      title: 'Far Gym',
      description: '',
      phone: '',
      latitude: -22.823722,
      longitude: -45.9137075,
    })

    const { gyms } = await sut.execute({
      userLatitude: -23.5381603,
      userLongitude: -46.3686991,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'Near Gym' })])
  })
})
