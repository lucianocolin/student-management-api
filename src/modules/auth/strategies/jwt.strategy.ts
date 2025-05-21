import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { IJwtPayload } from '../domain/interfaces/jwt-payload.interface';
import {
  IUserRepository,
  USER_REPOSITORY_KEY,
} from '../domain/interfaces/user-repository.interface';
import { InvalidTokenException } from '../domain/exceptions/invalid-token.exception';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(USER_REPOSITORY_KEY)
    private readonly userRepository: IUserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: IJwtPayload) {
    const { email } = payload;

    const user = await this.userRepository.findOneByEmail(email);

    if (!user) {
      throw new InvalidTokenException();
    }

    return user;
  }
}
