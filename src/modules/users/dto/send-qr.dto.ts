import { IsArray, IsUUID } from 'class-validator';

export class SendQrDto {
  @IsArray()
  @IsUUID('4', { each: true })
  userIds: string[];
}
