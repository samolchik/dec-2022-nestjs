import { ApiOperation, ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class UserCreateDto {
  @ApiProperty({
    title: 'Username',
    pattern: '^[a-zA-Z]\\w{1,19}$',
    minLength: 1,
    maxLength: 10,
  })
  @IsString()
  @IsNotEmpty()
  userName: string;

  @ApiProperty({ title: 'Age', minLength: 1, maxLength: 99 })
  @IsNumber()
  @IsOptional()
  age: number;

  @ApiProperty({ title: 'Is active', readOnly: true })
  @IsBoolean()
  @IsOptional()
  isActive: boolean;

  @ApiProperty({
    title: 'Password',
    pattern: '^\\S*(?=\\S{8,})(?=\\S*[A-Z])(?=\\S*[\\d])\\S*$',
    minLength: 8,
    maxLength: 20,
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\S*(?=\S{8,})(?=\S*[A-Z])(?=\S*[\d])\S*$/, {
    message: 'Password must contain min 8 items and 1 uppercase letter.',
  })
  password: string;

  @ApiProperty({
    title: 'Email',
    pattern:
      '^([\\w\\-\\.]+)@((\\[([0-9]{1,3}\\.){3}[0-9]{1,3}\\])|(([\\w\\-]+\\.)+)([a-zA-Z]{2,4}))$',
  })
  @IsString()
  @IsNotEmpty()
  email: string;
}
