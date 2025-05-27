import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../src/modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { StudentModule } from '../src/modules/student/student.module';
import { CareerModule } from '../src/modules/career/career.module';
import { SubjectModule } from '../src/modules/subject/subject.module';
import { EnrollmentModule } from '../src/modules/enrollment/enrollment.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env.test',
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      dropSchema: true,
      synchronize: true,
      autoLoadEntities: true,
      logging: false,
    }),
    AuthModule,
    StudentModule,
    CareerModule,
    SubjectModule,
    EnrollmentModule,
  ],
})
export class TestAppModule {}
