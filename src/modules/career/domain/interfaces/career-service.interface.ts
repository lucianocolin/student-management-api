import { CareerResponseDto } from '../../application/dto/career-response.dto';
import { CreateCareerDto } from '../../application/dto/create-career.dto';

export const CAREER_SERVICE_KEY = 'CAREER_SERVICE';

export interface ICareerService {
  getAll(): Promise<CareerResponseDto[]>;
  getOneById(id: string): Promise<CareerResponseDto>;
  create(createCareerDto: CreateCareerDto): Promise<CareerResponseDto>;
}
