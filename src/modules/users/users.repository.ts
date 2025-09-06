import { Injectable } from "@nestjs/common";
import Users from "../../database/mock-users.json";
import { UserRole } from "./enum/role.enum";

@Injectable()
export class UserRepository {
  private readonly users = Users;

  async create({
    name,
    email,
    role,
    isActive
  }: {
    name: string;
    email: string;
    role: UserRole;
    isActive: boolean;
  }) {
    const lastUserId = this.users.length;

    const newUser = {
      id: lastUserId + 1,
      name,
      email,
      role,
      is_active: isActive,
      created_at: new Date().toISOString(),
    };

    this.users.push(newUser);

    return newUser;
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