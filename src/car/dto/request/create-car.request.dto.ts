import { PickType } from '@nestjs/swagger';

import { CarBaseRequestDto } from './car-base.request.dto';

export class CreateCarRequestDto extends PickType(CarBaseRequestDto, [
  'brand',
  'age',
  'model',
  'class',
]) {}