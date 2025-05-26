import { Career } from '../career.domain';

export const CAREER_REPOSITORY_KEY = 'CAREER_REPOSITORY';

export interface ICareerRepository {
  findAll(): Promise<Career[]>;
  findOneById(id: string): Promise<Career>;
  findOneByName(name: string): Promise<Career>;
  create(career: Career): Promise<Career>;
}
