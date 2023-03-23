import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/app'
import { prisma } from '@/lib/prisma'

import { createAndAuthenticateUser } from 'tests/utils/create-and-authenticate-user'

describe('Create Check-in (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create a check-in', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const gym = await prisma.gym.create({
      data: {
        title: 'JavaScript Gym',
        latitude: -23.5381603,
        longitude: -46.3686991,
      },
    })

    const response = await request(app.server)
      .post(`/check-ins/${gym.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        latitude: -23.5381603,
        longitude: -46.3686991,
      })

    expect(response.statusCode).toEqual(201)
  })
})
