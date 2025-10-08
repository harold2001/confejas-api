import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from '@app/modules/users/entities/user.entity';
import { UserRepository } from './repositories/users.repository';
import { RolesModule } from '../roles/roles.module';
import { QrModule } from '@app/infrastructure/qr/qr.module';
import { EmailModule } from '@app/infrastructure/email/email.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    RolesModule,
    QrModule,
    EmailModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, UserRepository],
  exports: [UserRepository],
})
export class UsersModule {}
