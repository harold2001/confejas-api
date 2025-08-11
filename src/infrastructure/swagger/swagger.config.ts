import { DocumentBuilder } from '@nestjs/swagger';
import { AppConfiguration } from '../config/configuration.interface';

export default class SwaggerConfig {
  static getSwaggerConfig(config: AppConfiguration) {
    return new DocumentBuilder()
      .setTitle(config.name)
      .setDescription('Description of the App')
      .setVersion(config.version)
      .addTag('App tag')
      .build();
  }
}
