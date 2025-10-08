import { Module } from '@nestjs/common';
import { QrService } from './qr.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [QrService, JwtService],
  exports: [QrService],
})
export class QrModule {}
