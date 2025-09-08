import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-users.dto';
import { GetUsersDto } from './dto/get-users.dto';
import { UpdateUserDto } from './dto/update-users.dto';
import { UserRepository } from './users.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(data: CreateUserDto) {
    const userEmailExist = await this.userRepository.findOneByEmail(data.email);

    if (userEmailExist.length > 0) {
      throw new BadRequestException('User with email already exist');
    }

    return await this.userRepository.create({
      name: data.name,
      email: data.email,
      role: data.role,
      isActive: data.isActive,
    });
  }

  async findAll(query: GetUsersDto) {
    return await this.userRepository.findAll({
      page: Number(query.page),
      page_size: Number(query.page_size),
      q: query.q,
      role: query.role,
      is_active: query.is_active,
      order: query.order,
    });
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOne(id);

    if (!user || user === undefined) {
      throw new NotFoundException('User not found!');
    }

    return user;
  }

  async update(id: string, data: UpdateUserDto) {
    await this.findOne(id);

    return await this.userRepository.update({
      id,
      name: data.name,
      email: data.email,
      role: data.role,
      isActive: data.isActive,
    });
  }

  async delete(id: string) {
    await this.findOne(id);

    await this.userRepository.delete(id);

    return {
      message: 'User Deleted with Success!',
    };
  }
}
