import { randomUUID } from 'node:crypto'
import { CheckIn, Prisma } from '@prisma/client'

import { CheckInsRepository } from '@/protocols/db/repositories/checkins.repository'
import dayjs from 'dayjs'

export class InMemoryCheckInsRepository implements CheckInsRepository {
  public checkins: CheckIn[] = []

  async findById(id: string) {
    const checkIn = this.checkins.find((checkin) => checkin.id === id)

    if (!checkIn) return null

    return checkIn
  }

  async findByUserIdOnDate(userId: string, date: Date) {
    const startOfTheDay = dayjs(date).startOf('date')
    const endOfTheDay = dayjs(date).endOf('date')

    const checkInOnSameDate = this.checkins.find((checkIn) => {
      const checkInDate = dayjs(checkIn.created_at)
      const isOnSameDate =
        checkInDate.isAfter(startOfTheDay) && checkInDate.isBefore(endOfTheDay)

      return checkIn.user_id === userId && isOnSameDate
    })

    if (!checkInOnSameDate) return null

    return checkInOnSameDate
  }

  async countByUserId(userId: string) {
    return this.checkins.filter((checkIn) => checkIn.user_id === userId).length
  }

  async findManyByUserId(userId: string, page: number) {
    return this.checkins
      .filter((checkIn) => checkIn.user_id === userId)
      .slice((page - 1) * 20, page * 20)
  }

  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIn = {
      id: randomUUID(),
      user_id: data.user_id,
      gym_id: data.gym_id,
      validated_at: data.validated_at ? new Date(data.validated_at) : null,
      created_at: new Date(),
    }

    this.checkins.push(checkIn)

    return checkIn
  }

  async save(checkIn: CheckIn) {
    const checkInIndex = this.checkins.findIndex(
      (item) => item.id === checkIn.id,
    )

    if (checkInIndex >= 0) {
      this.checkins[checkInIndex] = checkIn
    }

    return checkIn
  }
}
