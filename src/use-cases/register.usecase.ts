import { hash } from 'bcryptjs'

import { UsersRepository } from '@/protocols/db/repositories/users.repository'
import { UserAlreadyExistsError } from './errors/user-already-exists.error'

type RegisterUseCaseRequest = {
  name: string
  email: string
  password: string
}

export class RegisterUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute({ name, email, password }: RegisterUseCaseRequest) {
    const password_hash = await hash(password, 6)

    const userWithSameEmail = await this.usersRepository.findByEmail(email)

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError()
    }

    await this.usersRepository.create({ name, email, password_hash })
  }
}
