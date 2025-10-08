import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserRoomsService } from './user-rooms.service';
import { CreateUserRoomDto } from './dto/create-user-room.dto';
import { UpdateUserRoomDto } from './dto/update-user-room.dto';

@Controller('user-rooms')
export class UserRoomsController {
  constructor(private readonly userRoomsService: UserRoomsService) {}

  @Post()
  create(@Body() createUserRoomDto: CreateUserRoomDto) {
    return this.userRoomsService.create(createUserRoomDto);
  }

  @Get()
  findAll() {
    return this.userRoomsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userRoomsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserRoomDto: UpdateUserRoomDto,
  ) {
    return this.userRoomsService.update(id, updateUserRoomDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userRoomsService.remove(id);
  }
}
