import * as dotenv from 'dotenv';
import * as process from 'process';

export class ConfigurationService {
  constructor(private env: { [key: string]: string }) {}
  public get(key: string) {
    return this.env[key];
  }
}

const environment: string = process.env.NODE_ENV ?? '';
dotenv.config({ path: `environments/${environment}.env` });

const ConfigurationServiceStatic = new ConfigurationService(process.env);

export { ConfigurationServiceStatic };
