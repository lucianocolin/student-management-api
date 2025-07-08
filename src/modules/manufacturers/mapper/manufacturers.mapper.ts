import { Injectable } from '@nestjs/common';
import { ManufacturerDto } from '../dto/manufacturers-api-response.dto';
import { ManufacturersResponseDto } from '../dto/manufacturers-response.dto';

@Injectable()
export class ManufacturersMapper {
  fromApiManufacturersToManufacturersResponseDto(
    manufacturerDto: ManufacturerDto,
  ): ManufacturersResponseDto {
    const { Mfr_CommonName, Mfr_Name, Country, VehicleTypes } = manufacturerDto;
    const vehicleNames = VehicleTypes.map((vehicle) => {
      return {
        name: vehicle.Name,
      };
    });

    return new ManufacturersResponseDto({
      commonName: Mfr_CommonName,
      legalName: Mfr_Name,
      vehicleTypes: vehicleNames,
      country: Country,
    });
  }
}
