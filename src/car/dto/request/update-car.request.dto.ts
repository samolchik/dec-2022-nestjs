import { PickType } from '@nestjs/swagger';

import { CarBaseRequestDto } from './car-base.request.dto';

export class UpdateCarRequestDto extends PickType(CarBaseRequestDto, ['age']) {}