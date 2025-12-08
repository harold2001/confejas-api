import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Seeder } from '@infrastructure/database/seeders/seeder';
import { SeederModule } from '@infrastructure/database/seeders/seeder.module';
import { UsersSeedService } from '@infrastructure/database/seeders/users/users-seed.service';

async function bootstrap() {
  console.log('📥 Starting users import from CSV...');

  const context = await NestFactory.createApplicationContext(SeederModule, {
    logger: ['log', 'error', 'warn', 'debug'],
  });

  const logger = context.get(Logger);
  const usersSeedService = context.get(UsersSeedService);

  try {
    await usersSeedService.importUsers();
    logger.log('✅ Users import complete!');
  } catch (err) {
    logger.error('❌ Users import failed!', err.stack);
    throw err;
  } finally {
    await context.close();
  }
}

bootstrap().catch((error) => {
  console.error('❌ Fatal import error:', error);
  process.exit(1);
});
