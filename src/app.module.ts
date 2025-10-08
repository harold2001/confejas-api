import { Logger, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeormAsyncConfig } from './infrastructure/database/typeorm';
import { DBConnectionService } from './core/abstracts/db-connection.service';
import { ConnectionService } from './infrastructure/database/typeorm/connection.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { validationSchema } from './infrastructure/config/validation';
import { RolesModule } from './modules/roles/roles.module';
import { UsersModule } from './modules/users/users.module';
import { BuildingsModule } from './modules/buildings/buildings.module';
import { FloorsModule } from './modules/floors/floors.module';
import { RoomTypesModule } from './modules/room-types/room-types.module';
import { RoomsModule } from './modules/rooms/rooms.module';
import { UserRoomsModule } from './modules/user-rooms/user-rooms.module';
import { AuthModule } from './modules/auth/auth.module';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';
import { QrModule } from './infrastructure/qr/qr.module';
import { StakesModule } from './modules/stakes/stakes.module';
import configuration from './infrastructure/config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      load: [configuration],
      validationSchema: validationSchema,
    }),
    TypeOrmModule.forRootAsync(typeormAsyncConfig),
    RolesModule,
    UsersModule,
    BuildingsModule,
    FloorsModule,
    RoomTypesModule,
    RoomsModule,
    UserRoomsModule,
    AuthModule,
    QrModule,
    StakesModule,
  ],
  controllers: [AppController],
  providers: [
    Logger,
    {
      provide: DBConnectionService,
      useClass: ConnectionService,
    },
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
