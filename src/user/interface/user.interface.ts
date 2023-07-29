import { ApiProperty } from '@nestjs/swagger';

export class PublicUserData {
  @ApiProperty()
  id: number;

  @ApiProperty()
  userName: string;

  @ApiProperty()
  age: number;

  @ApiProperty()
  email: string;
}
