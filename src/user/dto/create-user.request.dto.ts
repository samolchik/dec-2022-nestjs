import { PickType } from '@nestjs/swagger';

import { UserBaseRequestDto } from './user-base.request.dto';

export class CreateUserRequestDto extends PickType(UserBaseRequestDto, [
  'userName',
  'age',
  'isActive',
  'password',
  'email',
]) {}
