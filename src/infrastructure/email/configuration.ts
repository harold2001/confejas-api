import { ConfigService } from '@nestjs/config';
import { EmailConfiguration } from '@infrastructure/config/configuration.interface';
import { SendGridModuleAsyncOptions, SendGridModuleOptions } from '@ntegral/nestjs-sendgrid';

export default class EmailConfig {
  static getEmailConfig(config: ConfigService): SendGridModuleOptions {
    const { sendGridApiKey } = config.get<EmailConfiguration>('email');

    return { apiKey: sendGridApiKey };
  }
}

export const emailAsyncConfig: SendGridModuleAsyncOptions = {
  useFactory: async (config: ConfigService) => EmailConfig.getEmailConfig(config),
  inject: [ConfigService],
};
