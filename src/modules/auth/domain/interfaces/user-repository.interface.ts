import { RegisterUserDto } from '../../application/dto/register-user.dto';
import { User } from '../user.domain';

export const USER_REPOSITORY_KEY = 'USER_REPOSITORY';

export interface IUserRepository {
  saveOne(registerUserDto: RegisterUserDto): Promise<User>;
  findOneByEmail(email: string): Promise<User>;
}
