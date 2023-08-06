import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmConfiguration } from './config/database/type-orm-configuration';
import { AuthModule } from './auth/auth.module';
import { AnimalModule } from './animal/animal.module';
import { CarModule } from './car/car.module';
import { RedisModule } from '@webeleon/nestjs-redis';

@Module({
  imports: [
    TypeOrmModule.forRootAsync(TypeOrmConfiguration.config),
    UserModule,
    AuthModule,
    AnimalModule,
    CarModule,
    RedisModule.forRoot({
      url: 'redis://0.0.0.0:6379',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
