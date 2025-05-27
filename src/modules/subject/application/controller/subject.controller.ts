import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import {
  ISubjectService,
  SUBJECT_SERVICE_KEY,
} from '../../domain/interfaces/subject-service.interface';
import { CreateSubjectDto } from '../dto/create-subject.dto';
import { Auth } from '../../../auth/decorators/auth.decorator';
import { USER_ROLES } from '../../../auth/application/enum/user-roles.enum';
import { SUBJECT_NAME } from '../../domain/subject.name';

@Controller(SUBJECT_NAME)
export class SubjectController {
  constructor(
    @Inject(SUBJECT_SERVICE_KEY)
    private readonly subjectService: ISubjectService,
  ) {}

  @Auth()
  @Get()
  async getAll() {
    return await this.subjectService.getAll();
  }

  @Auth(USER_ROLES.ADMIN)
  @Post()
  async create(@Body() createSubjectDto: CreateSubjectDto) {
    return await this.subjectService.create(createSubjectDto);
  }
}
