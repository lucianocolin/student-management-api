import { CreateSubjectDto } from '../../application/dto/create-subject.dto';
import { SubjectResponseDto } from '../../application/dto/subject-response.dto';

export const SUBJECT_SERVICE_KEY = 'SUBJECT_SERVICE';

export interface ISubjectService {
  getAll(): Promise<SubjectResponseDto[]>;
  getOneById(id: string): Promise<SubjectResponseDto>;
  create(createSubjectDto: CreateSubjectDto): Promise<SubjectResponseDto>;
}
