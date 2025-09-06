import { Injectable } from "@nestjs/common";
import Users from "../../database/mock-users.json";
import { UserRole } from "./dto/get-users.dto";

@Injectable()
export class UserRepository {
  private readonly users = Users;

  async create() {

  }

  async findAll({
    page = 1,
    pageSize = 10,
    search,
    role,
    isActive
  }: {
    page?: number;
    pageSize?: number;
    search?: string;
    role?: UserRole;
    isActive?: boolean;
  }) {
    let filtered = this.users;
    
    if(search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(q) ||
          user.email.toLowerCase().includes(q),
      );
    }

    if (role) {
      filtered = filtered.filter((user) => user.role === role);
    }

    if (isActive !== undefined) {
      filtered = filtered.filter((user) => user.is_active === isActive);
    }

    const total = filtered.length;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const data = filtered.slice(start, end);

    return {
      values: data,
      pagination: {
        total,
        page: page,
        pageSize: pageSize,
        totalPages: Math.ceil(total / pageSize),
      }
    }
  }
  
  async findOne(id: string) {
    return this.users.find(user => user.id === Number(id));
  }

  async update() {

  }

  async delete() {

  }
}