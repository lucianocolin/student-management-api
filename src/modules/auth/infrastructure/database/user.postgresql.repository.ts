import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { User } from '../../domain/user.domain';
import { RegisterUserDto } from '../../application/dto/register-user.dto';
import { IUserRepository } from '../../domain/interfaces/user-repository.interface';
import { UserAlreadyExistsException } from '../../domain/exceptions/user-already-exists.exception';

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
}
