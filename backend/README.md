# Subscription Manager with Churn Prediction — Backend

Production-ready **Java 21 + Spring Boot 3 + PostgreSQL** REST API for the React frontend.

## Tech stack

| Technology | Purpose |
|------------|---------|
| Java 21 | Runtime |
| Spring Boot 3.3 | Framework |
| Spring Security + JWT | Authentication |
| Spring Data JPA | Persistence |
| PostgreSQL | Database |
| Lombok | Boilerplate reduction |
| Springdoc OpenAPI | Swagger UI |
| Apache POI | Excel export |
| OpenPDF | PDF export |
| Spring Mail | Email notifications |

## Project structure

```
backend/
├── src/main/java/com/subscriptionmanager/
│   ├── config/          Security, JWT, CORS, Swagger, DataInitializer
│   ├── controller/      REST endpoints
│   ├── dto/             Request/response objects
│   ├── entity/          JPA entities
│   ├── exception/       Global exception handling
│   ├── repository/      Spring Data repositories
│   ├── security/        JWT + UserDetails
│   ├── service/         Business interfaces
│   └── service/impl/    Business implementations
├── src/main/resources/
│   └── application.properties
├── docs/schema.sql
└── postman/Subscription-Manager.postman_collection.json
```

## Database setup (PostgreSQL)

1. Install PostgreSQL 14+.
2. Create the database:

```sql
CREATE DATABASE subscription_manager;
```

3. Update credentials in `src/main/resources/application.properties` if needed:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/subscription_manager
spring.datasource.username=postgres
spring.datasource.password=postgres
```

4. Start the app — Hibernate creates/updates tables (`ddl-auto=update`).
5. On first run, `DataInitializer` seeds sample users, payments, subscriptions, and churn scores.

### Default seeded accounts

| Email | Password | Role |
|-------|----------|------|
| admin@example.com | admin123 | ADMIN |
| rahul@example.com | password123 | USER |

## IntelliJ IDEA setup

1. **File → Open** → select the `backend` folder.
2. Wait for Maven import (ensure **JDK 21** is configured: *File → Project Structure → SDK*).
3. Install **Lombok** plugin and enable annotation processing:  
   *Settings → Build → Compiler → Annotation Processors → Enable*.
4. Create a PostgreSQL database `subscription_manager`.
5. Run `SubscriptionManagerApplication` (green play on main class).

## How to run

### IntelliJ

Run `com.subscriptionmanager.SubscriptionManagerApplication`.

### Maven (terminal)

```bash
cd backend
mvn spring-boot:run
```

Server: **http://localhost:8080**

## Swagger / API docs

- Swagger UI: **http://localhost:8080/swagger-ui.html**
- OpenAPI JSON: **http://localhost:8080/v3/api-docs**

Use **Authorize** with `Bearer <token>` from `/api/auth/login`.

## Connect to the React frontend

The frontend (`frontend/`) uses `http://localhost:8080` in `src/services/api.tsx`.

### Already compatible endpoints (no JWT required)

| Method | Endpoint | Frontend usage |
|--------|----------|----------------|
| POST | `/api/users/register` | Register page |
| POST | `/api/users/login` | Login page |
| GET | `/api/users/{id}` | My Account |
| PUT | `/api/users/{id}` | Profile update |
| GET | `/api/payments` | Payments page |
| POST | `/api/payments` | Pay Now |
| PUT | `/api/payments/{txnId}/status?status=Completed` | Retry payment |

### Run full stack

```bash
# Terminal 1 — backend (IntelliJ or Maven)
cd backend && mvn spring-boot:run

# Terminal 2 — frontend
cd frontend && npm run dev
```

Open **http://localhost:5173** and log in with `admin@example.com` / `admin123`.

### Optional: enable JWT on frontend

After `/api/auth/login`, store `data.token` and add to Axios:

```typescript
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

## API overview

### Authentication (`/api/auth`)

| Method | Path | Description |
|--------|------|-------------|
| POST | `/register` | Register + JWT |
| POST | `/login` | Login + JWT |
| POST | `/forgot-password` | Reset token |
| POST | `/change-password` | Change password (auth required) |

### Subscriptions (`/api/subscriptions`)

CRUD with search, filter, pagination: `?search=&status=ACTIVE&page=0&size=10&sortBy=createdAt&direction=DESC`

### Dashboard (`/api/dashboard/stats`)

KPIs: active subscriptions, revenue, churn rate, risk counts, charts.

### Churn (`/api/churn`)

| Method | Path | Description |
|--------|------|-------------|
| POST | `/predict` | Calculate churn score |
| GET | `/high-risk` | High-risk customers |
| POST | `/recalculate` | Recalculate all users |

### Analytics (`/api/analytics`)

- `GET /revenue`
- `GET /churn`
- `GET /dashboard`

### Reports (`/api/reports`)

- `GET /pdf?type=summary`
- `GET /excel?type=summary`

### Notifications (`/api/notifications`)

In-app + email (enable `app.mail.enabled=true`).

### Settings (`/api/settings/user/{userId}`)

Dark mode, email notifications, language, timezone.

### Integrations (`/api/integrations`)

Stripe, Razorpay, PayPal status and test endpoints.

## Sample requests

### Register (JWT)

```http
POST /api/auth/register
Content-Type: application/json

{
  "firstName": "Jane",
  "lastName": "Doe",
  "email": "jane@example.com",
  "password": "password123",
  "phoneNumber": "9876543210",
  "age": 28
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiJ9...",
    "type": "Bearer",
    "user": { "id": 6, "email": "jane@example.com", "firstName": "Jane", ... }
  }
}
```

### Frontend login

```http
POST /api/users/login
Content-Type: application/json

{ "email": "admin@example.com", "password": "admin123" }
```

**Response (direct user object):**

```json
{
  "id": 1,
  "firstName": "Deepika",
  "lastName": "Admin",
  "email": "admin@example.com",
  "phone": "7569138706",
  "age": 25,
  "role": "ADMIN"
}
```

### Churn predict

```http
POST /api/churn/predict
Content-Type: application/json

{
  "customerId": 3,
  "missedPayments": 3,
  "usageFrequency": 15,
  "lastLoginDays": 40,
  "supportTickets": 5,
  "subscriptionDuration": 2
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "customerId": 3,
    "churnProbability": 82.00,
    "churnRisk": "HIGH",
    "reason": "High missed payments; Low usage frequency; Inactive login; ..."
  }
}
```

## Churn prediction logic

Weighted business rules (0–100%):

- Missed payments (up to +45)
- Low usage frequency (+12–25)
- Days since last login (+12–25)
- Support tickets (+2–10)
- Short subscription duration (+15)

| Score | Risk |
|-------|------|
| ≥ 70 | HIGH |
| 40–69 | MEDIUM |
| < 40 | LOW |

## Postman

Import: `postman/Subscription-Manager.postman_collection.json`

Set variable `baseUrl` = `http://localhost:8080`.

## Production notes

- Change `app.jwt.secret` to a long random secret.
- Use environment variables for DB and mail credentials.
- Set `spring.jpa.hibernate.ddl-auto=validate` in production.
- Enable HTTPS and restrict CORS origins.
- Set `app.mail.enabled=true` with real SMTP settings.

## License

MIT — academic / portfolio use.
