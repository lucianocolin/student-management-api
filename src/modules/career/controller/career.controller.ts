import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import {
  CAREER_SERVICE_KEY,
  ICareerService,
} from '../domain/interfaces/career-service.interface';
import { CareerResponseDto } from '../application/dto/career-response.dto';
import { Auth } from '../../auth/decorators/auth.decorator';
import { CreateCareerDto } from '../application/dto/create-career.dto';
import { CAREER_NAME } from '../domain/career.name';

@Controller(CAREER_NAME)
export class CareerController {
  constructor(
    @Inject(CAREER_SERVICE_KEY)
    private readonly careerService: ICareerService,
  ) {}

  @Auth()
  @Get()
  async getAll(): Promise<CareerResponseDto[]> {
    return await this.careerService.getAll();
  }

  @Auth()
  @Get(':id')
  async getOneById(@Param('id') id: string): Promise<CareerResponseDto> {
    return await this.careerService.getOneById(id);
  }

  @Auth()
  @Post()
  async create(
    @Body() createCareerDto: CreateCareerDto,
  ): Promise<CareerResponseDto> {
    return await this.careerService.create(createCareerDto);
  }
}
