# 🚀 ExpressJS + TypeScript + Prisma + Redis Backend

This is a RESTful API backend built with **ExpressJS**, **TypeScript**, **Prisma**, and **Redis** for managing products with user authentication, like functionality, and API caching.

---

## 📌 1. System Requirements

Before running the project, ensure you have the following installed:

- **Node.js** (>= 18.18.0) - [Download here](https://nodejs.org/)
- **PostgreSQL** - (or another supported DB)
- **Docker** - to run Redis container
- **Git** - for version control

---

## 📌 2. Installation & Running the Project

### 1️⃣ Clone the Repository

```sh
git clone <repository-url>
cd <repository-folder>
```

### 2️⃣ Install Dependencies

```sh
npm install
```

### 3️⃣ Configure Environment Variables (`.env`)

Create a `.env` file in the root directory and add the following:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/mydatabase"
PORT=5000
JWT_SECRET="your_jwt_secret"
```

> 🔁 Update the values with your actual credentials.

### 4️⃣ Run Database Migration (Prisma)

```sh
npx prisma migrate dev --name init
```

To view your database visually:

```sh
npx prisma studio
```

### 5️⃣ Start Redis Server

Open Docker and run the following command in your terminal:

```sh
docker run --name redis-local -p 6379:6379 -d redis
```

### 6️⃣ Start the Server

For development:

```sh
npm run start:dev
```

For production:

```sh
npm run build
npm run start
```

---

## 📌 3. API Features

### 🔒 Authentication & Authorization

- Register/Login with JWT
- Only authenticated users can add or like products
- Guests can only view products

### 🗆 Product Features

- Supports English and Vietnamese in responses
- Language is determined by the `Accept-Language` header (e.g., `en` or `vi`)

### 🔍 Searching & Pagination

- Search with `GET /products/search?q=`
- Supports pagination

### 🧠 API Caching Optimization

- Redis is used to cache `GET /products` responses
- Cache is **invalidated** when a new product is added or a product is liked

### 💬 Explanation of Caching & Optimization Strategies

- When a user requests `GET /products`, the backend first checks Redis:

  - If data is **cached**, it returns immediately (reduces database load)
  - If data is **not cached**, it queries the database and stores the result in Redis

- When a **new product is created** or a **like is added**, the cache is cleared to prevent stale data

### 👍 Like Feature with Optimistic UI

- When a user likes a product, the UI updates **immediately** (optimistic update)
- Meanwhile, a request is sent to the backend to update the database
- If the request fails, the frontend can rollback the like count

---

## 📌 4. API Endpoints

| Method | Endpoint                    | Description                        |
| ------ | --------------------------- | ---------------------------------- |
| `POST` | `/api/v1/auth/register`     | Register new user                  |
| `POST` | `/api/v1/auth/login`        | User login                         |
| `GET`  | `/api/v1/products`          | Get all products                   |
| `GET`  | `/api/v1/products/:id`      | Get product by ID                  |
| `POST` | `/api/v1/products`          | Create new product (auth required) |
| `POST` | `/api/v1/products/:id/like` | Like a product (auth required)     |

---

## 📌 5. Project Structure

```
📂 backend
 ├ 📂 node_modules            # Node.js packages
 ├ 📂 prisma                  # Prisma schema & migrations
 ┃ ├ 📂 migrations
 ┃ └ 📜 schema.prisma
 ├ 📂 src-project             # Main application source code
 ┃ ├ 📂 common                # Shared utilities (response formatter, Redis)
 ┃ ┃ └ 📜 response.ts
 ┃ ├ 📂 config                # Configuration files (e.g., database)
 ┃ ┃ ├ 📜 redis.ts
 ┃ ┃ └ 📜 db.ts
 ┃ ├ 📂 controllers           # Route handlers
 ┃ ┃ ├ 📜 auth.controller.ts
 ┃ ┃ ├ 📜 product.controller.ts
 ┃ ┃ └ 📜 user.controller.ts
 ┃ ├ 📂 dto                   # Data Transfer Objects
 ┃ ┃ ├ 📜 create-product.dto.ts
 ┃ ┃ └ 📜 user.dto.ts
 ┃ ├ 📂 middleware            # Middlewares (e.g., authentication)
 ┃ ┃ └ 📜 auth.middleware.ts
 ┃ ├ 📂 models                # Model definitions
 ┃ ┃ ├ 📜 product-like.model.ts
 ┃ ┃ ├ 📜 product.model.ts
 ┃ ┃ └ 📜 user.model.ts
 ┃ ├ 📂 routers               # API route definitions
 ┃ ┃ ├ 📜 auth.routes.ts
 ┃ ┃ ├ 📜 product.routes.ts
 ┃ ┃ └ 📜 user.router.ts
 ┃ ├ 📂 services              # Business logic layer
 ┃ ┃ ├ 📜 auth.service.ts
 ┃ ┃ ├ 📜 product.service.ts
 ┃ ┃ └ 📜 user.service.ts
 ┃ ├ 📂 types                 # Custom TypeScript types
 ┃ ┃ └ 📜 types.ts
 ┃ ├ 📜 app.ts                # Express app setup
 ┃ └ 📜 index.ts              # Main entry point
 ├ 📜 .env                    # Environment variables
 ├ 📜 .gitignore
 ├ 📜 README.md               # Project documentation
 ├ 📜 package.json
 ├ 📜 package-lock.json
 ├ 📜 tsconfig.json
 └ 📜 tsconfig.tsbuildinfo
```

---

## 📌 6. Useful Commands

| Command                              | Description                     |
| ------------------------------------ | ------------------------------- |
| `npm install`                        | Install all dependencies        |
| `npm run start:dev`                  | Start server in dev mode        |
| `npm run build`                      | Build project (TypeScript → JS) |
| `npm run start`                      | Start compiled project          |
| `npx prisma migrate dev --name init` | Run database migration          |
| `npx prisma studio`                  | View/manage database GUI        |

---
