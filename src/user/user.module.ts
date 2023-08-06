import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { AuthModule } from '../auth/auth.module';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { RedisModule } from '@webeleon/nestjs-redis';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    AuthModule,
    RedisModule.forRoot({
      url: 'redis://localhost:6379',
    }),
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [],
})
export class UserModule {}
