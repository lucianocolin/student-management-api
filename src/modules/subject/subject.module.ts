import { Module } from '@nestjs/common';
import { SubjectController } from './application/controller/subject.controller';
import { SubjectService } from './application/service/subject.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubjectEntity } from './infrastructure/database/subject.entity';
import { SUBJECT_SERVICE_KEY } from './domain/interfaces/subject-service.interface';
import { SUBJECT_REPOSITORY_KEY } from './domain/interfaces/subject-repository.interface';
import { SubjectRepository } from './infrastructure/database/subject.postgresql.repository';
import { SubjectMapper } from './application/mapper/subject.mapper';
import { CareerModule } from '../career/career.module';

const subjectRepositoryProvider = {
  provide: SUBJECT_REPOSITORY_KEY,
  useClass: SubjectRepository,
};

const subjectServiceProvider = {
  provide: SUBJECT_SERVICE_KEY,
  useClass: SubjectService,
};

@Module({
  imports: [TypeOrmModule.forFeature([SubjectEntity]), CareerModule],
  controllers: [SubjectController],
  providers: [subjectRepositoryProvider, subjectServiceProvider, SubjectMapper],
})
export class SubjectModule {}
