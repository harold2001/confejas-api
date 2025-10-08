import { IsUUID, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserRoomDto {
  @ApiProperty({
    description: 'User ID',
    example: 'uuid-string',
  })
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    description: 'Room ID',
    example: 'uuid-string',
  })
  @IsUUID()
  @IsNotEmpty()
  roomId: string;
}
