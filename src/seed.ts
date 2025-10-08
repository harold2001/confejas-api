import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Seeder } from '@infrastructure/database/seeders/seeder';
import { SeederModule } from '@infrastructure/database/seeders/seeder.module';

async function bootstrap() {
  console.log('🌱 Starting database seeding...');

  const context = await NestFactory.createApplicationContext(SeederModule, {
    logger: ['log', 'error', 'warn', 'debug'],
  });

  const logger = context.get(Logger);
  const seeder = context.get(Seeder);

  try {
    await seeder.seed();
    logger.log('✅ Seeding complete!');
  } catch (err) {
    logger.error('❌ Seeding failed!', err.stack);
    throw err;
  } finally {
    await context.close();
  }
}

bootstrap().catch((error) => {
  console.error('❌ Fatal seeding error:', error);
  process.exit(1);
});
