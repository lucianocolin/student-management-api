import { Module } from '@nestjs/common';
import { StudentService } from './application/service/student.service';
import { StudentController } from './controller/student.controller';
import { STUDENT_SERVICE_KEY } from './domain/interfaces/student-service.interface';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentEntity } from './infrastructure/database/student.entity';
import { STUDENT_REPOSITORY_KEY } from './domain/interfaces/student-repository.interface';
import { StudentRepository } from './infrastructure/database/student.postgresql.repository';
import { StudentMapper } from './application/mapper/student.mapper';
import { CareerModule } from '../career/career.module';

const studentServiceProvider = {
  provide: STUDENT_SERVICE_KEY,
  useClass: StudentService,
};

const studentRepositoryProvider = {
  provide: STUDENT_REPOSITORY_KEY,
  useClass: StudentRepository,
};

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([StudentEntity]),
    CareerModule,
  ],
  controllers: [StudentController],
  providers: [studentServiceProvider, studentRepositoryProvider, StudentMapper],
})
export class StudentModule {}
