import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { CarClassEnum } from '../../enum/car-class.enum';

export class CarBaseRequestDto {
  @IsString()
  @IsNotEmpty()
  brand: string;

  @IsNumber()
  @Min(1990)
  @Max(new Date().getFullYear())
  age: number;

  @IsString()
  @IsNotEmpty()
  model: string;

  @IsEnum(CarClassEnum)
  @IsNotEmpty()
  class: CarClassEnum;
}
