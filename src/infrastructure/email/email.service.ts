import { Injectable } from '@nestjs/common';
import * as Brevo from '@getbrevo/brevo';

@Injectable()
export class EmailService {
  private readonly api: Brevo.TransactionalEmailsApi;

  constructor() {
    this.api = new Brevo.TransactionalEmailsApi();
    this.api.setApiKey(
      Brevo.TransactionalEmailsApiApiKeys.apiKey,
      process.env.BREVO_API_KEY,
    );
  }

  async sendQrEmail(to: string, qrBase64: string) {
    // Remove the data URL prefix to get just the base64 content
    const base64Content = qrBase64.replace(/^data:image\/png;base64,/, '');

    const email = new Brevo.SendSmtpEmail();
    email.to = [{ email: to }];
    email.sender = {
      name: 'ConfeJAS Lima Oeste',
      email: 'confejaslimaoeste@outlook.com',
    };
    email.subject = 'Tu código QR de acceso';

    // Don't use inline images - just provide download link
    email.htmlContent = `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">¡Bienvenido a ConfeJAS Lima Oeste! 🎉</h2>
        <p>Hola 👋,</p>
        <p>Tu código QR de acceso al evento está adjunto en este correo.</p>
        
        <div style="background-color: #e3f2fd; border-left: 4px solid #2196f3; padding: 15px; margin: 20px 0;">
          <p style="margin: 0; font-weight: bold;">📱 Cómo usar tu QR:</p>
          <ol style="margin: 10px 0; padding-left: 20px;">
            <li>Descarga la imagen adjunta llamada <strong>"mi-codigo-qr.png"</strong></li>
            <li>Guárdala en tu dispositivo móvil</li>
            <li>Preséntala al ingresar al evento</li>
          </ol>
        </div>

        <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0;">
          <p style="margin: 0; font-weight: bold;">⚠️ Importante:</p>
          <ul style="margin: 10px 0; padding-left: 20px;">
            <li>Este código QR es personal e intransferible</li>
            <li>No compartas este código con otras personas</li>
            <li>Guárdalo en un lugar seguro</li>
          </ul>
        </div>

        <p style="color: #666;">¡Nos vemos en el evento!</p>
        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;" />
        <p style="color: #999; font-size: 12px;">ConfeJAS Lima Oeste</p>
      </div>
    `;

    // Attach QR as downloadable file
    email.attachment = [
      {
        content: base64Content,
        name: 'mi-codigo-qr.png',
      },
    ];

    return await this.api.sendTransacEmail(email);
  }
}
