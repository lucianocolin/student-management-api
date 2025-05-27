import { Module } from '@nestjs/common';
import { EnrollmentService } from './application/service/enrollment.service';
import { EnrollmentController } from './controller/enrollment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnrollmentEntity } from './infrastructure/database/enrollment.entity';
import { ENROLLMENT_REPOSITORY_KEY } from './domain/interface/enrollment-repository.interface';
import { EnrollmentRepository } from './infrastructure/database/enrollment.postgresql.repository';
import { ENROLLMENT_SERVICE_KEY } from './domain/interface/enrollment-service.interface';
import { EnrollmentMapper } from './application/mapper/enrollment.mapper';
import { StudentModule } from '../student/student.module';
import { SubjectModule } from '../subject/subject.module';

const enrollmentRepositoryProvider = {
  provide: ENROLLMENT_REPOSITORY_KEY,
  useClass: EnrollmentRepository,
};

const enrollmentServiceProvider = {
  provide: ENROLLMENT_SERVICE_KEY,
  useClass: EnrollmentService,
};

@Module({
  imports: [
    TypeOrmModule.forFeature([EnrollmentEntity]),
    StudentModule,
    SubjectModule,
  ],
  controllers: [EnrollmentController],
  providers: [
    enrollmentRepositoryProvider,
    enrollmentServiceProvider,
    EnrollmentMapper,
  ],
})
export class EnrollmentModule {}
