import { Inject, Injectable } from '@nestjs/common';
import { RegisterUserDto } from '../dto/register-user.dto';
import { UserResponseDto } from '../dto/user-response.dto';
import { UserMapper } from '../mapper/user.mapper';
import {
  IUserRepository,
  USER_REPOSITORY_KEY,
} from '../../domain/interfaces/user-repository.interface';
import { IAuthService } from '../../domain/interfaces/auth-service.interface';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from '../dto/login-user.dto';
import { UserNotFoundException } from '../../domain/exceptions/user-not-found.exception';
import { InvalidPasswordException } from '../../domain/exceptions/invalid-password.exception';
import { JwtService } from '@nestjs/jwt';
import { IJwtPayload } from '../../domain/interfaces/jwt-payload.interface';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @Inject(USER_REPOSITORY_KEY)
    private readonly userRepository: IUserRepository,
    private readonly userMapper: UserMapper,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerUserDto: RegisterUserDto): Promise<UserResponseDto> {
    const { password, ...rest } = registerUserDto;

    const user = await this.userRepository.saveOne({
      ...rest,
      password: bcrypt.hashSync(password, 10),
    });

    return this.userMapper.fromUserToUserResponseDto(user);
  }

  async login(loginUserDto: LoginUserDto): Promise<UserResponseDto> {
    const { email, password } = loginUserDto;

    const user = await this.userRepository.findOneByEmail(email);

    if (!user) {
      throw new UserNotFoundException(email);
    }

    if (!bcrypt.compareSync(password, user.password)) {
      throw new InvalidPasswordException();
    }

    const mappedUser = this.userMapper.fromUserToUserResponseDto(user);

    return {
      ...mappedUser,
      token: this.getJWTToken({ id: user.id, email: user.email }),
    };
  }

  private getJWTToken(payload: IJwtPayload) {
    const token = this.jwtService.sign(payload);

    return token;
  }
}
