# Pet Store Application — Specification

## Table of Contents

1. [Overview](#1-overview)
2. [Tech Stack](#2-tech-stack)
3. [Project Structure](#3-project-structure)
4. [Data Model](#4-data-model)
5. [Database Schema](#5-database-schema)
6. [API Reference](#6-api-reference)
7. [Security](#7-security)
8. [Business Logic](#8-business-logic)
9. [Exception Handling](#9-exception-handling)
10. [Frontend Architecture](#10-frontend-architecture)
11. [Build & Deployment](#11-build--deployment)
12. [Testing](#12-testing)

---

## 1. Overview

A full-stack pet store application for managing pets, categories, customers, orders, and inventory. Deployed as a single JAR — Angular SPA served as static resources from Spring Boot.

**Key capabilities:**
- Browse and search pets by name, breed, category, or status
- Shopping cart (client-side) with checkout
- Order management with transactional stock control
- Inventory dashboard with low-stock alerts
- Role-based access: public browse, customer ordering, admin management
- Session-based authentication with separate auth/domain user models

---

## 2. Tech Stack

| Layer | Technology |
|-------|-----------|
| Language | Java 21 |
| Framework | Spring Boot 4.0.2 |
| Persistence | Spring Data JPA, Hibernate |
| Security | Spring Security (session-based, BCrypt) |
| Migrations | Flyway |
| Database | PostgreSQL 17 |
| Frontend | Angular 19 (standalone components, signals, SCSS) |
| CSS | Bootstrap 5 |
| Build | Maven multi-module (root → frontend + backend) |
| Runtime | Docker Compose |

---

## 3. Project Structure

```
petstore/
├── backend/
│   └── src/main/java/com/petstore/
│       ├── config/         WebConfig (SPA routing), SecurityConfig
│       ├── security/       PetStoreUserPrincipal, PetStoreUserDetailsService
│       ├── controller/     REST controllers (/api/*)
│       ├── dto/            Java record DTOs (14 total)
│       ├── entity/         JPA entities + enums
│       ├── exception/      GlobalExceptionHandler, custom exceptions
│       ├── mapper/         Entity ↔ DTO mappers
│       ├── repository/     JPA repositories
│       └── service/        Business logic
├── frontend/
│   └── src/app/
│       ├── components/     17 standalone components
│       ├── guards/         authGuard, adminGuard
│       ├── models/         TypeScript interfaces
│       └── services/       HTTP services + CartService + AuthService
├── Dockerfile              Multi-stage: node → maven → jre
└── docker-compose.yml
```

---

## 4. Data Model

### 4.1 Entities

#### Category
| Field | Type | Constraints |
|-------|------|-------------|
| id | Long | PK, auto-generated |
| name | String(100) | NOT NULL, UNIQUE |
| description | String | nullable |
| createdAt | LocalDateTime | NOT NULL, immutable |
| updatedAt | LocalDateTime | NOT NULL |

#### Pet
| Field | Type | Constraints |
|-------|------|-------------|
| id | Long | PK, auto-generated |
| name | String(100) | NOT NULL |
| type | String(50) | NOT NULL (e.g. "Dog", "Cat") |
| breed | String(100) | nullable |
| age | Integer | nullable |
| price | BigDecimal(10,2) | NOT NULL |
| status | PetStatus | NOT NULL, default AVAILABLE |
| imageUrl | String(500) | nullable |
| description | String | nullable |
| stock | Integer | NOT NULL, default 0 |
| category | Category | ManyToOne LAZY, nullable |
| createdAt | LocalDateTime | NOT NULL, immutable |
| updatedAt | LocalDateTime | NOT NULL |

#### Customer
| Field | Type | Constraints |
|-------|------|-------------|
| id | Long | PK, auto-generated |
| name | String(150) | NOT NULL |
| email | String(255) | NOT NULL, UNIQUE |
| phone | String(20) | nullable |
| address | String | nullable |
| createdAt | LocalDateTime | NOT NULL, immutable |
| updatedAt | LocalDateTime | NOT NULL |

#### Order
| Field | Type | Constraints |
|-------|------|-------------|
| id | Long | PK, auto-generated |
| customer | Customer | ManyToOne LAZY, NOT NULL |
| total | BigDecimal(12,2) | NOT NULL |
| status | OrderStatus | NOT NULL, default PENDING |
| orderDate | LocalDateTime | NOT NULL |
| items | List\<OrderItem\> | OneToMany, cascade ALL, orphanRemoval |
| createdAt | LocalDateTime | NOT NULL, immutable |
| updatedAt | LocalDateTime | NOT NULL |

#### OrderItem
| Field | Type | Constraints |
|-------|------|-------------|
| id | Long | PK, auto-generated |
| order | Order | ManyToOne LAZY, NOT NULL |
| pet | Pet | ManyToOne LAZY, NOT NULL |
| quantity | Integer | NOT NULL |
| price | BigDecimal(10,2) | NOT NULL (snapshot of pet price at order time) |

#### User
| Field | Type | Constraints |
|-------|------|-------------|
| id | Long | PK, auto-generated |
| email | String(255) | NOT NULL, UNIQUE |
| password | String(255) | NOT NULL (BCrypt hash) |
| role | Role | NOT NULL |
| customer | Customer | OneToOne, nullable (null for admins) |
| enabled | Boolean | NOT NULL, default true |
| createdAt | LocalDateTime | NOT NULL, immutable |
| updatedAt | LocalDateTime | NOT NULL |

**Note:** User and Customer are separate entities. Admin users have no Customer record.

### 4.2 Enums

**PetStatus:** `AVAILABLE` | `PENDING` | `SOLD`

**OrderStatus:** `PENDING` | `CONFIRMED` | `SHIPPED` | `DELIVERED` | `CANCELLED`

**Role:** `ADMIN` | `CUSTOMER`

### 4.3 DTOs (Java Records)

All request/response payloads use immutable Java records. Validation annotations enforce input constraints at the controller boundary.

| DTO | Purpose | Key Validations |
|-----|---------|-----------------|
| `PetDto` | Pet response | — |
| `PetCreateDto` | Create/update pet | `@NotBlank` name/type, `@DecimalMin("0.01")` price, `@Min(0)` age/stock |
| `CategoryDto` | Category read/write | `@NotBlank @Size(max=100)` name |
| `CustomerDto` | Customer response | — |
| `CustomerCreateDto` | Create/update customer | `@NotBlank` name, `@Email` email, `@Size` constraints |
| `OrderDto` | Order response (includes items, customer name) | — |
| `OrderCreateDto` | Create order | `@NotNull` customerId, `@NotEmpty` items |
| `OrderItemDto` | Order line item response | — |
| `OrderItemCreateDto` | Order line item input | `@NotNull` petId, `@Min(1)` quantity |
| `InventoryDto` | Dashboard stats + low-stock pets | — |
| `LoginDto` | Login request | `@NotBlank @Email` email, `@NotBlank` password |
| `RegisterDto` | Registration request | `@Size(min=6)` password, `@Email` email |
| `AuthResponse` | Auth result | — |
| `ErrorResponse` | Error payload | — |

---

## 5. Database Schema

Managed by Flyway; migrations run in order V1–V7.

### V1 — categories
```sql
CREATE TABLE categories (
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at  TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### V2 — pets
```sql
CREATE TABLE pets (
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    type        VARCHAR(50)  NOT NULL,
    breed       VARCHAR(100),
    age         INTEGER,
    price       NUMERIC(10,2) NOT NULL,
    status      VARCHAR(20)  NOT NULL DEFAULT 'AVAILABLE',
    image_url   VARCHAR(500),
    description TEXT,
    stock       INTEGER      NOT NULL DEFAULT 0,
    category_id BIGINT REFERENCES categories(id),
    created_at  TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_pets_category_id ON pets(category_id);
CREATE INDEX idx_pets_status      ON pets(status);
CREATE INDEX idx_pets_type        ON pets(type);
CREATE INDEX idx_pets_price       ON pets(price);
```

### V3 — customers
```sql
CREATE TABLE customers (
    id         BIGSERIAL PRIMARY KEY,
    name       VARCHAR(150) NOT NULL,
    email      VARCHAR(255) NOT NULL UNIQUE,
    phone      VARCHAR(20),
    address    TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### V4 — orders + order_items
```sql
CREATE TABLE orders (
    id          BIGSERIAL PRIMARY KEY,
    customer_id BIGINT NOT NULL REFERENCES customers(id),
    total       NUMERIC(12,2) NOT NULL,
    status      VARCHAR(20)  NOT NULL DEFAULT 'PENDING',
    order_date  TIMESTAMP NOT NULL DEFAULT NOW(),
    created_at  TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE order_items (
    id       BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    pet_id   BIGINT NOT NULL REFERENCES pets(id),
    quantity INTEGER      NOT NULL,
    price    NUMERIC(10,2) NOT NULL
);

CREATE INDEX idx_orders_customer_id   ON orders(customer_id);
CREATE INDEX idx_orders_status        ON orders(status);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
```

### V5 — seed categories
Inserts 6 categories: Cat, Dog, Bird, Fish, Reptile, Small Animal.

### V6 — seed sample pets
Inserts 4 pets: Buddy (Dog/Golden Retriever, $499.99, stock 3), Whiskers (Cat/Siamese, $299.99, stock 5), Polly (Bird/African Grey, $799.99, stock 2), Nemo (Fish/Clownfish, $29.99, stock 20).

### V7 — users + default admin
```sql
CREATE TABLE users (
    id          BIGSERIAL PRIMARY KEY,
    email       VARCHAR(255) NOT NULL UNIQUE,
    password    VARCHAR(255) NOT NULL,
    role        VARCHAR(20)  NOT NULL,
    customer_id BIGINT REFERENCES customers(id),
    enabled     BOOLEAN NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Default admin: admin@petstore.com / admin123
INSERT INTO users (email, password, role, enabled)
VALUES ('admin@petstore.com',
        '$2b$10$Q0/cTkbYW2wx9W2LqXKcHet0C8oxw3HNALEO5StyOB7Ss2hsrhPbq',
        'ADMIN', TRUE);
```

---

## 6. API Reference

Base path: `/api`

### 6.1 Pets — `/api/pets`

| Method | Path | Auth | Request | Response | Notes |
|--------|------|------|---------|----------|-------|
| GET | `/api/pets` | Public | `categoryId?`, `status?`, pagination | `Page<PetDto>` | Filter by category or status |
| GET | `/api/pets/{id}` | Public | — | `PetDto` | 404 if not found |
| GET | `/api/pets/search?q=` | Public | `q` (name/breed), pagination | `Page<PetDto>` | Case-insensitive |
| POST | `/api/pets` | ADMIN | `PetCreateDto` | `PetDto` 201 | Creates with status=AVAILABLE |
| PUT | `/api/pets/{id}` | ADMIN | `PetCreateDto` | `PetDto` | Full update |
| DELETE | `/api/pets/{id}` | ADMIN | — | 204 | — |

### 6.2 Categories — `/api/categories`

| Method | Path | Auth | Request | Response | Notes |
|--------|------|------|---------|----------|-------|
| GET | `/api/categories` | Public | — | `List<CategoryDto>` | All categories |
| GET | `/api/categories/{id}` | Public | — | `CategoryDto` | — |
| POST | `/api/categories` | ADMIN | `CategoryDto` | `CategoryDto` 201 | — |
| PUT | `/api/categories/{id}` | ADMIN | `CategoryDto` | `CategoryDto` | — |
| DELETE | `/api/categories/{id}` | ADMIN | — | 204 | — |
| GET | `/api/categories/{id}/pets` | Public | pagination | `Page<PetDto>` | Pets in category |

### 6.3 Customers — `/api/customers`

| Method | Path | Auth | Request | Response | Notes |
|--------|------|------|---------|----------|-------|
| GET | `/api/customers` | ADMIN | — | `List<CustomerDto>` | — |
| GET | `/api/customers/{id}` | ADMIN | — | `CustomerDto` | — |
| POST | `/api/customers` | ADMIN | `CustomerCreateDto` | `CustomerDto` 201 | — |
| PUT | `/api/customers/{id}` | ADMIN | `CustomerCreateDto` | `CustomerDto` | — |
| DELETE | `/api/customers/{id}` | ADMIN | — | 204 | — |
| GET | `/api/customers/{id}/orders` | ADMIN | — | `List<OrderDto>` | Orders by customer |

### 6.4 Orders — `/api/orders`

| Method | Path | Auth | Request | Response | Notes |
|--------|------|------|---------|----------|-------|
| GET | `/api/orders` | ADMIN | — | `List<OrderDto>` | All orders |
| GET | `/api/orders/{id}` | ADMIN | — | `OrderDto` | — |
| POST | `/api/orders` | Authenticated | `OrderCreateDto` | `OrderDto` 201 | Decrements stock atomically |
| PATCH | `/api/orders/{id}/status` | ADMIN | `{status: String}` | `OrderDto` | Restores stock on CANCELLED |

### 6.5 Inventory — `/api/inventory`

| Method | Path | Auth | Request | Response | Notes |
|--------|------|------|---------|----------|-------|
| GET | `/api/inventory` | Public | — | `InventoryDto` | Counts + low-stock list |
| GET | `/api/inventory/low-stock` | Public | — | `List<PetDto>` | Stock < 5 and not SOLD |
| PATCH | `/api/inventory/pets/{id}/stock` | ADMIN | `{stock: int}` | `PetDto` | Also updates status |

### 6.6 Auth — `/api/auth`

| Method | Path | Auth | Request | Response | Notes |
|--------|------|------|---------|----------|-------|
| POST | `/api/auth/register` | Public | `RegisterDto` | `AuthResponse` 201 | Creates Customer + User(CUSTOMER) |
| POST | `/api/auth/login` | Public | `LoginDto` | `AuthResponse` | Sets session cookie |
| POST | `/api/auth/logout` | Authenticated | — | 200 | Invalidates session |
| GET | `/api/auth/me` | Authenticated | — | `AuthResponse` | Current user info |

### 6.7 Me (self-service) — `/api/me`

| Method | Path | Auth | Request | Response | Notes |
|--------|------|------|---------|----------|-------|
| GET | `/api/me/profile` | Authenticated | — | `CustomerDto` | 404 if admin (no customer) |
| PUT | `/api/me/profile` | Authenticated | `CustomerCreateDto` | `CustomerDto` | Own profile only |
| GET | `/api/me/orders` | Authenticated | — | `List<OrderDto>` | Own orders; empty for admins |

### 6.8 Error Response Format

All errors return `ErrorResponse`:
```json
{
  "status": 404,
  "message": "Pet not found with id: 1",
  "timestamp": "2026-02-25T10:30:00"
}
```

Validation errors join field messages:
```json
{
  "status": 400,
  "message": "name: must not be blank; price: must be greater than 0.01",
  "timestamp": "2026-02-25T10:30:00"
}
```

---

## 7. Security

### Authentication
- **Mechanism:** Spring Security session-based auth with HTTP session cookies
- **Password hashing:** BCrypt
- **Session storage:** In-memory (no Redis/DB persistence)
- **CSRF:** Disabled (JSON API, no form submissions)

### Authorization Matrix

| Path | GET | POST/PUT/DELETE/PATCH |
|------|-----|----------------------|
| `/api/auth/**` | Public | Public |
| `/api/pets/**` | Public | ADMIN only |
| `/api/categories/**` | Public | ADMIN only |
| `/api/inventory/**` | Public | ADMIN only (PATCH) |
| `/api/customers/**` | ADMIN | ADMIN |
| `/api/orders` (GET) | ADMIN | — |
| `/api/orders` (POST) | — | Authenticated (ADMIN or CUSTOMER) |
| `/api/orders/{id}/status` (PATCH) | — | ADMIN |
| `/api/me/**` | Authenticated | Authenticated |

### Default Credentials
| Role | Email | Password |
|------|-------|---------|
| Admin | `admin@petstore.com` | `admin123` |

### Principal
`PetStoreUserPrincipal` implements `UserDetails`:
- Authorities: `ROLE_ADMIN` or `ROLE_CUSTOMER`
- Carries `userId`, `email`, `role`, `customerId`, `enabled`

---

## 8. Business Logic

### 8.1 Order Creation (`OrderService.createOrder`) — `@Transactional`

1. Validate customer exists (404 if not)
2. Create `Order` with status=PENDING
3. For each item in `OrderCreateDto.items`:
   - Validate pet exists (404 if not)
   - Check `pet.stock >= item.quantity` — throw `InsufficientStockException` (409) if insufficient
   - Decrement `pet.stock -= item.quantity`
   - If stock reaches 0, set `pet.status = SOLD`
   - Create `OrderItem` with snapshot of current `pet.price`
4. Set `order.total` = sum of `(item.price × item.quantity)`
5. Save — entire operation is atomic; any failure rolls back all stock changes

### 8.2 Order Cancellation (`OrderService.updateStatus`) — `@Transactional`

When status changes to `CANCELLED` from a non-cancelled state:
1. For each `OrderItem`, restore `pet.stock += item.quantity`
2. If pet was `SOLD` and stock is now > 0, set `pet.status = AVAILABLE`
3. Update order status and save

### 8.3 Stock Management (`InventoryService.updateStock`) — `@Transactional`

- If `newStock = 0` → set `pet.status = SOLD`
- If `newStock > 0` and pet was `SOLD` → set `pet.status = AVAILABLE`
- Low-stock threshold: stock < 5 and status ≠ SOLD

### 8.4 User Registration (`AuthService.register`) — `@Transactional`

1. Check email not already used — throw `EmailAlreadyExistsException` (409) if duplicate
2. Create `Customer` entity
3. Create `User` with `role=CUSTOMER`, BCrypt-encoded password, linked to customer
4. Return `AuthResponse`

### 8.5 Search

`PetRepository.search` runs a case-insensitive LIKE on both `name` and `breed`:
```sql
WHERE LOWER(p.name)  LIKE LOWER(CONCAT('%', :query, '%'))
   OR LOWER(p.breed) LIKE LOWER(CONCAT('%', :query, '%'))
```

---

## 9. Exception Handling

`GlobalExceptionHandler` (`@RestControllerAdvice`) maps all exceptions to `ErrorResponse`.

| Exception | HTTP Status | Trigger |
|-----------|-------------|---------|
| `ResourceNotFoundException` | 404 | Entity not found in any service |
| `InsufficientStockException` | 409 | Order creation with insufficient stock |
| `EmailAlreadyExistsException` | 409 | Registration with duplicate email |
| `MethodArgumentNotValidException` | 400 | Bean Validation failure on request DTOs |
| `Exception` (catch-all) | 500 | Unexpected server errors |

---

## 10. Frontend Architecture

### 10.1 Routes

| Path | Component | Guard | Access |
|------|-----------|-------|--------|
| `/` | — | — | Redirects to `/pets` |
| `/login` | LoginComponent | — | Public |
| `/register` | RegisterComponent | — | Public |
| `/profile` | ProfileComponent | authGuard | Authenticated |
| `/pets` | PetListComponent | — | Public |
| `/pets/new` | PetFormComponent | adminGuard | ADMIN |
| `/pets/:id` | PetDetailComponent | — | Public |
| `/pets/:id/edit` | PetFormComponent | adminGuard | ADMIN |
| `/categories` | CategoryListComponent | — | Public |
| `/categories/new` | CategoryFormComponent | adminGuard | ADMIN |
| `/categories/:id/edit` | CategoryFormComponent | adminGuard | ADMIN |
| `/customers` | CustomerListComponent | adminGuard | ADMIN |
| `/customers/new` | CustomerFormComponent | adminGuard | ADMIN |
| `/customers/:id` | CustomerDetailComponent | adminGuard | ADMIN |
| `/customers/:id/edit` | CustomerFormComponent | adminGuard | ADMIN |
| `/cart` | CartComponent | authGuard | Authenticated |
| `/orders` | OrderListComponent | adminGuard | ADMIN |
| `/orders/:id` | OrderDetailComponent | authGuard | Authenticated |
| `/inventory` | InventoryDashboardComponent | adminGuard | ADMIN |

All components are lazy-loaded via `loadComponent`.

### 10.2 Guards

**`authGuard`:** Redirects to `/login` if not authenticated.

**`adminGuard`:** Redirects to `/login` if not authenticated; redirects to `/pets` if authenticated but not ADMIN.

### 10.3 Services

#### CartService (client-side only)
State managed with Angular signals. No backend persistence.

```typescript
// Signals
items:     Signal<CartItem[]>          // readonly
itemCount: Signal<number>              // computed
total:     Signal<number>              // computed

// Methods
addToCart(pet, quantity)               // merges if pet already in cart
updateQuantity(petId, quantity)        // removes if quantity == 0
removeFromCart(petId)
clear()
```

#### AuthService
```typescript
// Signals
currentUser: Signal<AuthUser | null>   // readonly
isLoggedIn:  Signal<boolean>           // computed
isAdmin:     Signal<boolean>           // computed
isCustomer:  Signal<boolean>           // computed

// Methods
login(request): Observable<AuthResponse>
register(request): Observable<AuthResponse>
logout(): Observable<void>
checkSession(): void                   // called on app init
```

#### HTTP Services
`PetService`, `CategoryService`, `CustomerService`, `OrderService`, `InventoryService` — thin wrappers over `HttpClient` mirroring the backend API.

### 10.4 Models

TypeScript interfaces mirror backend DTOs:

| Interface | Corresponds to |
|-----------|---------------|
| `Pet`, `PetCreate` | `PetDto`, `PetCreateDto` |
| `Category` | `CategoryDto` |
| `Customer`, `CustomerCreate` | `CustomerDto`, `CustomerCreateDto` |
| `Order`, `OrderItem`, `OrderCreate`, `OrderItemCreate` | `OrderDto`, etc. |
| `CartItem` | Client-only: `{ pet: Pet, quantity: number }` |
| `AuthUser`, `LoginRequest`, `RegisterRequest` | `AuthResponse`, `LoginDto`, `RegisterDto` |
| `PagedResponse<T>` | Spring `Page<T>` response envelope |

### 10.5 Cart Checkout Flow

1. User adds pets to cart (CartComponent reads CartService signals)
2. On checkout:
   - Admin: selects customer from dropdown; uses that `customerId`
   - Customer: uses own `customerId` from `AuthService.currentUser`
3. Builds `OrderCreate` from cart items
4. `POST /api/orders` — server handles stock decrement atomically
5. On success: `CartService.clear()`, navigate to order detail

---

## 11. Build & Deployment

### Docker (preferred)
```bash
docker compose up --build     # build and start (app + postgres)
docker compose down           # stop
docker compose down -v        # stop and remove data volume
```

Application available at `http://localhost:8080`.

### Local Development
```bash
# Prerequisites: PostgreSQL running, database "petstore", user/password "petstore/petstore"

# Backend
cd backend && mvn spring-boot:run

# Frontend (separate terminal — proxies /api to :8080)
cd frontend && npm install && npm start
```
Frontend dev server at `http://localhost:4200`.

### Full Maven Build
```bash
mvn clean package
java -jar backend/target/petstore-backend-1.0.0-SNAPSHOT.jar
```
Maven builds the Angular app first (via frontend-maven-plugin), then copies the output into `backend/src/main/resources/static` before packaging the fat JAR.

### Dockerfile (multi-stage)
1. **Stage 1 (node):** `npm install && npm run build`
2. **Stage 2 (maven):** Copies Angular output, runs `mvn package -DskipTests`
3. **Stage 3 (jre):** Copies fat JAR, runs with `java -jar`

### Environment Configuration
`application.yml` uses `${ENV_VAR:default}` pattern. Docker Compose overrides via:
```yaml
environment:
  SPRING_DATASOURCE_URL: jdbc:postgresql://db:5432/petstore
  SPRING_DATASOURCE_USERNAME: petstore
  SPRING_DATASOURCE_PASSWORD: petstore
```

### SPA Routing
`WebConfig` registers a catch-all: any request that is not `/api/**` and not a static file forwards to `index.html`, enabling Angular client-side routing.

---

## 12. Testing

### Backend Tests
- **Framework:** JUnit 5, Spring Boot Test, Mockito
- **Database:** H2 in-memory (`application-test.yml`)
- **Flyway:** Disabled in tests; schema via `ddl-auto: create-drop`

**Test classes:**
| Class | Type | Coverage |
|-------|------|---------|
| `PetServiceTest` | Unit | PetService CRUD + search |
| `OrderServiceTest` | Unit | Order creation, stock decrement, cancellation restore |
| `PetControllerTest` | Integration (MockMvc) | Pet endpoints, security |
| `OrderControllerTest` | Integration (MockMvc) | Order endpoints, auth rules |
| `PetStoreApplicationTests` | Smoke | Application context loads |

### Running Tests
```bash
cd backend && mvn test
```
