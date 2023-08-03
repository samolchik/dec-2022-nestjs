import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { UserCreateDto } from './dto/user.dto';
import { AuthGuard } from '@nestjs/passport';
import { PublicUserInfoDto } from '../common/query/user.query.dto';
import { PublicUserData } from './interface/user.interface';
import {
  ApiPaginatedResponse,
  PaginatedDto,
} from '../common/pagination/response';
import { UserLoginDto, UserLoginSocialDto } from './dto/user.login.dto';

@ApiTags('Users')
@ApiExtraModels(PublicUserData, PaginatedDto)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Get all users' })
  @UseGuards(AuthGuard())
  @ApiPaginatedResponse('entities', PublicUserData)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get all users with pagination',
    type: PaginatedDto,
  })
  @Get('list')
  async getAllUsers(@Query() query: PublicUserInfoDto) {
    return this.userService.getAllUsers(query);
  }

  @ApiOperation({ summary: 'Get user by id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get user by ID',
    type: PublicUserData,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found' })
  @Get(':userId')
  async getUserById(@Param('userId') userId: string) {
    return this.userService.getUserById(userId);
  }

  @ApiOperation({ summary: 'Login user' })
  @Post('login')
  async login(@Req() req: any, @Body() body: UserLoginDto) {
    return this.userService.login(body);
  }

  // @Post('social/login')
  // async loginUserSocial(@Req() req: any, @Body() body: UserLoginSocialDto) {
  //   return this.userService.loginSocial(body);
  // }

  @ApiOperation({ summary: 'Create new user' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Create new user',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'User with this email already exists',
  })
  @Post('create')
  async createUser(@Req() req: any, @Body() body: UserCreateDto) {
    return this.userService.createUser(body);
  }

  @ApiOperation({ summary: 'Update user' })
  @UseGuards(AuthGuard())
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Update user by ID',
    type: PublicUserData,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found' })
  @Patch(':userId')
  async updateUser(@Param('userId') userId: string, data: UserCreateDto) {
    return this.userService.updateUserById(userId, data);
  }

  @ApiOperation({ summary: 'Delete user' })
  @UseGuards(AuthGuard())
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Delete user by ID',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found' })
  @Delete(':userId')
  async deleteUser(@Param('userId') userId: string) {
    await this.userService.deleteUserById(userId);
    return {
      statusCode: HttpStatus.OK,
      message: 'User deleted successfully',
    };
  }
}
