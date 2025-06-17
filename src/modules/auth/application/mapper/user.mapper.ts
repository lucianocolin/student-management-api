import { Injectable } from '@nestjs/common';
import { User } from '../../domain/user.domain';
import { UserResponseDto } from '../dto/user-response.dto';

@Injectable()
export class UserMapper {
  fromUserToUserResponseDto(user: User): UserResponseDto {
    const { id, fullName, email, phoneNumber, roles, studentId, isApproved } =
      user;

    return new UserResponseDto({
      id,
      fullName,
      email,
      phoneNumber,
      roles,
      studentId,
      isApproved,
    });
  }
}
