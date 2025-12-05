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

  // @Public()
  // @Post('test-email')
  // testEmail() {
  //   return this.usersService.sendQr();
  // }
}
