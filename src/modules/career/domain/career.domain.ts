import { Subject } from 'src/modules/subject/domain/subject.domain';

export class Career {
  id?: string;
  name: string;
  subjects?: Subject[];
}
