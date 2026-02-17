# Pet Store Application

A full-stack pet store application built with Spring Boot and Angular, deployed as a single JAR. Manages pets, categories, customers, orders, and inventory.

## Tech Stack

- **Backend:** Java 25, Spring Boot 4.0.2, Spring Data JPA, Flyway, PostgreSQL
- **Frontend:** Angular 19 (standalone components, signals, SCSS), Bootstrap 5
- **Build:** Maven multi-module (root aggregator → frontend + backend)
- **Runtime:** Docker Compose (app + PostgreSQL 17)

## Prerequisites

- **Docker route:** Docker and Docker Compose
- **Local route:** Java 25, Maven 3.9+, Node.js 20+, PostgreSQL 17

## Build & Run

### Docker (recommended)

The easiest way to get started. This builds the app and starts it alongside a PostgreSQL database:

```bash
docker compose up --build
```

The application will be available at **http://localhost:8080**.

To stop:

```bash
docker compose down
```

To stop and remove the database volume:

```bash
docker compose down -v
```

### Local Development

#### 1. Set up PostgreSQL

Create a database named `petstore` owned by user `petstore` with password `petstore`:

```bash
psql -U postgres -c "CREATE USER petstore WITH PASSWORD 'petstore';"
psql -U postgres -c "CREATE DATABASE petstore OWNER petstore;"
```

#### 2. Start the backend

```bash
cd backend
mvn spring-boot:run
```

The API will be available at **http://localhost:8080/api**.

#### 3. Start the frontend (separate terminal)

```bash
cd frontend
npm install
npm start
```

The Angular dev server starts at **http://localhost:4200** and proxies `/api` requests to the backend on port 8080.

### Full Maven Build

Build the entire project (frontend + backend) into a single JAR:

```bash
mvn clean package
java -jar backend/target/petstore-backend-1.0.0-SNAPSHOT.jar
```

## Running Tests

Backend tests use an H2 in-memory database, so no external database is needed:

```bash
cd backend
mvn test
```

## API Endpoints

| Resource   | Endpoints                                                                                          |
|------------|----------------------------------------------------------------------------------------------------|
| Pets       | `GET/POST /api/pets`, `GET/PUT/DELETE /api/pets/{id}`, `GET /api/pets/search?q=`                   |
| Categories | `GET/POST /api/categories`, `GET/PUT/DELETE /api/categories/{id}`, `GET /api/categories/{id}/pets` |
| Customers  | `GET/POST /api/customers`, `GET/PUT/DELETE /api/customers/{id}`, `GET /api/customers/{id}/orders`  |
| Orders     | `GET/POST /api/orders`, `GET /api/orders/{id}`, `PATCH /api/orders/{id}/status`                    |
| Inventory  | `GET /api/inventory`, `GET /api/inventory/low-stock`, `PATCH /api/inventory/pets/{id}/stock`       |

## Project Structure

```
petstore/
├── backend/              Spring Boot application
│   └── src/main/java/com/petstore/
│       ├── config/       SPA routing configuration
│       ├── controller/   REST controllers
│       ├── dto/          Java record DTOs
│       ├── entity/       JPA entities and enums
│       ├── exception/    Exception handling
│       ├── mapper/       Entity ↔ DTO mappers
│       ├── repository/   Spring Data JPA repositories
│       └── service/      Business logic
├── frontend/             Angular application
│   └── src/app/
│       ├── components/   Standalone Angular components
│       ├── models/       TypeScript interfaces
│       └── services/     HTTP and cart services
├── Dockerfile            Multi-stage build
└── docker-compose.yml
```

## Database

- Migrations managed by Flyway (`backend/src/main/resources/db/migration/`)
- Seed data includes 6 categories and 4 sample pets
- Default connection: `localhost:5432/petstore` (user/password: `petstore/petstore`)
