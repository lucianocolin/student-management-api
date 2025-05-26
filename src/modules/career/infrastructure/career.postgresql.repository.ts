import { InjectRepository } from '@nestjs/typeorm';
import { CareerEntity } from './career.entity';
import { Repository } from 'typeorm';
import { Career } from '../domain/career.domain';
import { CareerAlreadyExistsException } from '../domain/exceptions/career-already-exists.exception';
import { ICareerRepository } from '../domain/interfaces/career-repository.interface';

export class CareerRepository implements ICareerRepository {
  constructor(
    @InjectRepository(CareerEntity)
    private readonly repository: Repository<Career>,
  ) {}

  async findAll(): Promise<Career[]> {
    return await this.repository.find();
  }

  async findOneById(id: string): Promise<Career> {
    return await this.repository.findOne({ where: { id } });
  }

  async findOneByName(name: string): Promise<Career> {
    return await this.repository.findOne({ where: { name } });
  }

  async create(career: Career): Promise<Career> {
    const careerExists = await this.findOneByName(career.name);

    if (careerExists) {
      throw new CareerAlreadyExistsException(career.name);
    }

    const newCareer = this.repository.create(career);

    return await this.repository.save(newCareer);
  }
}
