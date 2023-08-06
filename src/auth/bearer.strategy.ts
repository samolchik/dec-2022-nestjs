import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-http-bearer';
import { ExtractJwt } from 'passport-jwt';

import { User } from '../user/user.entity';
import { AuthService } from './auth.service';
import { InjectRedisClient, RedisClient } from '@webeleon/nestjs-redis';

@Injectable()
export class BearerStrategy extends PassportStrategy(Strategy, 'bearer') {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
    @InjectRedisClient() readonly redisClient: RedisClient,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET_KEY || 'Secret',
    });
  }

  async validate(token: string): Promise<User> {
    let user = null;
    try {
      if (!(await this.redisClient.exists(token))) {
        throw new UnauthorizedException();
      }

      await this.jwtService.verifyAsync(token);
      const decodeToken: any = this.jwtService.decode(token);
      user = await this.authService.validateUser(decodeToken);
    } catch (e) {
      console.log(
        new Date().toISOString(),
        ' [JWT USER VERIFY ERROR] ',
        JSON.stringify(e),
        ' [TOKEN] ',
        token,
      );
      throw new UnauthorizedException();
    }

    return user;
  }
}
