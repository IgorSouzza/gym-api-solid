import { compare } from 'bcryptjs'
import { User } from '@prisma/client'

import { UsersRepository } from '@/protocols/db/repositories/users.repository'
import { InvalidCredentialsError } from './errors/invalid-credentials.error'

type AutheticateUseCaseRequest = {
  email: string
  password: string
}

type AutheticateUseCaseResponse = {
  user: User
}

export class AuthenticateUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute({
    email,
    password,
  }: AutheticateUseCaseRequest): Promise<AutheticateUseCaseResponse> {
    const user = await this.usersRepository.findByEmail(email)

    if (!user) throw new InvalidCredentialsError()

    const doesPasswordMatches = await compare(password, user.password_hash)

    if (!doesPasswordMatches) throw new InvalidCredentialsError()

    return {
      user,
    }
  }
}
