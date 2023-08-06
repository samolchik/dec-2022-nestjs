import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmConfiguration } from './config/database/type-orm-configuration';
import { AuthModule } from './auth/auth.module';
import { AnimalModule } from './animal/animal.module';
import { CarModule } from './car/car.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync(TypeOrmConfiguration.config),
    UserModule,
    AuthModule,
    AnimalModule,
    CarModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
