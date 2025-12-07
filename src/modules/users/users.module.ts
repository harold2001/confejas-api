import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from '@app/modules/users/entities/user.entity';
import { UserRepository } from './repositories/users.repository';
import { RolesModule } from '../roles/roles.module';
import { QrModule } from '@app/infrastructure/qr/qr.module';
import { EmailModule } from '@app/infrastructure/email/email.module';
import { StakesModule } from '../stakes/stakes.module';
import { CompaniesModule } from '../companies/companies.module';
import { WebsocketModule } from '@app/infrastructure/websocket/websocket.module';
import { UserRoomsModule } from '../user-rooms/user-rooms.module';
import { JwtService } from '@nestjs/jwt';
import { forwardRef } from '@nestjs/common';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    RolesModule,
    QrModule,
    EmailModule,
    StakesModule,
    CompaniesModule,
    WebsocketModule,
    forwardRef(() => UserRoomsModule),
  ],
  controllers: [UsersController],
  providers: [UsersService, UserRepository, JwtService],
  exports: [UserRepository],
})
export class UsersModule {}
