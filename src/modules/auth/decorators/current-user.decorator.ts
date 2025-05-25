import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../domain/user.domain';

export const CurrentUser = createParamDecorator((_, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const user: User = request['user'];

  return user;
});
