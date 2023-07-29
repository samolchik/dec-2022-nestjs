import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class PublicUserInfoDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  @IsEnum(['userName', 'age'])
  sort: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  order: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  search: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  status: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  page: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  limit: string;
}
