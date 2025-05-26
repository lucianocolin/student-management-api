import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import {
  IStudentService,
  STUDENT_SERVICE_KEY,
} from '../domain/interfaces/student-service.interface';
import { StudentResponseDto } from '../application/dto/student-response.dto';
import { STUDENT_NAME } from '../domain/student.name';
import { Auth } from '../../auth/decorators/auth.decorator';
import { USER_ROLES } from '../../auth/application/enum/user-roles.enum';
import { CreateStudentDto } from '../application/dto/create-student.dto';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { User } from '../../auth/domain/user.domain';

@Controller(STUDENT_NAME)
export class StudentController {
  constructor(
    @Inject(STUDENT_SERVICE_KEY)
    private readonly studentService: IStudentService,
  ) {}

  @Auth(USER_ROLES.ADMIN)
  @Get()
  async getAll(): Promise<StudentResponseDto[]> {
    return await this.studentService.getAll();
  }

  @Auth()
  @Get(':id')
  async getOneById(@Param('id') id: string): Promise<StudentResponseDto> {
    return await this.studentService.getOneById(id);
  }

  @Auth()
  @Post()
  async create(
    @CurrentUser() user: User,
    @Body() createStudentDto: CreateStudentDto,
  ): Promise<StudentResponseDto> {
    return await this.studentService.create(createStudentDto, user);
  }
}
