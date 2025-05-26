export class CareerResponseDto {
  id: string;
  name: string;

  constructor(data: CareerResponseDto) {
    Object.assign(this, data);
  }
}
