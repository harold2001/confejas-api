// import { ConfigModule } from '@nestjs/config';
// import { Logger, Module } from '@nestjs/common';
// import { Seeder } from './seeder';
// import { UserSeedModule } from './user/user-seed.module';
// import { validationSchema } from '../../config/validation';
// import configuration from '../../config/configuration';
// import { RoleSeedModule } from '@infrastructure/database/seeders/role/role-seed.module';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { typeormAsyncConfig } from '../typeorm';
// import { DocumentTypeSeedModule } from './document-type/document-type-seed.module';
// import { DispatchTypeSeedModule } from './dispatch-type/dispatch-type-seed.module';
// import { DispatchTypeRepository } from '@app/modules/dispatch-type/dispatch-type.repository';
// import { DispatchType } from '@app/modules/dispatch-type/entities/dispatch-type.entity';

// @Module({
//   imports: [
//     ConfigModule.forRoot({
//       envFilePath: '.env',
//       isGlobal: true,
//       load: [configuration],
//       validationSchema: validationSchema,
//     }),
//     TypeOrmModule.forRootAsync(typeormAsyncConfig),
//     TypeOrmModule.forFeature([DispatchType]),
//     UserSeedModule,
//     RoleSeedModule,
//     DocumentTypeSeedModule,
//     DispatchTypeSeedModule,
//   ],
//   providers: [Seeder, Logger, DispatchTypeRepository],
// })
// export class SeederModule {}
