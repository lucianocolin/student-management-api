import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ENROLLMENT_NAME } from '../domain/enrollment.name';
import {
  ENROLLMENT_SERVICE_KEY,
  IEnrollmentService,
} from '../domain/interface/enrollment-service.interface';
import { EnrollmentResponseDto } from '../application/dto/enrollment-response.dto';
import { Auth } from '../../auth/decorators/auth.decorator';
import { CreateEnrollmentDto } from '../application/dto/create-enrollment.dto';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { User } from '../../auth/domain/user.domain';
import { USER_ROLES } from '../../auth/application/enum/user-roles.enum';
import { AssignGradeDto } from '../application/dto/assign-grade.dto';

@Controller(ENROLLMENT_NAME)
export class EnrollmentController {
  constructor(
    @Inject(ENROLLMENT_SERVICE_KEY)
    private readonly enrollmentService: IEnrollmentService,
  ) {}

  @Auth()
  @Get()
  async getAll(
    @Query('studentId') studentId?: string,
  ): Promise<EnrollmentResponseDto[]> {
    return this.enrollmentService.getAll(studentId);
  }

  @Auth()
  @Post()
  async create(
    @Body() createEnrollmentDto: CreateEnrollmentDto,
    @CurrentUser() user: User,
  ): Promise<EnrollmentResponseDto> {
    return this.enrollmentService.create(createEnrollmentDto, user);
  }

  @Auth(USER_ROLES.ADMIN)
  @Patch(':id')
  async assignGrade(
    @Param('id') enrollmentId: string,
    @Body() assignGradeDto: AssignGradeDto,
  ): Promise<EnrollmentResponseDto> {
    return this.enrollmentService.assignGrade(enrollmentId, assignGradeDto);
  }
}
