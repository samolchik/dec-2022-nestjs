import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { BearerStrategy } from './bearer.strategy';
import { UserService } from '../user/user.service';

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: 'bearer',
      property: 'user',
      session: false,
    }),
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      useFactory: async () => ({
        secret: process.env.JWT_SECRET_KEY,
        signOptions: {
          expiresIn: process.env.JWT_SECRET_TTL,
        },
        verifyOptions: {
          clockTolerance: 60,
          maxAge: process.env.JWT_SECRET_TTL,
        },
      }),
    }),
    forwardRef(() => UserModule),
  ],
  providers: [AuthService, BearerStrategy, UserService],
  exports: [PassportModule, AuthService],
})
export class AuthModule {}
