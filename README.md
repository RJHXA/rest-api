# REST API - NestJS

A simple **RESTful API** built with **NestJS** for managing users.  
This project demonstrates clean architecture, DTO validation, and CRUD operations following best practices.

## 🧰 Tech Stack
- **NestJS** — Node.js framework  
- **TypeScript** — Strongly typed JavaScript  
- **Jest** — Testing framework  

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/RJHXA/rest-api.git
cd rest-api
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup environment variables
Copy the .env.example file to .env and adjust if needed:
```bash
cp .env.example .env
```

### 4. Run project
```bash
npm run start
```

## ♻️ Run tests

Run end-to-end tests for the User Module:

```bash
npm run test:e2e
```


## 📂 Project Structure
The main project structure is as follows:

```
src/
 ├── app.module.ts
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
```
  curl http://localhost:3000/users/1
```

### Update User
```
  curl -X PATCH http://localhost:3000/users/1 \
  -H "Content-Type: application/json" \
  -d '{"name": "Jane Doe"}'
```

### Delete User
```
  curl -X DELETE http://localhost:3000/users/1
```