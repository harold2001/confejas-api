import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import {
  AppConfiguration,
  DatabaseConfiguration,
} from '@infrastructure/config/configuration.interface';

const postgresConfig = (configService: ConfigService): TypeOrmModuleOptions => {
  const appConfig = configService.get<AppConfiguration>('app');
  const dbConfig = configService.get<DatabaseConfiguration>('database');

  console.log('dbConfig', dbConfig);

  return <TypeOrmModuleOptions>{
    schema: 'public',
    applicationName: appConfig.name,
    connectTimeoutMS: 10000,
    type: 'postgres',
    synchronize: true,
    database: dbConfig.dbName,
    host: dbConfig.host,
    port: dbConfig.port,
    username: dbConfig.username,
    password: dbConfig.dbPassword,
    autoLoadEntities: true,
    entities: [],
    // entities: [__dirname + '/../../modules/**/entities/*.entity{.ts,.js}'],
    migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
    // ssl: {
    //   rejectUnauthorized: false,
    // },
    ssl: false,
  };
};

export const typeormAsyncConfig: TypeOrmModuleAsyncOptions = {
  useFactory: (configService: ConfigService) => postgresConfig(configService),
  inject: [ConfigService],
};
