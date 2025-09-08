import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-users.dto';
import { GetUsersDto } from './dto/get-users.dto';
import { UpdateUserDto } from './dto/update-users.dto';
import { UserService } from './users.service';

@Controller('users')
@ApiTags('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() bodyData: CreateUserDto) {
    return await this.userService.create(bodyData);
  }

  @Get()
  async findAll(@Query() query: GetUsersDto) {
    return await this.userService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.userService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() bodyData: UpdateUserDto) {
    return await this.userService.update(id, bodyData);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.userService.delete(id);
  }
}
