import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { InjectRedisClient, RedisClient } from '@webeleon/nestjs-redis';

@Injectable()
export class LogoutGuard implements CanActivate {
  constructor(@InjectRedisClient() private redisClient: RedisClient) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    if (request.headers && request.headers.authorization) {
      const extractToken = request.headers.authorization.split(' ');
      if (extractToken[0] == 'Bearer' && extractToken[1] != '') {
        const jwtToken = extractToken[1];
        if (!(await this.redisClient.exists(jwtToken))) {
          return false;
        } else {
          await this.redisClient.del(jwtToken);

          return true;
        }
      }
    }
    return false;
  }
}