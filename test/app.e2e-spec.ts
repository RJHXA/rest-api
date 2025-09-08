import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { CreateUserDto } from '../src/modules/users/dto/create-users.dto';
import { UpdateUserDto } from '../src/modules/users/dto/update-users.dto';
import { UserRole } from '../src/modules/users/enum/role.enum';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );
    await app.init();
  });

  it('/users (GET)', async () => {
    const { body } = await request(app.getHttpServer())
      .get('/users')
      .expect(200);

    expect(body.pagination.total).toBe(5);
  });

  it('/users (GET) with filter by page_size', async () => {
    const { body } = await request(app.getHttpServer())
      .get('/users?page_size=1')
      .expect(200);

    expect(body.pagination.total).toBe(5);
    expect(body.pagination.pageSize).toBe(1);
    expect(body.values[0]).toEqual({
      id: 1,
      name: 'Bruno Nogueira',
      email: 'bnogueira1@widgets.org',
      role: 'manager',
      is_active: true,
      created_at: '2024-05-26T17:11:48Z',
    });
  });

  it('bad request /users (GET) with filter by page_size invalid type', async () => {
    const { body } = await request(app.getHttpServer())
      .get('/users?page_size=error')
      .expect(400);

    expect(body).toEqual({
      message: [
        'page_size must not be greater than 50',
        'page_size must not be less than 1',
        'page_size must be a number conforming to the specified constraints',
      ],
      error: 'Bad Request',
      statusCode: 400,
    });
  });

  it('/users (GET) with filter by page_size and page', async () => {
    const { body } = await request(app.getHttpServer())
      .get('/users?page=2&page_size=1')
      .expect(200);

    expect(body.pagination.total).toBe(5);
    expect(body.pagination.pageSize).toBe(1);
    expect(body.values[0]).toEqual({
      id: 2,
      name: 'Felipe Ferraz',
      email: 'fferraz2@contoso.dev',
      role: 'analyst',
      is_active: true,
      created_at: '2025-02-28T21:24:25Z',
    });
  });

  it('bad request /users (GET) with filter by page_size and page invalid type', async () => {
    const { body } = await request(app.getHttpServer())
      .get('/users?page=error&page_size=error')
      .expect(400);

    expect(body).toEqual({
      message: [
        'page must not be less than 1',
        'page must be a number conforming to the specified constraints',
        'page_size must not be greater than 50',
        'page_size must not be less than 1',
        'page_size must be a number conforming to the specified constraints',
      ],
      error: 'Bad Request',
      statusCode: 400,
    });
  });

  it('/users (GET) with filter by role', async () => {
    const { body } = await request(app.getHttpServer())
      .get(`/users?role=${UserRole.ANALYST}`)
      .expect(200);

    expect(body.pagination.total).toBe(2);
    expect(body.values).toEqual([
      {
        id: 2,
        name: 'Felipe Ferraz',
        email: 'fferraz2@contoso.dev',
        role: 'analyst',
        is_active: true,
        created_at: '2025-02-28T21:24:25Z',
      },
      {
        id: 3,
        name: 'Tiago Hoffmann',
        email: 'thoffmann3@acme.io',
        role: 'analyst',
        is_active: true,
        created_at: '2024-09-10T22:07:40Z',
      },
    ]);
  });

  it('bad request /users (GET) with filter by page_size and page invalid type', async () => {
    const { body } = await request(app.getHttpServer())
      .get(`/users?role=Invalid`)
      .expect(400);

    expect(body).toEqual({
      message: [
        'role must be one of the following values: admin, manager, analyst, viewer',
      ],
      error: 'Bad Request',
      statusCode: 400,
    });
  });

  it('/users (GET) with filter by is_active', async () => {
    const { body } = await request(app.getHttpServer())
      .get(`/users?is_active=${false}`)
      .expect(200);

    expect(body.pagination.total).toBe(1);
    expect(body.values).toEqual([
      {
        id: 4,
        name: 'Lucas Hoffmann',
        email: 'lhoffmann4@contoso.dev',
        role: 'admin',
        is_active: false,
        created_at: '2024-12-27T19:06:35Z',
      },
    ]);
  });

  it('bad request /users (GET) with filter by page_size and page invalid type', async () => {
    const { body } = await request(app.getHttpServer())
      .get(`/users?is_active=Invalid`)
      .expect(400);

    expect(body).toEqual({
      message: ['is_active must be a boolean value'],
      error: 'Bad Request',
      statusCode: 400,
    });
  });

  it('/users (GET) with filter by q(name)', async () => {
    const { body } = await request(app.getHttpServer())
      .get('/users?q=Felipe')
      .expect(200);

    expect(body.pagination.total).toBe(1);
    expect(body.values).toEqual([
      {
        id: 2,
        name: 'Felipe Ferraz',
        email: 'fferraz2@contoso.dev',
        role: 'analyst',
        is_active: true,
        created_at: '2025-02-28T21:24:25Z',
      },
    ]);
  });

  it('/users (GET) with filter by q(email)', async () => {
    const { body } = await request(app.getHttpServer())
      .get('/users?q=@acme.io')
      .expect(200);

    expect(body.pagination.total).toBe(1);
    expect(body.values).toEqual([
      {
        id: 3,
        name: 'Tiago Hoffmann',
        email: 'thoffmann3@acme.io',
        role: 'analyst',
        is_active: true,
        created_at: '2024-09-10T22:07:40Z',
      },
    ]);
  });

  it('/users (GET) with order asc', async () => {
    const { body } = await request(app.getHttpServer())
      .get('/users?order=asc')
      .expect(200);

    expect(body.pagination.total).toBe(5);
    expect(body.values).toEqual([
      {
        id: 5,
        name: "Diego Gomes",
        email: "dgomes5@contoso.dev",
        role: "viewer",
        is_active: true,
        created_at: "2024-02-02T21:47:39Z"
      },
      {
        id: 1,
        name: "Bruno Nogueira",
        email: "bnogueira1@widgets.org",
        role: "manager",
        is_active: true,
        created_at: "2024-05-26T17:11:48Z"
      },
      {
        id: 3,
        name: "Tiago Hoffmann",
        email: "thoffmann3@acme.io",
        role: "analyst",
        is_active: true,
        created_at: "2024-09-10T22:07:40Z"
      },
      {
        id: 4,
        name: "Lucas Hoffmann",
        email: "lhoffmann4@contoso.dev",
        role: "admin",
        is_active: false,
        created_at: "2024-12-27T19:06:35Z"
      },
      {
        id: 2,
        name: "Felipe Ferraz",
        email: "fferraz2@contoso.dev",
        role: "analyst",
        is_active: true,
        created_at: "2025-02-28T21:24:25Z"
      }
    ]);
  });

  it('/users (GET) with order desc', async () => {
    const { body } = await request(app.getHttpServer())
      .get('/users?order=desc')
      .expect(200);

    expect(body.pagination.total).toBe(5);
    expect(body.values).toEqual([
      {
        id: 2,
        name: "Felipe Ferraz",
        email: "fferraz2@contoso.dev",
        role: "analyst",
        is_active: true,
        created_at: "2025-02-28T21:24:25Z"
      },
      {
        id: 4,
        name: "Lucas Hoffmann",
        email: "lhoffmann4@contoso.dev",
        role: "admin",
        is_active: false,
        created_at: "2024-12-27T19:06:35Z"
      },
      {
        id: 3,
        name: "Tiago Hoffmann",
        email: "thoffmann3@acme.io",
        role: "analyst",
        is_active: true,
        created_at: "2024-09-10T22:07:40Z"
      },
      {
        id: 1,
        name: "Bruno Nogueira",
        email: "bnogueira1@widgets.org",
        role: "manager",
        is_active: true,
        created_at: "2024-05-26T17:11:48Z"
      },
      {
        id: 5,
        name: "Diego Gomes",
        email: "dgomes5@contoso.dev",
        role: "viewer",
        is_active: true,
        created_at: "2024-02-02T21:47:39Z"
      }
    ]);
  });

  it('/users/:id (GET)', async () => {
    const { body } = await request(app.getHttpServer())
      .get('/users/2')
      .expect(200);

    expect(body).toEqual({
      id: 2,
      name: 'Felipe Ferraz',
      email: 'fferraz2@contoso.dev',
      role: 'analyst',
      is_active: true,
      created_at: '2025-02-28T21:24:25Z',
    });
  });

  it('not found /users/:id (GET) when user doesnt exist', async () => {
    const { body } = await request(app.getHttpServer())
      .get('/users/1000')
      .expect(404);

    expect(body).toEqual({
      message: 'User not found!',
      error: 'Not Found',
      statusCode: 404,
    });
  });

  it('/users (POST)', async () => {
    const user: CreateUserDto = {
      name: 'User Test',
      email: 'user@test.com',
      role: UserRole.ADMIN,
      isActive: true,
    };

    const { body } = await request(app.getHttpServer())
      .post('/users')
      .send(user)
      .expect(201);

    expect(body).toEqual({
      id: 6,
      name: user.name,
      email: user.email,
      role: user.role,
      is_active: user.isActive,
      created_at: expect.any(String),
    });
  });

  it('bad request /users (POST) with invalid name', async () => {
    const user: any = {
      name: 12345,
      email: 'user@test.com',
      role: UserRole.ADMIN,
      isActive: true,
    };

    const { body } = await request(app.getHttpServer())
      .post('/users')
      .send(user)
      .expect(400);

    expect(body).toEqual({
      message: ['name must be a string'],
      error: 'Bad Request',
      statusCode: 400,
    });
  });

  it('bad request /users (POST) with invalid email', async () => {
    const user: any = {
      name: 'User Test',
      email: 123456,
      role: UserRole.ADMIN,
      isActive: true,
    };

    const { body } = await request(app.getHttpServer())
      .post('/users')
      .send(user)
      .expect(400);

    expect(body).toEqual({
      message: ['email must be a string'],
      error: 'Bad Request',
      statusCode: 400,
    });
  });

  it('bad request /users (POST) with invalid role', async () => {
    const user: any = {
      name: 'User Test',
      email: 'user@test.com',
      role: 'Invalid',
      isActive: true,
    };

    const { body } = await request(app.getHttpServer())
      .post('/users')
      .send(user)
      .expect(400);

    expect(body).toEqual({
      message: [
        'role must be one of the following values: admin, manager, analyst, viewer',
      ],
      error: 'Bad Request',
      statusCode: 400,
    });
  });

  it('bad request /users (POST) with invalid role', async () => {
    const user: any = {
      name: 'User Test',
      email: 'user@test.com',
      role: UserRole.ADMIN,
      isActive: 'Invalid',
    };

    const { body } = await request(app.getHttpServer())
      .post('/users')
      .send(user)
      .expect(400);

    expect(body).toEqual({
      message: ['isActive must be a boolean value'],
      error: 'Bad Request',
      statusCode: 400,
    });
  });

  it('bad request /users (POST) with email that already exist', async () => {
    const user: CreateUserDto = {
      name: 'User Test',
      email: 'dgomes5@contoso.dev',
      role: UserRole.ADMIN,
      isActive: true,
    };

    const { body } = await request(app.getHttpServer())
      .post('/users')
      .send(user)
      .expect(400);

    expect(body).toEqual({
      error: 'Bad Request',
      message: 'User with email already exist',
      statusCode: 400,
    });
  });

  it('/users (PATCH)', async () => {
    const user: UpdateUserDto = {
      name: 'User Test Edit',
      email: 'user_editado@test.com',
      role: UserRole.VIEWER,
      isActive: false,
    };

    const { body } = await request(app.getHttpServer())
      .patch('/users/6')
      .send(user)
      .expect(200);

    expect(body).toEqual({
      id: 6,
      name: user.name,
      email: user.email,
      role: user.role,
      is_active: user.isActive,
      created_at: expect.any(String),
    });
  });

  it('not found /users (PATCH) when user doesnt exist', async () => {
    const user: UpdateUserDto = {
      name: 'User Test Edit Error',
    };

    const { body } = await request(app.getHttpServer())
      .patch('/users/1000')
      .send(user)
      .expect(404);

    expect(body).toEqual({
      message: 'User not found!',
      error: 'Not Found',
      statusCode: 404,
    });
  });

  it('/users (DELETE)', async () => {
    const { body } = await request(app.getHttpServer())
      .delete('/users/6')
      .expect(200);

    expect(body).toEqual({
      message: 'User Deleted with Success!',
    });
  });

  it('not found /users (DELETE) when user doesnt exist', async () => {
    const { body } = await request(app.getHttpServer())
      .delete('/users/1000')
      .expect(404);

    expect(body).toEqual({
      message: 'User not found!',
      error: 'Not Found',
      statusCode: 404,
    });
  });
});
