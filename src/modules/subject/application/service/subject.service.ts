import {
  ISubjectRepository,
  SUBJECT_REPOSITORY_KEY,
} from './../../domain/interfaces/subject-repository.interface';
import { Inject, Injectable } from '@nestjs/common';
import { ISubjectService } from '../../domain/interfaces/subject-service.interface';
import { SubjectResponseDto } from '../dto/subject-response.dto';
import { SubjectMapper } from '../mapper/subject.mapper';
import { CreateSubjectDto } from '../dto/create-subject.dto';
import {
  CAREER_SERVICE_KEY,
  ICareerService,
} from '../../../career/domain/interfaces/career-service.interface';
import { SubjectNotFoundException } from '../../domain/exceptions/subject-not-found.exception';

@Injectable()
export class SubjectService implements ISubjectService {
  constructor(
    @Inject(SUBJECT_REPOSITORY_KEY)
    private readonly subjectRepository: ISubjectRepository,
    private readonly subjectMapper: SubjectMapper,
    @Inject(CAREER_SERVICE_KEY)
    private readonly careerService: ICareerService,
  ) {}

  async getAll(): Promise<SubjectResponseDto[]> {
    const dbSubjects = await this.subjectRepository.findAll();

    return dbSubjects.map((dbSubject) =>
      this.subjectMapper.fromSubjectToSubjectResponseDto(dbSubject),
    );
  }

  async getOneById(id: string): Promise<SubjectResponseDto> {
    const dbSubject = await this.subjectRepository.findOneById(id);

    if (!dbSubject) {
      throw new SubjectNotFoundException(id);
    }

    return this.subjectMapper.fromSubjectToSubjectResponseDto(dbSubject);
  }

  async create(
    createSubjectDto: CreateSubjectDto,
  ): Promise<SubjectResponseDto> {
    const career = await this.careerService.getOneById(
      createSubjectDto.careerId,
    );

    const dbSubject = await this.subjectRepository.create({
      ...createSubjectDto,
      career,
    });

    return this.subjectMapper.fromSubjectToSubjectResponseDto(dbSubject);
  }
}
