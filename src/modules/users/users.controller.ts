import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from '@app/core/dto/pagination.dto';
import { FilterUserDto } from './dto/filter-user.dto';
import { MarkAsArrivedDto } from './dto/mark-as-arrived.dto';
import { PermutaExistingUserDto, PermutaUserDto } from './dto/permuta-user.dto';
import { VerifyAttendanceDto } from './dto/verify-attendance.dto';
import { SendQrDto } from './dto/send-qr.dto';
import { Roles } from '@app/core/decorators/roles.decorator';
import { AppRole } from '@app/core/enums/roles';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get('statistics')
  getStatistics() {
    return this.usersService.getStatistics();
  }

  @Roles(AppRole.Admin, AppRole.Staff)
  @Get('for-room-assignment')
  getUsersForRoomAssignment() {
    return this.usersService.getUsersForRoomAssignment();
  }

  @Post('filter')
  findAllPaginated(
    @Body() body: { pagination: PaginationDto; filters: FilterUserDto },
  ) {
    return this.usersService.findAllPaginated(body.pagination, body.filters);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Get(':id/attendance-token')
  getAttendanceToken(@Param('id') id: string) {
    return this.usersService.getAttendanceToken(id);
  }

  @Put('/arrived/:id')
  markAsArrived(
    @Param('id') id: string,
    @Body() markAsArrivedDto: MarkAsArrivedDto,
  ) {
    return this.usersService.markAsArrived(id, markAsArrivedDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Roles(AppRole.Admin, AppRole.Staff)
  @Post('verify-attendance')
  verifyAttendance(@Body() verifyAttendanceDto: VerifyAttendanceDto) {
    return this.usersService.verifyAttendance(verifyAttendanceDto.token);
  }

  @Roles(AppRole.Admin)
  @Post('send-qr')
  sendQr(@Body() sendQrDto: SendQrDto) {
    return this.usersService.sendQr(sendQrDto.userIds);
  }

  @Post('permuta')
  permutaUser(@Body() permutaUserDto: PermutaUserDto | PermutaExistingUserDto) {
    return this.usersService.permutaUser(permutaUserDto);
  }

  @Roles(AppRole.Admin, AppRole.Staff)
  @Patch(':userId/room')
  assignRoom(
    @Param('userId') userId: string,
    @Body() body: { roomId: string },
  ) {
    return this.usersService.assignRoom(userId, body.roomId);
  }
}
