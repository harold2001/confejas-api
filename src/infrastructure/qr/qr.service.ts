import { Injectable } from '@nestjs/common';
import * as QRCode from 'qrcode';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class QrService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async generateUserQr(userId: string) {
    const token = this.jwtService.sign(
      { sub: userId },
      {
        secret: this.configService.get<string>('app.jwtSecret'),
        expiresIn: this.configService.get<string>('app.jwtBearerExpiration'),
      },
    );

    const attendanceUrl = `${this.configService.get<string>('web.url')}/attendance/verify?token=${token}`;

    const qrBase64 = await QRCode.toDataURL(attendanceUrl);

    return { qrBase64, attendanceUrl, token };
  }

  async generateQrFromUrl(url: string) {
    const qrBase64 = await QRCode.toDataURL(url);
    return { qrBase64 };
  }
}
