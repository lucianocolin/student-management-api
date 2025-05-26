import { Inject, Injectable } from '@nestjs/common';
import {
  CAREER_REPOSITORY_KEY,
  ICareerRepository,
} from '../../domain/interfaces/career-repository.interface';
import { CareerResponseDto } from '../dto/career-response.dto';
import { CareerMapper } from '../mapper/career.mapper';
import { ICareerService } from '../../domain/interfaces/career-service.interface';
import { CreateCareerDto } from '../dto/create-career.dto';
import { CareerNotFoundException } from '../../domain/exceptions/career-not-found.exception';

@Injectable()
export class CareerService implements ICareerService {
  constructor(
    @Inject(CAREER_REPOSITORY_KEY)
    private readonly careerRepository: ICareerRepository,
    private readonly careerMapper: CareerMapper,
  ) {}

  async getAll(): Promise<CareerResponseDto[]> {
    const dbCareers = await this.careerRepository.findAll();

    return dbCareers.map((career) =>
      this.careerMapper.fromCareerToCareerResponseDto(career),
    );
  }

  async getOneById(id: string): Promise<CareerResponseDto> {
    const dbCareer = await this.careerRepository.findOneById(id);

    if (!dbCareer) {
      throw new CareerNotFoundException(id);
    }

    return this.careerMapper.fromCareerToCareerResponseDto(dbCareer);
  }

  async create(createCareerDto: CreateCareerDto): Promise<CareerResponseDto> {
    const dbCareer = await this.careerRepository.create(createCareerDto);

    return this.careerMapper.fromCareerToCareerResponseDto(dbCareer);
  }
}
