import { Career } from 'src/modules/career/domain/career.domain';

export class SubjectResponseDto {
  id?: string;
  name: string;
  career: Career;

  constructor(data: SubjectResponseDto) {
    Object.assign(this, data);
  }
}
