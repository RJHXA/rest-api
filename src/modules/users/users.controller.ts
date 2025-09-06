import { Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { UserService } from "./users.service";

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService
  ) {}

  @Post()
  async create() {}
  
  @Get()
  async findAll() {

  }

  @Get(':id')
  async findOne(@Param('id') userId: string) {
    
  }

  @Patch(':id')
  async update() {}

  @Delete(':id')
  async delete() {}
}