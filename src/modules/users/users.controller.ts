import { Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { GetUsersDto } from "./dto/get-users.dto";
import { UserService } from "./users.service";

@Controller('users')
@ApiTags('users')
export class UserController {
  constructor(
    private readonly userService: UserService
  ) {}

  @Post()
  async create() {}

  @Get()
  async findAll(@Query() query: GetUsersDto) {
    return await this.userService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.userService.findOne(id);
  }

  @Patch(':id')
  async update() {}

  @Delete(':id')
  async delete() {}
}