import { ConfigModule } from '@nestjs/config';
import { Logger, Module } from '@nestjs/common';
import { Seeder } from './seeder';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeormAsyncConfig } from '../typeorm';
import { validationSchema } from '../../config/validation';
import configuration from '../../config/configuration';

// Entity imports
import { Role } from '@app/modules/roles/entities/role.entity';
import { User } from '@app/modules/users/entities/user.entity';
import { Building } from '@app/modules/buildings/entities/building.entity';
import { Floor } from '@app/modules/floors/entities/floor.entity';
import { Room } from '@app/modules/rooms/entities/room.entity';
import { RoomType } from '@app/modules/room-types/entities/room-type.entity';
import { UserRoom } from '@app/modules/user-rooms/entities/user-room.entity';
import { RoleSeedModule } from './roles/roles-seed.module';
import { BuildingSeedModule } from './buildings/buildings-seed.module';
import { RoomTypeSeedModule } from './room-types/room-types-seed.module';
import { FloorSeedModule } from './floors/floors-seed.module';
import { RoomSeedModule } from './rooms/rooms-seed.module';
import { UserSeedModule } from './users/users-seed.module';
import { UserRoomSeedModule } from './user-rooms/user-rooms-seed.module';
import { StakesSeedModule } from './stakes/stakes-seed.module';
import { Stake } from '@app/modules/stakes/entities/stake.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      load: [configuration],
      validationSchema: validationSchema,
    }),
    TypeOrmModule.forRootAsync(typeormAsyncConfig),
    TypeOrmModule.forFeature([
      Role,
      User,
      Building,
      Floor,
      Room,
      RoomType,
      UserRoom,
      Stake,
    ]),
    RoleSeedModule,
    BuildingSeedModule,
    RoomTypeSeedModule,
    FloorSeedModule,
    RoomSeedModule,
    UserSeedModule,
    UserRoomSeedModule,
    StakesSeedModule,
  ],
  providers: [Seeder, Logger],
  exports: [Seeder],
})
export class SeederModule {}
