# REST API - NestJS

A simple **RESTful API** built with **NestJS** for managing users.  
This project demonstrates clean architecture, DTO validation, and CRUD operations following best practices.

## 🧰 Tech Stack
- **NestJS** — Node.js framework  
- **TypeScript** — Strongly typed JavaScript  
- **Jest** — Testing framework

## 📂 Project Structure
The main project structure is as follows:

```
src/
 ├── app.module.ts
 ├── config
 │   └── config.ts
 ├── database/
 │   └── mock-users.json
 ├── main.ts
 └── modules/
     └── users/
         ├── dto/
         │   ├── create-users.dto.ts
         │   ├── get-users.dto.ts
         │   └── update-users.dto.ts
         ├── enum/
         │   └── role.enum.ts
         ├── users.controller.ts
         ├── users.module.ts
         ├── users.repository.ts
         └── users.service.ts
```

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/RJHXA/rest-api.git
cd rest-api
```

### 2. Install dependencies
Prerequisite: Node.js and npm must be installed on your machine.

```bash
npm install
```

### 3. Setup environment variables
Copy the .env.example file to .env and adjust if needed:
```bash
cp .env.example .env
```

- *PORT:* The port on which the project will run (recommended: 3000, since all examples use this port)

- *NODE_ENV:* The environment for the application (development, test, production, etc.)

- *USERS_FILE:* Path to the mock users JSON file

### 4. Run project
```bash
npm run start
```

## 📌 API Examples

For a better experience, you can explore and test all endpoints using the **Swagger UI** (available while the application is running) at:  
👉 [http://localhost:3000/api/docs](http://localhost:3000/api/docs)

### Create User
```
  curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "email": "john@example.com", "role": "admin", "isActive": true}'
```

### Get All Users
```
  curl http://localhost:3000/users
```

### Get User by ID
Change `:id` for a valid number on user mock
```
  curl http://localhost:3000/users/:id
```

### Update User
Change `:id` for a valid number on user mock
```
  curl -X PATCH http://localhost:3000/users/:id \
  -H "Content-Type: application/json" \
  -d '{"name": "Jane Doe"}'
```

### Delete User
Change `:id` for a valid number on user mock
```
  curl -X DELETE http://localhost:3000/users/:id
```