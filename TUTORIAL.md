# Developer Tutorial — Pet Store Application

This guide is for developers who are new to this project. It explains **what** this app is, **why** each technology was chosen, and **how** the pieces fit together — using plain language before diving into code.

---

## Table of Contents

1. [What Is This App?](#1-what-is-this-app)
2. [The Big Picture: How the Pieces Fit](#2-the-big-picture-how-the-pieces-fit)
3. [Tech Stack Explained](#3-tech-stack-explained)
4. [Project Structure Tour](#4-project-structure-tour)
5. [Backend Deep Dive: Following a Request](#5-backend-deep-dive-following-a-request)
6. [Frontend Deep Dive: How the UI Works](#6-frontend-deep-dive-how-the-ui-works)
7. [Security: Who Can Do What](#7-security-who-can-do-what)
8. [The Database: How Data Is Stored](#8-the-database-how-data-is-stored)
9. [Key Business Logic: Orders and Stock](#9-key-business-logic-orders-and-stock)
10. [Getting Started: Your First Change](#10-getting-started-your-first-change)
11. [Running Tests](#11-running-tests)
12. [Common Patterns Quick Reference](#12-common-patterns-quick-reference)

---

## 1. What Is This App?

A **pet store management system** with two kinds of users:

- **Customers** — browse pets, add them to a shopping cart, and place orders
- **Admins** — manage the pet catalogue, view all orders, manage inventory, manage customers

The app is a single website. You visit one URL (`http://localhost:8080`) and you get both the interactive UI and the data API from the same server.

**Default admin login:** `admin@petstore.com` / `admin123`

---

## 2. The Big Picture: How the Pieces Fit

```
Your Browser
    │
    │  HTTP requests
    ▼
Spring Boot (Java) — port 8080
    ├── Serves the Angular UI (as static files)
    └── Handles /api/* requests
            │
            │  SQL queries
            ▼
        PostgreSQL database
```

When you open the app in a browser:

1. The browser downloads the **Angular app** (HTML, CSS, JavaScript) from Spring Boot
2. Angular renders the UI and takes over navigation inside the browser
3. When Angular needs data (e.g., list of pets), it makes an **HTTP request** to `/api/pets`
4. Spring Boot handles that request, queries PostgreSQL, and returns **JSON**
5. Angular shows the JSON data to the user

This architecture is called a **monolith with a SPA frontend**. Everything ships as one JAR file.

---

## 3. Tech Stack Explained

### Backend

| Technology | What it is | Why it's used here |
|---|---|---|
| **Java 21** | The programming language | Mature, fast, strongly typed |
| **Spring Boot 4** | A framework that wires your app together automatically | Eliminates boilerplate — you write a class, Spring finds it and runs it |
| **Spring Data JPA** | Turns Java classes into database tables | Write a Java class, get SQL queries for free |
| **Spring Security** | Handles login, logout, and access control | Built into Spring, works with sessions out of the box |
| **Flyway** | Manages database schema changes | Each change is a numbered SQL file — your DB schema is version-controlled |
| **PostgreSQL** | The database | Reliable, widely used relational database |

### Frontend

| Technology | What it is | Why it's used here |
|---|---|---|
| **Angular 19** | A JavaScript framework for building UIs | Structured, typed, has routing, forms, and HTTP built in |
| **TypeScript** | JavaScript with types | Catches bugs early, better editor support |
| **Angular Signals** | A reactive state primitive | The modern Angular way to share state between components |
| **Bootstrap 5** | A CSS framework | Pre-built styles and layout grid — no custom CSS needed for basics |
| **SCSS** | An enhanced version of CSS | Supports variables and nesting |

### Build & Infrastructure

| Technology | What it is | Why it's used here |
|---|---|---|
| **Maven** | A Java build tool | Builds both frontend and backend in one command |
| **Docker Compose** | Runs multiple containers together | One command starts both the app and PostgreSQL |
| **Node.js / npm** | JavaScript runtime and package manager | Required to build Angular |

---

## 4. Project Structure Tour

```
petstore/
├── backend/                       ← Java / Spring Boot
│   └── src/main/java/com/petstore/
│       ├── PetStoreApplication.java   ← The main() method. App starts here.
│       ├── config/
│       │   ├── SecurityConfig.java    ← Who can access what URL
│       │   └── WebConfig.java         ← Makes Angular routing work
│       ├── security/
│       │   ├── PetStoreUserPrincipal.java     ← The logged-in user object
│       │   └── PetStoreUserDetailsService.java ← Loads user from DB at login
│       ├── controller/            ← HTTP endpoints (the "front door" of the API)
│       ├── service/               ← Business logic (the "brain")
│       ├── repository/            ← Database queries (the "hands")
│       ├── entity/                ← Database table definitions (Java classes)
│       ├── dto/                   ← Data shapes sent over HTTP (request/response)
│       ├── mapper/                ← Converts entity ↔ DTO
│       └── exception/             ← Error handling
│
├── frontend/                      ← Angular / TypeScript
│   └── src/app/
│       ├── app.routes.ts          ← URL → component mapping
│       ├── app.config.ts          ← App-level setup (interceptors, providers)
│       ├── components/            ← UI screens (one folder per page)
│       ├── services/              ← HTTP calls to the backend + cart state
│       ├── models/                ← TypeScript interfaces (data shapes)
│       └── guards/                ← Route protection (auth check before navigation)
│
├── Dockerfile                     ← How to build a container image
├── docker-compose.yml             ← How to run app + database together
└── pom.xml                        ← Maven build configuration
```

### The Backend Layered Architecture

The backend follows a strict layered pattern. Data flows in one direction:

```
HTTP Request
    │
    ▼
Controller      ← Receives HTTP, validates input, calls service
    │
    ▼
Service         ← Business rules, orchestrates work, calls repository
    │
    ▼
Repository      ← Runs SQL, talks to the database
    │
    ▼
Database
```

And coming back up:

```
Database → Entity → Mapper → DTO → Controller → HTTP Response (JSON)
```

**Why this separation?**
- Controllers don't contain business logic — they just translate HTTP ↔ Java
- Services don't know about HTTP — they just work with Java objects
- Repositories don't contain business logic — they just query the database
- This makes each layer easy to test and change independently

---

## 5. Backend Deep Dive: Following a Request

Let's trace what happens when a browser requests `GET /api/pets/1`.

### Step 1: The Controller receives the request

`backend/src/main/java/com/petstore/controller/PetController.java`

```java
@RestController
@RequestMapping("/api/pets")      // ← all methods in this class live under /api/pets
public class PetController {

    @GetMapping("/{id}")           // ← handles GET /api/pets/{id}
    public PetDto findById(@PathVariable Long id) {
        return petService.findById(id);  // ← delegates to the service
    }
}
```

`@RestController` tells Spring: "turn the return value into JSON automatically."
`@PathVariable Long id` extracts the `1` from the URL and passes it to the method.

### Step 2: The Service does the work

`backend/src/main/java/com/petstore/service/PetService.java` (simplified):

```java
@Service
public class PetService {

    public PetDto findById(Long id) {
        Pet pet = repository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Pet not found with id: " + id));
        return mapper.toDto(pet);
    }
}
```

- It asks the repository for the pet
- If not found, throws an exception — `GlobalExceptionHandler` catches this and returns a `404` JSON response automatically
- Converts the `Pet` entity into a `PetDto` using the mapper

### Step 3: The Repository queries the database

```java
public interface PetRepository extends JpaRepository<Pet, Long> {
    // findById is inherited for free — Spring Data generates the SQL
}
```

Spring Data generates `SELECT * FROM pets WHERE id = ?` automatically. No SQL needed for basic queries.

### Step 4: The Entity represents a database row

```java
@Entity
@Table(name = "pets")
public class Pet {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private BigDecimal price;
    private Integer stock;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;
    // ... getters/setters
}
```

Each field maps to a database column. `@ManyToOne` creates a foreign key relationship — a pet belongs to one category.

### Step 5: The Mapper converts Entity → DTO

**Why have both an Entity and a DTO?** The entity maps to the database — it contains everything. The DTO is what you send over the network — only what the client needs. This lets you change the database schema without breaking the API, and vice versa.

```java
// DTOs are Java records — immutable, concise
public record PetDto(
    Long id,
    String name,
    BigDecimal price,
    String categoryName,   // ← flattened from the Category entity
    PetStatus status
    // ... more fields
) {}
```

### What does the final JSON response look like?

```json
{
  "id": 1,
  "name": "Buddy",
  "type": "Dog",
  "breed": "Golden Retriever",
  "price": 499.99,
  "status": "AVAILABLE",
  "stock": 3,
  "categoryName": "Dog"
}
```

### Error responses

If pet `id=99` doesn't exist, the response is a `404` with:

```json
{
  "status": 404,
  "message": "Pet not found with id: 99",
  "timestamp": "2026-02-28T10:30:00"
}
```

This comes from `GlobalExceptionHandler` — one place handles all errors for the whole app.

---

## 6. Frontend Deep Dive: How the UI Works

### How Angular fits into the app

Spring Boot serves `index.html` (the Angular app) for any URL that is not an API call. Once the browser loads `index.html`, Angular takes over and handles all navigation without ever reloading the page. This is called a **Single Page Application (SPA)**.

### Routes: URL → Component

`frontend/src/app/app.routes.ts` maps URLs to UI components:

```typescript
export const routes: Routes = [
  { path: 'pets', loadComponent: () =>
      import('./components/pet-list/pet-list.component')
        .then(m => m.PetListComponent) },
  { path: 'pets/:id', loadComponent: () =>
      import('./components/pet-detail/pet-detail.component')
        .then(m => m.PetDetailComponent) },
  { path: 'pets/new', loadComponent: () =>
      import('./components/pet-form/pet-form.component')
        .then(m => m.PetFormComponent), canActivate: [adminGuard] },
];
```

`loadComponent` with `import(...)` is **lazy loading** — the code for a component is only downloaded when the user navigates to that route. This keeps the initial page load fast.

`canActivate: [adminGuard]` means Angular will check `adminGuard` before rendering the component. If the check fails, the user is redirected.

### Standalone Components

All components in this project are **standalone** — they declare their own dependencies and don't belong to an NgModule.

```typescript
@Component({
  selector: 'app-pet-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],  // ← component declares what it needs
  templateUrl: './pet-list.component.html',
})
export class PetListComponent {
  // ...
}
```

### Services: talking to the backend

`frontend/src/app/services/pet.service.ts` is a thin wrapper around Angular's `HttpClient`:

```typescript
@Injectable({ providedIn: 'root' })
export class PetService {
  private readonly apiUrl = '/api/pets';

  constructor(private http: HttpClient) {}

  getAll(params?: HttpParams): Observable<PagedResponse<Pet>> {
    return this.http.get<PagedResponse<Pet>>(this.apiUrl, { params });
  }

  getById(id: number): Observable<Pet> {
    return this.http.get<Pet>(`${this.apiUrl}/${id}`);
  }
}
```

`Observable` is like a promise that can emit multiple values. Components subscribe to it to get the data.

### Cart State: Angular Signals

The shopping cart lives entirely in memory in the browser — nothing is saved to the backend until checkout.

`frontend/src/app/services/cart.service.ts`:

```typescript
@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly _items = signal<CartItem[]>([]);   // ← private writable signal

  readonly items = this._items.asReadonly();           // ← public read-only view
  readonly itemCount = computed(() =>                  // ← auto-updates when items change
    this._items().reduce((sum, item) => sum + item.quantity, 0)
  );
  readonly total = computed(() =>
    this._items().reduce((sum, item) => sum + item.pet.price * item.quantity, 0)
  );
}
```

**What is a signal?** A signal holds a value that Angular tracks. When the value changes, any component that reads the signal re-renders automatically. `computed()` creates a derived value that stays in sync.

In a template you use it like a function call:

```html
<span>{{ cartService.itemCount() }} items</span>
<span>Total: ${{ cartService.total() | number:'1.2-2' }}</span>
```

### Auth State

`AuthService` works the same way — it holds the current user as a signal:

```typescript
readonly currentUser = this._currentUser.asReadonly();
readonly isLoggedIn  = computed(() => this._currentUser() !== null);
readonly isAdmin     = computed(() => this._currentUser()?.role === 'ADMIN');
```

The header component reads `isAdmin()` to decide which nav items to show.

### Guards: protecting routes

`frontend/src/app/guards/auth.guard.ts`:

```typescript
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.isLoggedIn()) return true;
  return router.createUrlTree(['/login']);
};

export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.isAdmin()) return true;
  if (auth.isLoggedIn()) return router.createUrlTree(['/pets']);
  return router.createUrlTree(['/login']);
};
```

These run before a route loads. If they return `false` or a URL tree, navigation is cancelled or redirected.

---

## 7. Security: Who Can Do What

### How login works

1. User submits email + password to `POST /api/auth/login`
2. Spring Security checks the credentials against the `users` table (passwords are stored as BCrypt hashes)
3. On success, Spring creates an **HTTP session** and sends back a session cookie
4. Every subsequent request automatically includes that cookie
5. Spring looks up the session, finds the user, and knows who is making the request

### Access levels

| Who | Can do |
|-----|--------|
| **Anonymous** (not logged in) | Browse pets, categories, inventory |
| **Customer** (logged in) | + Place orders, view own orders, edit own profile |
| **Admin** | + Everything: manage pets/categories/customers/orders/inventory |

### How Spring Security enforces this

`SecurityConfig.java` declares the rules:

```java
.authorizeHttpRequests(auth -> auth
    .requestMatchers(HttpMethod.GET, "/api/pets/**").permitAll()   // anyone can read
    .requestMatchers("/api/pets/**").hasRole("ADMIN")              // only admins can write
    .requestMatchers("/api/me/**").authenticated()                 // must be logged in
    .anyRequest().authenticated()
)
```

These rules are checked on every request before it reaches your controller.

### Two separate "user" concepts

This app has two separate concepts that are easy to confuse:

- **`User`** — the authentication entity: email, hashed password, role. Every person who can log in has one.
- **`Customer`** — the business entity: name, phone, address, orders. Only customer-role users have one.

When an admin logs in, they have a `User` record but **no** `Customer` record. That's why `GET /api/me/profile` returns 404 for admins.

---

## 8. The Database: How Data Is Stored

### Schema management with Flyway

Flyway runs SQL migration files in order on startup. Never edit old migration files — always add a new one.

```
backend/src/main/resources/db/migration/
├── V1__create_categories.sql
├── V2__create_pets.sql
├── V3__create_customers.sql
├── V4__create_orders.sql
├── V5__seed_categories.sql
├── V6__seed_pets.sql
└── V7__create_users.sql
```

To change the schema, create `V8__your_description.sql`. Flyway will detect it and run it on the next app start.

### Entity relationships

```
Category ──< Pet ──< OrderItem >── Order >── Customer
                                              │
                                              └── User (one-to-one, optional)
```

- One category has many pets
- One order has many order items
- Each order item references one pet (and snapshots its price at order time)
- One customer has many orders
- One customer optionally links to one user

---

## 9. Key Business Logic: Orders and Stock

This is the most important and interesting part of the backend.

### Creating an order is atomic

`backend/src/main/java/com/petstore/service/OrderService.java`

```java
@Transactional   // ← if anything fails, ALL changes are rolled back
public OrderDto createOrder(OrderCreateDto dto) {
    Customer customer = customerService.getEntity(dto.customerId());

    Order order = new Order();
    order.setCustomer(customer);
    order.setStatus(OrderStatus.PENDING);

    for (OrderItemCreateDto itemDto : dto.items()) {
        Pet pet = petService.getEntity(itemDto.petId());

        // Check stock BEFORE reserving
        if (pet.getStock() < itemDto.quantity()) {
            throw new InsufficientStockException(...);  // rolls back everything
        }

        // Decrement stock
        pet.setStock(pet.getStock() - itemDto.quantity());
        if (pet.getStock() == 0) {
            pet.setStatus(PetStatus.SOLD);  // automatically mark as sold
        }

        // Snapshot the price — price might change later but order records what you paid
        OrderItem item = new OrderItem();
        item.setPrice(pet.getPrice());  // ← snapshot!
        order.getItems().add(item);
    }

    return mapper.toDto(repository.save(order));
}
```

**Why `@Transactional`?** Imagine an order for two pets. We decrement stock for pet A successfully, but pet B is out of stock. Without a transaction, the stock change for pet A would be saved even though the order failed. With `@Transactional`, if anything throws an exception, the entire operation is rolled back as if nothing happened.

### Cancelling an order restores stock

```java
@Transactional
public OrderDto updateStatus(Long id, OrderStatus status) {
    Order order = getEntity(id);

    if (status == OrderStatus.CANCELLED && order.getStatus() != OrderStatus.CANCELLED) {
        for (OrderItem item : order.getItems()) {
            Pet pet = item.getPet();
            pet.setStock(pet.getStock() + item.getQuantity());  // restore stock
            if (pet.getStatus() == PetStatus.SOLD) {
                pet.setStatus(PetStatus.AVAILABLE);  // un-sold the pet
            }
        }
    }

    order.setStatus(status);
    return mapper.toDto(repository.save(order));
}
```

---

## 10. Getting Started: Your First Change

### Step 1: Start the app

```bash
docker compose up --build
```

Open `http://localhost:8080`. Log in as admin: `admin@petstore.com` / `admin123`.

### Step 2: Try the API directly

While the app is running, open a terminal:

```bash
# Get all pets
curl http://localhost:8080/api/pets | python3 -m json.tool

# Get a specific pet
curl http://localhost:8080/api/pets/1 | python3 -m json.tool

# Search
curl "http://localhost:8080/api/pets/search?q=golden" | python3 -m json.tool
```

### Step 3: Start local development mode

For fast iteration without rebuilding Docker:

**Terminal 1 — Backend:**
```bash
# Make sure you have PostgreSQL running locally first
cd backend
mvn spring-boot:run
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm install
npm start     # starts at http://localhost:4200
```

The frontend dev server at port 4200 proxies `/api` requests to the backend on port 8080. Any change you save to a TypeScript or HTML file is reflected instantly in the browser.

### Step 4: Add a new field to Pet (example walkthrough)

Say you want to add a `color` field to pets.

**a) Database: add a migration**

Create `backend/src/main/resources/db/migration/V8__add_pet_color.sql`:
```sql
ALTER TABLE pets ADD COLUMN color VARCHAR(50);
```

**b) Entity: add the field**

In `Pet.java`:
```java
private String color;
// + getter + setter
```

**c) DTO: expose it in the API**

In `PetDto.java` (a Java record, add it to the parameter list):
```java
public record PetDto(
    Long id,
    String name,
    String color,   // ← new
    // ...
) {}
```

Do the same in `PetCreateDto.java` so it can be set on create/update.

**d) Mapper: map it**

In `PetMapper.java`, include `color` when constructing `PetDto`.

**e) Frontend: show it**

Add `color?: string` to the `Pet` interface in `frontend/src/app/models/pet.model.ts`, then display it in the pet detail template.

That's the full loop: migration → entity → DTO → mapper → frontend model → template.

---

## 11. Running Tests

```bash
cd backend
mvn test
```

Tests use an **H2 in-memory database** — no PostgreSQL needed. The test profile (`application-test.yml`) sets `spring.jpa.hibernate.ddl-auto: create-drop`, which creates the schema from the entity classes and drops it at the end. Flyway is disabled in tests.

### What's tested

| Test class | What it covers |
|---|---|
| `PetServiceTest` | Unit tests for PetService — uses Mockito to mock the repository |
| `OrderServiceTest` | Unit tests for order creation and cancellation, including stock changes |
| `PetControllerTest` | Integration tests using MockMvc — tests HTTP endpoints including security rules |
| `OrderControllerTest` | Integration tests for order endpoints |
| `PetStoreApplicationTests` | Smoke test — just checks the Spring context loads without errors |

### Example: what a unit test looks like

```java
@Test
void createOrder_insufficientStock_throws() {
    // Arrange: set up a pet with only 1 in stock
    Pet pet = new Pet();
    pet.setStock(1);
    when(petRepository.findById(1L)).thenReturn(Optional.of(pet));

    // Act + Assert: ordering 5 should fail
    OrderCreateDto dto = new OrderCreateDto(customerId, List.of(
        new OrderItemCreateDto(1L, 5)  // requesting 5
    ));
    assertThrows(InsufficientStockException.class, () -> orderService.createOrder(dto));
}
```

---

## 12. Common Patterns Quick Reference

### Backend

**Throwing a 404:**
```java
throw new ResourceNotFoundException("Pet not found with id: " + id);
```
`GlobalExceptionHandler` catches this and returns a JSON 404 response.

**Requiring a transaction:**
```java
@Transactional
public SomeDto doSomethingThatModifiesData(...) { ... }
```
Add this to any service method that writes to the database.

**Getting the logged-in user in a controller:**
```java
@GetMapping("/me/profile")
public CustomerDto getProfile(@AuthenticationPrincipal PetStoreUserPrincipal principal) {
    return customerService.findById(principal.getCustomerId());
}
```

**Validating request input:**
```java
public record PetCreateDto(
    @NotBlank String name,
    @DecimalMin("0.01") BigDecimal price
) {}

// In the controller:
public PetDto create(@Valid @RequestBody PetCreateDto dto) { ... }
```
`@Valid` triggers validation. If it fails, `GlobalExceptionHandler` returns a 400 with the error messages.

### Frontend

**Calling the API in a component:**
```typescript
export class PetListComponent implements OnInit {
  pets: Pet[] = [];

  constructor(private petService: PetService) {}

  ngOnInit() {
    this.petService.getAll().subscribe(page => {
      this.pets = page.content;
    });
  }
}
```

**Reading a signal in a template:**
```html
<!-- cartService.itemCount() — note the () to call the signal -->
<span>{{ cartService.itemCount() }} items</span>
```

**Using a route parameter:**
```typescript
export class PetDetailComponent implements OnInit {
  constructor(private route: ActivatedRoute, private petService: PetService) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.petService.getById(id).subscribe(pet => this.pet = pet);
  }
}
```

**Navigating programmatically:**
```typescript
constructor(private router: Router) {}

goToOrder(id: number) {
  this.router.navigate(['/orders', id]);
}
```

### How the Angular build gets into the JAR

The Maven build runs the Angular build first (via `frontend-maven-plugin`), copies the output into `backend/src/main/resources/static/`, then packages the Spring Boot JAR. Spring Boot automatically serves files from `static/` at the root URL. The `WebConfig` catch-all ensures any URL that Angular manages (like `/pets/1`) serves `index.html` so Angular can handle it.

---

## Where to Go Next

- **Add a feature end-to-end:** start with the Flyway migration, work up through entity → DTO → service → controller → frontend model → component
- **Read the spec:** `spec.md` has the complete API reference and data model
- **Read the existing controllers and services:** they are short and follow the same pattern throughout — reading one teaches you all of them
- **Run the tests and read them:** tests are the best documentation for what the code is supposed to do
