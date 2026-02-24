# Pet Store Application

## Project Overview
Spring Boot + Angular monolith pet store application. Manages pets, categories, customers, orders, and inventory. Single JAR deployment with Angular build output served from Spring Boot static resources.

## Tech Stack
- **Backend:** Java 21, Spring Boot 4.0.2, Spring Data JPA, Spring Security, Flyway, PostgreSQL
- **Frontend:** Angular 19 (standalone components, signals, SCSS), Bootstrap 5
- **Build:** Maven multi-module (root aggregator → frontend + backend)
- **Runtime:** Docker Compose (app + PostgreSQL 17)

## Project Structure
```
petstore/
├── backend/          Spring Boot app
│   └── src/main/java/com/petstore/
│       ├── config/       WebConfig (SPA routing), SecurityConfig
│       ├── security/     UserDetails, UserDetailsService
│       ├── controller/   REST controllers (/api/*)
│       ├── dto/          Java record DTOs
│       ├── entity/       JPA entities + enums
│       ├── exception/    GlobalExceptionHandler, custom exceptions
│       ├── mapper/       Entity↔DTO mappers
│       ├── repository/   JPA repositories
│       └── service/      Business logic
├── frontend/         Angular app
│   └── src/app/
│       ├── components/   17 standalone components (includes login, register, profile)
│       ├── guards/       Route guards (authGuard, adminGuard)
│       ├── models/       TypeScript interfaces
│       └── services/     HTTP + CartService (signals)
├── Dockerfile        Multi-stage (node → maven → jre)
└── docker-compose.yml
```

## Build & Run Commands

### Docker (preferred)
```bash
docker compose up --build          # build and start everything
docker compose down                # stop
docker compose down -v             # stop and remove data volume
```

### Local Development
```bash
# Prerequisites: PostgreSQL running with database "petstore" owned by user "petstore"
# Backend
cd backend && mvn spring-boot:run

# Frontend (separate terminal, proxies /api to :8080)
cd frontend && npm install && npm start
```

### Full Maven Build
```bash
mvn clean package                  # builds frontend + backend, runs tests
java -jar backend/target/petstore-backend-1.0.0-SNAPSHOT.jar
```

### Run Backend Tests Only
```bash
cd backend && mvn test             # uses H2 in-memory DB (application-test.yml)
```

## API Endpoints
| Resource    | Endpoints |
|-------------|-----------|
| Pets        | `GET/POST /api/pets`, `GET/PUT/DELETE /api/pets/{id}`, `GET /api/pets/search?q=` |
| Categories  | `GET/POST /api/categories`, `GET/PUT/DELETE /api/categories/{id}`, `GET /api/categories/{id}/pets` |
| Customers   | `GET/POST /api/customers`, `GET/PUT/DELETE /api/customers/{id}`, `GET /api/customers/{id}/orders` |
| Orders      | `GET/POST /api/orders`, `GET /api/orders/{id}`, `PATCH /api/orders/{id}/status` |
| Inventory   | `GET /api/inventory`, `GET /api/inventory/low-stock`, `PATCH /api/inventory/pets/{id}/stock` |
| Auth        | `POST /api/auth/login`, `POST /api/auth/register`, `POST /api/auth/logout`, `GET /api/auth/me` |
| Me          | `GET/PUT /api/me/profile`, `GET /api/me/orders` |

## Security
- **Authentication:** Session-based (in-memory HTTP sessions), Spring Security with BCrypt passwords
- **Roles:** ADMIN and CUSTOMER (enum `Role.java`, stored in `users` table)
- **Default admin:** `admin@petstore.com` / `admin123` (seeded via V7 migration)
- **Access control:** Public read for pets/categories/inventory; ADMIN for all write ops and customer/order management; CUSTOMER can create orders and access /api/me endpoints
- **Separate User entity** — auth concerns decoupled from Customer domain entity; admin users have no Customer record
- **CSRF disabled** — JSON API with session cookies

## Key Design Decisions
- **Cart is client-side only** — Angular signals in `CartService`, converts to Order on checkout
- **Stock is transactional** — `OrderService.createOrder()` decrements stock atomically, throws `InsufficientStockException` (409) if insufficient; cancellation restores stock
- **DTOs are Java records** — immutable, with Jakarta Validation annotations
- **Tests use H2** — `application-test.yml` disables Flyway, uses `ddl-auto: create-drop`
- **SPA routing** — `WebConfig` forwards non-API, non-static paths to `index.html`
- **Environment config** — `application.yml` uses `${ENV_VAR:default}` pattern; Docker overrides via `SPRING_DATASOURCE_*` env vars

## Database
- Flyway migrations in `backend/src/main/resources/db/migration/` (V1–V7)
- Seed data: 6 categories + 4 sample pets
- PostgreSQL connection defaults: `localhost:5432/petstore`, user/password: `petstore/petstore`

## Code Conventions
- Backend packages: `entity`, `dto`, `repository`, `service`, `controller`, `mapper`, `exception`, `config`, `security`
- All Angular components are standalone (no NgModules)
- Angular routes use lazy loading via `loadComponent`
- No Lombok — plain getters/setters on entities, records for DTOs
