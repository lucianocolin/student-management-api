import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { RegisterUserDto } from '../application/dto/register-user.dto';
import {
  AUTH_SERVICE_KEY,
  IAuthService,
} from '../domain/interfaces/auth-service.interface';
import { UserResponseDto } from '../application/dto/user-response.dto';
import { LoginUserDto } from '../application/dto/login-user.dto';
import { CurrentUser } from '../decorators/current-user.decorator';
import { Auth } from '../decorators/auth.decorator';
import { User } from '../domain/user.domain';
import { UserMapper } from '../application/mapper/user.mapper';
import { USER_ROLES } from '../application/enum/user-roles.enum';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(AUTH_SERVICE_KEY)
    private readonly authService: IAuthService,
    private readonly userMapper: UserMapper,
  ) {}

  @Auth()
  @Get('me')
  getMyUser(@CurrentUser() user: User): UserResponseDto {
    return this.userMapper.fromUserToUserResponseDto(user);
  }

  @Auth(USER_ROLES.ADMIN)
  @Get('not-approved-users')
  async getNotApprovedUsers(): Promise<UserResponseDto[]> {
    return await this.authService.getNotApprovedUsers();
  }

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

  @Auth(USER_ROLES.ADMIN)
  @Patch('/approve/:id')
  async approveRegistrationRequest(
    @Param('id') userId: string,
  ): Promise<UserResponseDto> {
    return await this.authService.approveRegistrationRequest(userId);
  }
}
