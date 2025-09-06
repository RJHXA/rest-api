import { Injectable } from "@nestjs/common";
import { promises as fs } from "fs";
import * as path from "path";
import { UserRole } from "./enum/role.enum";

const USERS_FILE = path.resolve(process.cwd(), "src/database/mock-users.json");

@Injectable()
export class UserRepository {
  private users: any[] = [];

  constructor() {
    this.loadUsers();
  }

  private async loadUsers() {
    const data = await fs.readFile(USERS_FILE, "utf-8");
    this.users = JSON.parse(data);
  }

  private async saveUsers() {
    await fs.writeFile(USERS_FILE, JSON.stringify(this.users, null, 2));
  }

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
    await this.saveUsers();

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

  async update({
    id,
    name,
    email,
    role,
    isActive
  }: {
    id: string;
    name?: string;
    email?: string;
    role?: UserRole;
    isActive?: boolean;
  }) {
    const index = this.users.findIndex(u => u.id === Number(id));

    const updatedUser = {
      ...this.users[index],
      name: name ?? this.users[index].name,
      email: email ?? this.users[index].email,
      role: role ?? this.users[index].role,
      is_active: isActive ?? this.users[index].is_active,
    };

    this.users[index] = updatedUser;
    await this.saveUsers();

    return updatedUser;
  }

  async delete(id: string) {
    const index = this.users.findIndex(u => u.id === Number(id));

    this.users.splice(index, 1);
    await this.saveUsers();
  }

  async findOneByEmail(email: string) {
    const lowerEmail = email.toLowerCase();
    const users = this.users.filter(
      (user) => user.email.toLowerCase().includes(lowerEmail),
    );

    return users;
  }
}