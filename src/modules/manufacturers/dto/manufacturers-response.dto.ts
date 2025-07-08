export class ManufacturersResponseDto {
  country: string;
  commonName: string;
  legalName: string;
  vehicleTypes: VehicleNames[];

  constructor(data: ManufacturersResponseDto) {
    Object.assign(this, data);
  }
}

class VehicleNames {
  name: string;
}
