import { IsNotEmpty, IsUUID } from 'class-validator';

export class AssignRoomDto {
  @IsNotEmpty()
  @IsUUID()
  roomId: string;
}
