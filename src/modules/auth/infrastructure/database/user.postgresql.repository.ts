import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { User } from '../../domain/user.domain';
import { RegisterUserDto } from '../../application/dto/register-user.dto';
import { IUserRepository } from '../../domain/interfaces/user-repository.interface';
import { UserAlreadyExistsException } from '../../domain/exceptions/user-already-exists.exception';
import { UserIdNotFoundException } from '../../domain/exceptions/user-id-not-found.exception';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<User>,
  ) {}

  async saveOne(registerUserDto: RegisterUserDto): Promise<User> {
    const { email } = registerUserDto;

    const user = await this.findOneByEmail(email);

    if (user) {
      throw new UserAlreadyExistsException(email);
    }

    const userToCreate = this.repository.create(registerUserDto);

    return this.repository.save(userToCreate);
  }

  async findOneByEmail(email: string): Promise<User> {
    return this.repository.findOneBy({ email });
  }

  async findOneById(id: string): Promise<User> {
    return this.repository.findOneBy({ id });
  }

  async updateOne(userId: string, user: Partial<User>): Promise<User> {
    const userToUpdate = await this.findOneById(userId);

    if (!userToUpdate) {
      throw new UserIdNotFoundException(userId);
    }

    return await this.repository.save({ ...userToUpdate, ...user });
  }
}
