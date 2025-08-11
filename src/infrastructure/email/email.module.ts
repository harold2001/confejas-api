import { Module } from '@nestjs/common';
import { emailAsyncConfig } from './configuration';
import { EmailService } from './email.service';
import { SendGridModule } from '@ntegral/nestjs-sendgrid';

@Module({
  imports: [SendGridModule.forRootAsync(emailAsyncConfig)],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
