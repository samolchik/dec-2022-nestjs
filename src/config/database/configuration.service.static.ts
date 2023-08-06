import { Injectable } from '@nestjs/common';

import { ConfigurationServiceStatic } from '../configuration.service-static';

@Injectable()
export class PostgresqlConfigServiceStatic {
  static get host(): string {
    return ConfigurationServiceStatic.get('POSTGRES_HOST');
  }

  static get port(): number {
    return +ConfigurationServiceStatic.get('POSTGRES_PORT');
  }

  static get user(): string {
    return ConfigurationServiceStatic.get('POSTGRES_USER');
  }

  static get password(): string {
    return ConfigurationServiceStatic.get('POSTGRES_PASSWORD');
  }

  static get database(): string {
    return ConfigurationServiceStatic.get('POSTGRES_DATABASE');
  }
}
