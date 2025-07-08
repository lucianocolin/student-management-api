import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';

export class VehicleTypeDto {
  @IsBoolean()
  IsPrimary: boolean;

  @IsString()
  Name: string;
}

export class ManufacturerDto {
  @IsString()
  Country: string;

  @IsString()
  Mfr_CommonName: string;

  @IsInt()
  Mfr_ID: number;

  @IsString()
  Mfr_Name: string;

  @IsArray()
  @Type(() => VehicleTypeDto)
  VehicleTypes: VehicleTypeDto[];
}

export class ManufacturersExternalApiResponseDto {
  @IsInt()
  Count: number;

  @IsString()
  Message: string;

  @IsOptional()
  SearchCriteria: string | null;

  @IsArray()
  @Type(() => ManufacturerDto)
  Results: ManufacturerDto[];
}
