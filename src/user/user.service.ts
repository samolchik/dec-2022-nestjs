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

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly authService: AuthService,
  ) {}

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
    const user = await this.userRepository.findOne({
      where: { id: +userId },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  async createUser(data: UserCreateDto) {
    const user = await this.userRepository.findOne({
      where: {
        email: data.email,
      },
    });

    if (user) {
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
    const user = await this.userRepository.findOne({
      where: { id: +userId },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    if (data.userName !== undefined) {
      user.userName = data.userName;
      console.log(data.userName);
      console.log(user.userName);
    } else {
      throw new HttpException(
        'userName is not defined for the user',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (data.age) {
      user.age = data.age;
    }

    if (data.email) {
      user.email = data.email;
    }

    if (data.password) {
      user.password = await this.getHash(data.password);
    }

    const updateUser = await this.userRepository.save(user);

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
}
