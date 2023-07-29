import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { Repository } from 'typeorm';
import { JWTPayload } from './interface/auth.interface';
import { SignOptions } from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    public readonly userRepository: Repository<User>,
  ) {}

  async signIn(data: JWTPayload, signOptions?: SignOptions): Promise<string> {
    return this.jwtService.sign(data, { expiresIn: '1h' });
  }

  async validateUser(data: JWTPayload): Promise<User> {
    const user = await this.userRepository.findOne({
      where: {
        id: +data.id,
      },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }

  async verify(token: string): Promise<JWTPayload> {
    try {
      return await this.jwtService.verifyAsync(token);
    } catch (e) {
      console.log(new Date().toISOString(), token);
      throw new UnauthorizedException();
    }
  }
}
