import { Subject } from 'src/modules/subject/domain/subject.domain';

export class CareerResponseDto {
  id: string;
  name: string;
  subjects: Subject[];

  constructor(data: CareerResponseDto) {
    Object.assign(this, data);
  }
}
