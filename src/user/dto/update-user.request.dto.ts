import { PickType } from '@nestjs/swagger';

import { UserBaseRequestDto } from './user-base.request.dto';

export class UpdateUserRequestDto extends PickType(UserBaseRequestDto, [
  'userName',
  'email',
  'age',
]) {}
