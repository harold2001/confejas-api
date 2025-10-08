import { PartialType } from '@nestjs/swagger';
import { CreateUserRoomDto } from './create-user-room.dto';

export class UpdateUserRoomDto extends PartialType(CreateUserRoomDto) {}
