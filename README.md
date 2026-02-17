# Pet Store Application

A full-stack pet store application built with Spring Boot and Angular, deployed as a single JAR. Manages pets, categories, customers, orders, and inventory.

## Tech Stack

- **Backend:** Java 25, Spring Boot 4.0.2, Spring Data JPA, Flyway, PostgreSQL
- **Frontend:** Angular 19 (standalone components, signals, SCSS), Bootstrap 5
- **Build:** Maven multi-module (root aggregator → frontend + backend)
- **Runtime:** Docker Compose (app + PostgreSQL 17)

## Prerequisites

| Route | Requirements |
|-------|-------------|
| **OrbStack** | [OrbStack](https://orbstack.dev/) installed (macOS 13+, Apple Silicon or Intel) |
| **Apple Containers** | macOS 26+, Apple Silicon, [container CLI](https://github.com/apple/container) installed |
| **Docker** | Docker and Docker Compose |
| **Local (no containers)** | Java 25, Maven 3.9+, Node.js 20+, PostgreSQL 17 |

## Build & Run

### OrbStack (recommended for macOS)

[OrbStack](https://orbstack.dev/) is a lightweight Docker Desktop alternative optimized for Apple Silicon. It is a drop-in replacement — all `docker` and `docker compose` commands work as-is.

1. Install OrbStack:

```bash
brew install orbstack
```

2. Start OrbStack, then run the app exactly like Docker:

```bash
docker compose up --build
```

The application will be available at **http://localhost:8080**.

To stop:

```bash
docker compose down
```

### Apple Containers (macOS 26+)

[Apple Containers](https://github.com/apple/container) is Apple's native container runtime for Apple Silicon, using lightweight VMs via the Virtualization framework. It does not support Docker Compose natively, so you run each container individually.

1. Install the container CLI:

```bash
brew install container
```

2. Start PostgreSQL:

```bash
container run --name petstore-db \
  -e POSTGRES_DB=petstore \
  -e POSTGRES_USER=petstore \
  -e POSTGRES_PASSWORD=petstore \
  -p 5432:5432 \
  docker.io/library/postgres:17-alpine
```

3. Build and run the application:

```bash
container build --tag petstore .
container run --name petstore-app \
  -e SPRING_DATASOURCE_URL=jdbc:postgresql://host.internal:5432/petstore \
  -e SPRING_DATASOURCE_USERNAME=petstore \
  -e SPRING_DATASOURCE_PASSWORD=petstore \
  -p 8080:8080 \
  petstore
```

The application will be available at **http://localhost:8080**.

To stop:

```bash
container stop petstore-app
container stop petstore-db
```

> **Note:** Apple Containers is still early-stage (v0.1.x). For multi-container workflows, consider [container-compose](https://github.com/Mcrich23/Container-Compose) as a community-built alternative to Docker Compose.

### Docker

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

### Local Development (no containers)

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
