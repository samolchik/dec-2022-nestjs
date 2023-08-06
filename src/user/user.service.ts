import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { AuthService } from '../auth/auth.service';
import { PublicUserInfoDto } from '../common/query/user.query.dto';
import { PublicUserData } from './interface/user.interface';
import { PaginatedDto } from '../common/pagination/response';
import { UserLoginDto, UserLoginSocialDto } from './dto/user.login.dto';
import { OAuth2Client } from 'google-auth-library';
import * as process from 'process';
import { UpdateUserRequestDto } from './dto/update-user.request.dto';
import { CreateUserRequestDto } from './dto/create-user.request.dto';
import { UserRepository } from './user.repository';
import { InjectRedisClient, RedisClient } from '@webeleon/nestjs-redis';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly authService: AuthService,
    @InjectRedisClient() readonly redisClient: RedisClient,
  ) {}

  async getAllUsers(
    query: PublicUserInfoDto,
  ): Promise<PaginatedDto<PublicUserData>> {
    return await this.userRepository.getAllUsers(query);
  }

  async login(data: UserLoginDto) {
    const findUser = await this.userRepository.findOne({
      where: {
        email: data.email,
      },
    });

    if (!findUser) {
      throw new HttpException(
        `Email or password is not correct`,
        HttpStatus.UNAUTHORIZED,
      );
    }

    if (await this.compareHash(data.password, findUser.password)) {
      const token = await this.signIn(findUser);
      this.redisClient.setEx(token, 10000, token);

      return { token };
    }
    throw new HttpException(
      `Email or password is not correct`,
      HttpStatus.UNAUTHORIZED,
    );
  }

  async loginSocial(data: UserLoginSocialDto) {
    try {
      const oAuthClient = new OAuth2Client(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
      );

      const result = await oAuthClient.verifyIdToken({
        idToken: data.accessToken,
      });

      console.log(result);

      const tokenPayload = result.getPayload();

      const token = await this.signIn({ id: tokenPayload.sub });

      return { token };
    } catch (e) {
      throw new HttpException(`Google auth failed`, HttpStatus.UNAUTHORIZED);
    }
  }

  async getUserById(userId: string): Promise<PublicUserData> {
    const findUser = await this.userRepository.findOne({
      where: { id: +userId },
      relations: { cars: true },
    });

    if (!findUser) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return findUser;
  }

  async createUser(data: CreateUserRequestDto) {
    const findUser = await this.userRepository.findOne({
      where: {
        email: data.email,
      },
    });

    if (findUser) {
      throw new HttpException(
        `User with this ${data.email} already exists!`,
        HttpStatus.BAD_REQUEST,
      );
    }

    data.password = await this.getHash(data.password);

    const newUser = this.userRepository.create(data);
    await this.userRepository.save(newUser);

    const token = await this.signIn(newUser);

    return { token };
  }

  async updateUserById(
    userId: string,
    data: UpdateUserRequestDto,
  ): Promise<User> {
    // const findUser = await this.userRepository.findOne({
    //   where: { id: +userId },
    // });
    await this.userRepository.update(
      { id: +userId },
      {
        userName: data.userName,
        age: data.age,
        email: data.email,
      },
    );
    return await this.userRepository.save(data);
  }

  async deleteUserById(userId: string): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id: +userId },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    await this.userRepository.remove(user);
  }

  async getHash(password: string) {
    return await bcrypt.hash(password, 7);
  }

  async signIn(user) {
    return await this.authService.signIn({
      id: user.id.toString(),
    });
  }

  async compareHash(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
