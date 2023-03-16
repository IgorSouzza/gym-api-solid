import { expect, describe, it, beforeEach } from 'vitest'

import { CreateGymUseCase } from '@/use-cases/create-gym.usecase'

import { InMemoryGymsRepository } from 'tests/repositories/in-memory-gyms-repository'

let gymsRepository: InMemoryGymsRepository
let sut: CreateGymUseCase

describe('Create Gym Use Case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new CreateGymUseCase(gymsRepository)
  })

  it('should be able to create gym', async () => {
    const { gym } = await sut.execute({
      title: '',
      description: '',
      phone: '',
      latitude: -23.5381603,
      longitude: -46.3686991,
    })

    expect(gym.id).toEqual(expect.any(String))
  })
})
