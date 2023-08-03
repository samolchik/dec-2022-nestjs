import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class UserLoginDto {
  @ApiProperty()
  @IsString()
  // @Length()
  @IsNotEmpty()
  @Matches(/^\S*(?=\S{8,})(?=\S*[A-Z])(?=\S*[\d])\S*$/, {
    message: 'Password must contain min 8 items and 1 uppercase letter.',
  })
  password: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  email: string;
}

export class UserLoginSocialDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  accessToken: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  email: string;
}
