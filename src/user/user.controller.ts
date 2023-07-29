import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { UserCreateDto } from './dto/user.dto';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('list')
  async getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Get(':userId')
  async getUserById(@Param('userId') userId: string) {
    return this.userService.getUserById(userId);
  }

  @Post('create')
  async createUser(@Req() req: any, @Body() body: UserCreateDto) {
    return this.userService.createUser(body);
  }

  @Patch(':userId')
  async updateUser(@Param('userId') userId: string, data: UserCreateDto) {
    return this.userService.updateUserById(userId, data);
  }

  @Delete(':userId')
  async deleteUser(@Param('userId') userId: string) {
    return this.userService.deleteUserById(userId);
  }
}
