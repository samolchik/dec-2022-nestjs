import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';
import { PostgresqlConfigModule } from './config.module';
import { PostgresqlConfigService } from './configuration.service';
import { PostgresqlConfigServiceStatic } from './configuration.service.static';

export class TypeOrmConfiguration {
  static get config(): TypeOrmModuleAsyncOptions {
    return {
      imports: [PostgresqlConfigModule],
      useFactory: (configService: PostgresqlConfigService) => ({
        type: 'postgres',
        host: configService.host,
        port: configService.port,
        username: configService.user,
        password: configService.password,
        database: configService.database,
        synchronize: false,
        entities: [`${process.cwd()}/**/*.entity{.js, .ts}`],
        migrationsTableName: 'migrations',
      }),
      inject: [PostgresqlConfigService],
    };
  }
}

export class TypeOrmConfigurationStatic {
  static get staticConfig(): DataSourceOptions {
    return {
      type: 'postgres',
      host: PostgresqlConfigServiceStatic.host,
      port: PostgresqlConfigServiceStatic.port,
      username: PostgresqlConfigServiceStatic.user,
      password: PostgresqlConfigServiceStatic.password,
      database: PostgresqlConfigServiceStatic.database,
      synchronize: false,
      entities: ['src/**/*.entity.ts'],
      migrations: ['src/database/migrations/*.ts'],
      migrationsTableName: 'migrations',
    };
  }
}
