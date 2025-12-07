import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import {
  AppConfiguration,
  DatabaseConfiguration,
} from '@infrastructure/config/configuration.interface';
import { User } from '@app/modules/users/entities/user.entity';
import { Role } from '@app/modules/roles/entities/role.entity';
import { Room } from '@app/modules/rooms/entities/room.entity';
import { UserRoom } from '@app/modules/user-rooms/entities/user-room.entity';
import { Floor } from '@app/modules/floors/entities/floor.entity';
import { RoomType } from '@app/modules/room-types/entities/room-type.entity';
import { Building } from '@app/modules/buildings/entities/building.entity';
import { Stake } from '@app/modules/stakes/entities/stake.entity';

const postgresConfig = (configService: ConfigService): TypeOrmModuleOptions => {
  const appConfig = configService.get<AppConfiguration>('app');
  const dbConfig = configService.get<DatabaseConfiguration>('database');

  console.log('dbConfig', dbConfig);

  return <TypeOrmModuleOptions>{
    schema: 'public',
    applicationName: appConfig.name,
    connectTimeoutMS: 10000,
    type: 'postgres',
    synchronize: false,
    database: dbConfig.dbName,
    host: dbConfig.host,
    port: dbConfig.port,
    username: dbConfig.username,
    password: dbConfig.dbPassword,
    autoLoadEntities: true,
    entities: [User, Role, Room, UserRoom, Floor, RoomType, Building, Stake],
    // entities: [__dirname + '/../../modules/**/entities/*.entity{.ts,.js}'],
    migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
    ssl: {
      rejectUnauthorized: false,
    },
  };
};

export const typeormAsyncConfig: TypeOrmModuleAsyncOptions = {
  useFactory: (configService: ConfigService) => postgresConfig(configService),
  inject: [ConfigService],
};
