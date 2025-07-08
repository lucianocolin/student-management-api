import { Controller, Get } from '@nestjs/common';
import { ManufacturersService } from './manufacturers.service';
import { ManufacturersResponseDto } from './dto/manufacturers-response.dto';

@Controller('manufacturers')
export class ManufacturersController {
  constructor(private readonly manufacturersService: ManufacturersService) {}

  @Get()
  async getAll(): Promise<ManufacturersResponseDto[]> {
    return await this.manufacturersService.getAll();
  }
}
