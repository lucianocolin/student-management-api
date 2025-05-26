import { Module } from '@nestjs/common';
import { CareerService } from './application/service/career.service';
import { CareerController } from './controller/career.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CareerEntity } from './infrastructure/career.entity';
import { CAREER_REPOSITORY_KEY } from './domain/interfaces/career-repository.interface';
import { CareerRepository } from './infrastructure/career.postgresql.repository';
import { CareerMapper } from './application/mapper/career.mapper';
import { CAREER_SERVICE_KEY } from './domain/interfaces/career-service.interface';

const careerRepositoryProvider = {
  provide: CAREER_REPOSITORY_KEY,
  useClass: CareerRepository,
};

const careerServiceProvider = {
  provide: CAREER_SERVICE_KEY,
  useClass: CareerService,
};

@Module({
  imports: [TypeOrmModule.forFeature([CareerEntity])],
  controllers: [CareerController],
  providers: [careerRepositoryProvider, careerServiceProvider, CareerMapper],
  exports: [careerRepositoryProvider, careerServiceProvider],
})
export class CareerModule {}
