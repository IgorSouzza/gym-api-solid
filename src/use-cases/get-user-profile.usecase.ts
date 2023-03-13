import { User } from '@prisma/client'

import { UsersRepository } from '@/protocols/db/repositories/users.repository'
import { ResourceNotFoundError } from './errors/resource-not-found.error'

type GetUserProfileUseCaseRequest = {
  userId: string
}

type GetUserProfileUseCaseResponse = {
  user: User
}

export class GetUserProfileUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute({
    userId,
  }: GetUserProfileUseCaseRequest): Promise<GetUserProfileUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) throw new ResourceNotFoundError()

    return {
      user,
    }
  }
}
