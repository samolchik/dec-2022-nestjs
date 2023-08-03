import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserCreateDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';
import { AuthService } from '../auth/auth.service';
import { PublicUserInfoDto } from '../common/query/user.query.dto';
import { paginateRawAndEntities } from 'nestjs-typeorm-paginate';
import { PublicUserData } from './interface/user.interface';
import { PaginatedDto } from '../common/pagination/response';
import { UserLoginDto, UserLoginSocialDto } from './dto/user.login.dto';
import { OAuth2Client } from 'google-auth-library';
import * as process from 'process';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly authService: AuthService,
  ) {}

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

  async getAllUsers(
    query: PublicUserInfoDto,
  ): Promise<PaginatedDto<PublicUserData>> {
    query.sort = query.sort || 'id';
    query.order = query.order || 'ASC';

    const options = {
      page: query.page || 1,
      limit: query.limit || 2,
    };

    const queryBuilder = this.userRepository
      .createQueryBuilder('users')
      .select('id, email, age, "userName"');

    if (query.search) {
      queryBuilder.where('"userName" IN(:...search)', {
        search: query.search.split(','),
      });
    }

    queryBuilder.orderBy(`"${query.sort}"`, query.order as 'ASC' | 'DESC');

    const [pagination, rawResults] = await paginateRawAndEntities(
      queryBuilder,
      options,
    );

    return {
      page: pagination.meta.currentPage,
      pages: pagination.meta.totalPages,
      countItem: pagination.meta.itemCount,
      entities: rawResults as [PublicUserData],
    };
  }

  async getUserById(userId: string): Promise<PublicUserData> {
    const findUser = await this.userRepository.findOne({
      where: { id: +userId },
    });

    if (!findUser) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return findUser;
  }

  async createUser(data: UserCreateDto) {
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
    data: UserCreateDto,
  ): Promise<UserCreateDto> {
    const findUser = await this.userRepository.findOne({
      where: { id: +userId },
    });

    if (!findUser) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    if (data.userName !== undefined) {
      findUser.userName = data.userName;
      console.log(data.userName);
      console.log(findUser.userName);
    } else {
      throw new HttpException(
        'userName is not defined for the user',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (data.age) {
      findUser.age = data.age;
    }

    if (data.email) {
      findUser.email = data.email;
    }

    if (data.password) {
      findUser.password = await this.getHash(data.password);
    }

    const updateUser = await this.userRepository.save(findUser);

    return updateUser;
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
