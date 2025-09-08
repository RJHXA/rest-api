import { Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import * as path from 'path';
import { Config } from '../../config/config';
import { UserRole } from './enum/role.enum';
import { User } from './interfaces/user.interface';

@Injectable()
export class UserRepository {
  private users: User[] = [];
  private USERS_FILE: string;

  constructor() {
    this.USERS_FILE = path.resolve(
      Config.USERS_FILE || 'src/database/mock-users.json',
    );
    this.loadUsers();
  }

  private async loadUsers() {
    const data = await fs.readFile(this.USERS_FILE, 'utf-8');
    this.users = JSON.parse(data);
  }

  private async saveUsers() {
    await fs.writeFile(this.USERS_FILE, JSON.stringify(this.users, null, 2));
  }

  async create({
    name,
    email,
    role,
    isActive,
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
    page_size = 10,
    q,
    role,
    is_active,
  }: {
    page?: number;
    page_size?: number;
    q?: string;
    role?: UserRole;
    is_active?: boolean;
  }) {
    let filtered = this.users;

    if (q) {
      const search = q.toLowerCase();
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(search) ||
          user.email.toLowerCase().includes(search),
      );
    }

    if (role) {
      filtered = filtered.filter((user) => user.role === role);
    }

    if (is_active !== undefined) {
      filtered = filtered.filter((user) => user.is_active === is_active);
    }

    const total = filtered.length;
    const start = (page - 1) * page_size;
    const end = start + page_size;
    const data = filtered.slice(start, end);

    return {
      values: data,
      pagination: {
        total,
        page: page,
        pageSize: page_size,
        totalPages: Math.ceil(total / page_size),
      },
    };
  }

  async findOne(id: string) {
    return this.users.find((user) => user.id === Number(id));
  }

  async update({
    id,
    name,
    email,
    role,
    isActive,
  }: {
    id: string;
    name?: string;
    email?: string;
    role?: UserRole;
    isActive?: boolean;
  }) {
    const index = this.users.findIndex((u) => u.id === Number(id));

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
    const index = this.users.findIndex((u) => u.id === Number(id));

    this.users.splice(index, 1);
    await this.saveUsers();
  }

  async findOneByEmail(email: string) {
    const lowerEmail = email.toLowerCase();
    const users = this.users.filter((user) =>
      user.email.toLowerCase().includes(lowerEmail),
    );

    return users;
  }
}
