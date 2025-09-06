import { Injectable } from "@nestjs/common";
import { UserRepository } from "./users.repository";


@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository
  ) {}

  async create() {

  }

  async findAll() {

  }
  
  async findOne() {
    
  }

  async update() {

  }

  async delete() {

  }
}