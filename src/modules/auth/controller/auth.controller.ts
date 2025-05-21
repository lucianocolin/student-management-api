import { Body, Controller, Inject, Post } from '@nestjs/common';
import { RegisterUserDto } from '../application/dto/register-user.dto';
import {
  AUTH_SERVICE_KEY,
  IAuthService,
} from '../domain/interfaces/auth-service.interface';
import { UserResponseDto } from '../application/dto/user-response.dto';
import { LoginUserDto } from '../application/dto/login-user.dto';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(AUTH_SERVICE_KEY)
    private readonly authService: IAuthService,
  ) {}

  @Post('register')
  async register(
    @Body() registerUserDto: RegisterUserDto,
  ): Promise<UserResponseDto> {
    return await this.authService.register(registerUserDto);
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto): Promise<UserResponseDto> {
    return await this.authService.login(loginUserDto);
  }
}
