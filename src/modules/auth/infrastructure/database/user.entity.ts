import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { USER_NAME } from '../../domain/user.name';
import { USER_ROLES } from '../../application/enum/user-roles.enum';

@Entity(USER_NAME)
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  fullName: string;

  @Column({ type: 'text', unique: true })
  email: string;

  @Column({ type: 'text' })
  password: string;

  @Column({ type: 'text' })
  phoneNumber: string;

  @Column({
    type: 'text',
    array: true,
    enum: USER_ROLES,
    default: [USER_ROLES.USER],
  })
  roles: USER_ROLES[];
}
