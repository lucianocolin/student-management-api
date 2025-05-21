import { Module } from '@nestjs/common';
import { AuthService } from './application/service/auth.service';
import { AuthController } from './controller/auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './infrastructure/database/user.entity';
import { UserRepository } from './infrastructure/database/user.postgresql.repository';
import { USER_REPOSITORY_KEY } from './domain/interfaces/user-repository.interface';
import { AUTH_SERVICE_KEY } from './domain/interfaces/auth-service.interface';
import { UserMapper } from './application/mapper/user.mapper';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

const userRepositoryProvider = {
  provide: USER_REPOSITORY_KEY,
  useClass: UserRepository,
};

const authServiceProvider = {
  provide: AUTH_SERVICE_KEY,
  useClass: AuthService,
};

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [authServiceProvider, userRepositoryProvider, UserMapper],
})
export class AuthModule {}
