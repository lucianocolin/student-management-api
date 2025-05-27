import { Injectable } from '@nestjs/common';
import { SubjectResponseDto } from '../dto/subject-response.dto';
import { Subject } from '../../domain/subject.domain';

@Injectable()
export class SubjectMapper {
  fromSubjectToSubjectResponseDto(subject: Subject): SubjectResponseDto {
    const { id, name, career } = subject;

    return new SubjectResponseDto({
      id,
      name,
      career,
    });
  }
}
