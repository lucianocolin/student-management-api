import { Subject } from '../subject.domain';

export const SUBJECT_REPOSITORY_KEY = 'SUBJECT_REPOSITORY';

export interface ISubjectRepository {
  findAll(): Promise<Subject[]>;
  findOneByName(name: string): Promise<Subject>;
  create(subject: Subject): Promise<Subject>;
}
