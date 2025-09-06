import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-users.dto";
import { GetUsersDto } from "./dto/get-users.dto";
import { UserRepository } from "./users.repository";


@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository
  ) {}

  async create(data: CreateUserDto) {
    return await this.userRepository.create({
      name: data.name,
      email: data.email,
      role: data.role,
      isActive: data.isActive
    });
  }

  async findAll(query: GetUsersDto) {
    return await this.userRepository.findAll({
      page: query.page,
      pageSize: query.pageSize,
      search: query.search,
      role: query.role,
      isActive: query.isActive
    });
  }
  
  async findOne(id: string) {
    const user = await this.userRepository.findOne(id);

    if(!user || user === undefined) {
      throw new NotFoundException("User not found!");
    }

    return user;
  }

  async update() {

  }

  async delete() {

  }
}