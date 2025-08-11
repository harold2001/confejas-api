import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeormAsyncConfig } from './infrastructure/database/typeorm';
import { DBConnectionService } from './core/abstracts/db-connection.service';
import { ConnectionService } from './infrastructure/database/typeorm/connection.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { validationSchema } from './infrastructure/config/validation';
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
  ],
  controllers: [AppController],
  providers: [
    Logger,
    {
      provide: DBConnectionService,
      useClass: ConnectionService,
    },
    AppService,
  ],
})
export class AppModule {}
