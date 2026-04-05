# Expense Tracker - Complete Setup Guide

A **production-ready** full-stack expense tracker with real API integration.

## Tech Stack

- **Frontend**: Next.js 15 + React + Tailwind CSS + SWR + Framer Motion
- **Backend**: Spring Boot 3.2 (Java 17)
- **Database**: MySQL 8.0

---

## Quick Start

### Prerequisites

1. **Node.js 18+** - [Download](https://nodejs.org/)
2. **Java JDK 17+** - [Download](https://adoptium.net/)
3. **Maven 3.8+** - [Download](https://maven.apache.org/)
4. **MySQL 8.0+** - [Download](https://dev.mysql.com/downloads/)

---

## Step 1: Database Setup

### Create MySQL Database

```sql
-- Login to MySQL as root
mysql -u root -p

-- Run these commands
CREATE DATABASE expense_tracker;
CREATE USER 'expense_user'@'localhost' IDENTIFIED BY 'expense_password';
GRANT ALL PRIVILEGES ON expense_tracker.* TO 'expense_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### Initialize Tables with Sample Data

```bash
mysql -u expense_user -pexpense_password expense_tracker < backend/src/main/resources/schema.sql
```

---

## Step 2: Backend Setup

### Configure Database Connection

Edit `backend/src/main/resources/application.properties`:

```properties
spring.datasource.username=expense_user
spring.datasource.password=expense_password
```

### Build and Run

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

Backend runs at: **http://localhost:8080**

### Verify API Works

```bash
curl http://localhost:8080/api/transactions
curl http://localhost:8080/api/transactions/summary
```

---

## Step 3: Frontend Setup

### Configure API URL

Create `.env.local` in project root:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

### Install and Run

```bash
pnpm install
pnpm dev
```

Frontend runs at: **http://localhost:3000**

---

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/transactions` | Get all transactions |
| GET | `/api/transactions/{id}` | Get by ID |
| POST | `/api/transactions` | Create transaction |
| PUT | `/api/transactions/{id}` | Update transaction |
| DELETE | `/api/transactions/{id}` | Delete transaction |
| GET | `/api/transactions/summary` | Get totals |
| GET | `/api/transactions/filter` | Filter transactions |

### Filter Parameters

- `type`: INCOME or EXPENSE
- `category`: Category name
- `startDate`: YYYY-MM-DD
- `endDate`: YYYY-MM-DD

Example:
```bash
curl "http://localhost:8080/api/transactions/filter?type=EXPENSE&category=Food%20%26%20Dining"
```

---

## Architecture

### Frontend Data Flow

```
Components → SWR Hooks (lib/hooks.ts) → API Client (lib/api.ts) → Spring Boot
```

- **SWR** handles caching, revalidation, and optimistic updates
- **Zustand** only stores local settings (currency, filters)
- All transaction data comes from the real backend

### Key Files

| File | Purpose |
|------|---------|
| `lib/api.ts` | API client with fetch functions |
| `lib/hooks.ts` | SWR hooks for data fetching |
| `lib/store.ts` | Zustand store (settings only) |
| `lib/types.ts` | TypeScript interfaces |

---

## Features

### Dashboard
- Real-time balance, income, expenses
- Income vs Expenses chart (live data)
- Expenses by category chart (live data)
- Recent transactions (live data)

### Transactions
- Add/Edit/Delete with real API calls
- Filter by type, category, date range
- Loading states and error handling
- Optimistic UI updates

### Settings
- Dark/Light/System theme
- Currency selection (persisted locally)
- Profile settings UI

---

## Troubleshooting

### "Failed to load dashboard"

1. Check backend is running: `curl http://localhost:8080/api/transactions`
2. Check `.env.local` has correct API URL
3. Check browser console for CORS errors

### CORS Errors

Backend includes CORS config for `localhost:3000`. If using different port:

Edit `backend/src/main/java/com/expensetracker/config/CorsConfig.java`:

```java
.allowedOrigins("http://localhost:3000", "http://localhost:YOUR_PORT")
```

### Database Connection Failed

1. Verify MySQL is running: `mysql -u expense_user -p`
2. Check credentials in `application.properties`
3. Ensure database exists: `SHOW DATABASES;`

---

## Production Deployment

### Backend

```bash
cd backend
mvn clean package -DskipTests
java -jar target/expense-tracker-0.0.1-SNAPSHOT.jar
```

Use environment variables:
```bash
export SPRING_DATASOURCE_URL=jdbc:mysql://prod-db:3306/expense_tracker
export SPRING_DATASOURCE_USERNAME=prod_user
export SPRING_DATASOURCE_PASSWORD=prod_password
```

### Frontend

```bash
pnpm build
pnpm start
```

Or deploy to Vercel with `NEXT_PUBLIC_API_URL` environment variable.

---

## License

MIT
