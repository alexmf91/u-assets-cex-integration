# U-Assets CEX Integration

A NestJS-based API for cryptocurrency exchange integration with universal assets (uAssets). This project provides a partial backend solution for managing users, assets, quotes, and orders in a cryptocurrency trading environment.

## 🚀 Features

- **User Management**: Basic registration, authentication, and user profile management (partial implementation)
- **Asset Management**: CRUD operations for cryptocurrency assets (partial)
- **Quote System**: Real-time quote generation and caching with Redis (partial)
- **Order Management**: Order lifecycle from creation to execution (partial)
- **Authentication**: JWT-based authentication with secure password hashing (partial)
- **API Documentation**: Interactive Swagger/OpenAPI documentation
- **Database**: PostgreSQL with Prisma ORM for type-safe database operations
- **Caching**: Redis integration for improved performance
- **Docker Support**: Containerization for easy deployment and running the app locally with Docker Compose

## 🏗️ Project Structure

```
src/
├── app.controller.ts          # Main application controller
├── app.module.ts             # Root application module
├── app.service.ts            # Application service
├── main.ts                   # Application bootstrap
├── common/                   # Shared utilities and middleware
│   ├── constants.ts          # Application constants
│   ├── exception-filters/    # Global exception handling
│   ├── middleware/           # Request/response middleware
│   └── utils.ts              # Utility functions
├── config/                   # Configuration files
│   ├── index.ts              # Configuration setup
│   └── swagger.config.ts     # Swagger documentation config
└── modules/                  # Feature modules
    ├── assets/               # Asset management
    │   ├── assets.controller.ts
    │   ├── assets.service.ts
    │   └── dto/              # Data transfer objects
    ├── auth/                 # Authentication
    │   ├── auth.controller.ts
    │   ├── auth.service.ts
    │   ├── auth.guard.ts
    │   └── dto/
    ├── database/             # Database configuration
    ├── orders/               # Order management
    │   ├── orders.controller.ts
    │   ├── orders.service.ts
    │   └── dto/
    ├── quotes/               # Quote management
    │   ├── quotes.controller.ts
    │   ├── quotes.service.ts
    │   └── dto/
    ├── redis/                # Redis configuration
    └── users/                # User management
        ├── users.controller.ts
        ├── users.service.ts
        └── dto/
```

## 🗄️ Database Schema

The application uses PostgreSQL with the following main entities:

- **Users**: User accounts with authentication
- **Assets**: Cryptocurrency assets (uETH, uBTC, etc.)
- **Quotes**: Price quotes for buying/selling assets
- **Orders**: Trading orders with status tracking

## 🛠️ Tech Stack

- **Framework**: NestJS (Node.js)
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Cache**: Redis
- **Authentication**: JWT
- **Documentation**: Swagger/OpenAPI
- **Containerization**: Docker & Docker Compose
- **Package Manager**: Bun

## 🚀 Getting Started

### Prerequisites

- Docker and Docker Compose
- Node.js 22.14.0+ (for local development)
- Bun (recommended package manager)

### Running with Docker Compose

1. **Clone the repository**

    ```bash
    git clone https://github.com/alexmf91/u-assets-cex-integration.git
    cd u-assets-cex-integration
    ```

2. **Start the application and all related services**

    ```bash
    docker-compose up -d
    ```

    This will start:
    - PostgreSQL database on port 5432
    - Redis cache on port 6379
    - NestJS application on port 8080

3. **Access the application**
    - API: http://localhost:8080
    - API Documentation: http://localhost:8080/api-docs

### Local Development

You can also run only the database and Redis using Docker Compose, and run the NestJS app locally for development:

1. **Install dependencies**

    ```bash
    bun install
    ```

2. **Set up environment variables**
   Create a `.env` file with the following variables:

    ```env
    PORT=8080
    DATABASE_URL=postgres://postgres:postgres@localhost:5432/uasset_cex
    DIRECT_URL=postgres://postgres:postgres@localhost:5432/uasset_cex
    REDIS_URL=redis://localhost:6379
    NODE_ENV=development
    JWT_SECRET=your-super-secret-jwt-key-here
    JWT_EXPIRATION=3600
    VERSION=1
    APP=u-assets-cex-integration
    ```

3. **Start the database and Redis (only)**

    ```bash
    docker-compose up db redis -d
    ```

4. **Run database migrations**

    ```bash
    bun run prisma:migrate
    bun run prisma:generate
    ```

5. **Seed the database**

    ```bash
    bun run prisma/seed.ts
    ```

6. **Start the development server**
    ```bash
    bun run start:dev
    ```

## 📚 API Documentation

### Live Preview

A live preview of the API documentation can be found here:
**https://u-assets-cex-integration-production.up.railway.app/api-docs**

## 📄 License

This project is licensed under the MIT License - see the [LICENCE](LICENCE) file for details.

## 👨‍💻 Author

**Alex Muñoz**

- GitHub: [@alexmf91](https://github.com/alexmf91)
