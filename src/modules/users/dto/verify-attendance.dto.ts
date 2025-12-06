import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyAttendanceDto {
  @IsNotEmpty()
  @IsString()
  token: string;
}
