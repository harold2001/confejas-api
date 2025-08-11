import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectSendGrid, SendGridService } from '@ntegral/nestjs-sendgrid';
import { EmailConfiguration } from '@infrastructure/config/configuration.interface';

@Injectable()
export class EmailService {
  private readonly from: { email: string; name: string };
  private readonly emailConfig: EmailConfiguration;

  constructor(
    @InjectSendGrid() private readonly sendGridService: SendGridService,
    private readonly configService: ConfigService,
  ) {
    this.emailConfig = this.configService.get<EmailConfiguration>('email');
    const { fromEmail, fromName } = this.emailConfig;
    this.from = {
      email: fromEmail,
      name: fromName,
    };
  }

  // async sendEmailWithPDF(
  //   to: string,
  //   base64file: string,
  //   subject: string,
  //   filename = 'document.pdf',
  //   bcc: string[] = [],
  //   replyTo: string | null = null,
  // ) {
  //   const type = 'application/pdf';

  //   if (!base64file) {
  //     throw new InternalServerErrorException('Argument base64file is missing');
  //   }

  //   if (!to) {
  //     throw new InternalServerErrorException('Argument to is missing');
  //   }

  //   if (!subject) {
  //     throw new InternalServerErrorException('Argument subject is missing');
  //   }

  //   if (!Array.isArray(bcc)) {
  //     throw new InternalServerErrorException('Argument bcc should be an array');
  //   }

  //   if (bcc.includes(to)) {
  //     const index = bcc.indexOf(to);
  //     bcc.splice(index, 1);
  //   }
  //   bcc = Array.from(new Set(bcc));

  //   const response = await this.sendGridService.send({
  //     personalizations: [
  //       {
  //         to: [{ email: to }],
  //       },
  //       ...bcc.map((email) => ({
  //         to: [{ email }],
  //       })),
  //     ],
  //     from: {
  //       name: this.emailConfig.fromName || 'Rotazio',
  //       email: this.emailConfig.fromEmail,
  //     },
  //     replyTo,
  //     subject,
  //     html: `<p>${subject}</p>`,
  //     attachments: [
  //       {
  //         content: base64file,
  //         filename,
  //         type,
  //         disposition: 'attachment',
  //       },
  //     ],
  //   });

  //   return response;
  // }

  // async newUser(user: User) {
  //   const url = `${process.env.WEB_APP_URL}/auth/change-password/${user.resetPasswordToken}`;

  //   const mail: MailDataRequired = {
  //     to: user.email,
  //     from: process.env.EMAIL_FROM_EMAIL,
  //     subject: `Welcome to ${process.env.APP_NAME}`,
  //     html: newUserTemplate(`${user.firstName} ${user.lastName}`, process.env.APP_NAME, url),
  //   };

  //   return await this.sendGridService.send(mail);
  // }

  // async resetPassword(user: User, token: string) {
  //   const { requestPasswordTemplate } = this.emailConfig;
  //   return await this.sendGridService.send({
  //     to: user.email,
  //     from: this.from,
  //     templateId: requestPasswordTemplate,
  //     dynamicTemplateData: {
  //       name: `${user.firstName} ${user.lastName}`,
  //       code: token,
  //     },
  //   });
  // }

  // async changePassword(user: User, token: string) {
  //   const appConfig = this.configService.get<AppConfiguration>('app');
  //   const url = `${appConfig.recoverPasswordUrl}/${token}`;

  //   const mail: MailDataRequired = {
  //     to: user.email,
  //     from: this.from.email,
  //     subject: `Password change request`,
  //     html: changePasswordTemplate(`${user.firstName} ${user.lastName}`, url),
  //   };

  //   return await this.sendGridService.send(mail);
  // }
}
