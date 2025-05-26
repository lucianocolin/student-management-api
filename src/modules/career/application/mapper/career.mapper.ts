import { Career } from '../../domain/career.domain';
import { CareerResponseDto } from '../dto/career-response.dto';

export class CareerMapper {
  fromCareerToCareerResponseDto(career: Career): CareerResponseDto {
    const { id, name } = career;

    return new CareerResponseDto({
      id,
      name,
    });
  }
}
