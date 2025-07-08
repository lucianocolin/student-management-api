import { HttpService } from '@nestjs/axios';
import { ConflictException, Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { ManufacturersExternalApiResponseDto } from './dto/manufacturers-api-response.dto';
import { ManufacturersResponseDto } from './dto/manufacturers-response.dto';
import { ManufacturersMapper } from './mapper/manufacturers.mapper';

@Injectable()
export class ManufacturersService {
  constructor(
    private readonly httpService: HttpService,
    private readonly manufacturersMapper: ManufacturersMapper,
  ) {}

  async getManufacturersData(): Promise<ManufacturersExternalApiResponseDto> {
    const url =
      'https://vpic.nhtsa.dot.gov/api/vehicles/getallmanufacturers?format=json';

    try {
      const response = await firstValueFrom(this.httpService.get(url));

      return response.data;
    } catch (error) {
      throw new ConflictException(error);
    }
  }

  async getAll(): Promise<ManufacturersResponseDto[]> {
    try {
      const apiManufacturersData = await this.getManufacturersData();

      const mappedManufacturers = apiManufacturersData.Results.map((result) => {
        return this.manufacturersMapper.fromApiManufacturersToManufacturersResponseDto(
          result,
        );
      });

      return mappedManufacturers;
    } catch (error) {
      throw new ConflictException(error);
    }
  }
}
