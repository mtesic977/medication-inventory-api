# Medication Inventory API

Backend technical assessment project built with **Node.js, Express, TypeScript, PostgreSQL, Prisma, Zod, Docker, Vitest, and Supertest**.

This service provides a REST API for tracking controlled medication inventory inside a healthcare facility, including full audit logging and strict transaction validation rules.

---

# 🚀 Getting Started

## Prerequisites

* Docker
* Docker Compose

No local Node.js or PostgreSQL installation is required.

---

## Run the application

```bash
docker compose up --build
```

This command will automatically:

* Start PostgreSQL
* Install dependencies
* Run Prisma migrations
* Seed the database
* Start the API server with hot reload

The API will be available at:

```
http://localhost:3000/api
```

---

## Run tests

```bash
docker compose exec meds-api npm test
```

Tests are implemented using:

* **Vitest** for the test runner
* **Supertest** for HTTP endpoint testing
* **Mocked Prisma client** (tests do not require a running database)

---

# 🧱 Architecture Overview

## Tech stack

* **Express + TypeScript** — REST API and type safety
* **Prisma + PostgreSQL** — database access and schema management
* **Zod** — runtime request validation and type inference
* **Docker** — reproducible local environment
* **Vitest + Supertest** — automated testing

Project follows a **layered architecture**:

```
controllers → services → repositories (Prisma) → database
```

### Key principles

* Separation of concerns
* Strong typing across layers
* Centralized error handling
* Automatic audit logging

---

# 🗄️ Database Models

## Medication

* id
* name
* schedule (II, III, IV, V)
* unit (mg, ml, mcg)
* current stock quantity

## User

* id
* email
* name
* role (NURSE, WITNESS, ADMIN)

## Transaction

* id
* medicationId
* nurseId
* witnessId
* type (CHECKOUT, RETURN, WASTE)
* quantity
* notes
* timestamp

## AuditLog

* id
* action
* entityType
* entityId
* performedBy
* details (JSON)
* timestamp

---

# 🔌 API Endpoints

All endpoints are prefixed with:

```
/api
```

## Medications

### GET `/medications`

* Returns all medications
* Supports filter: `?schedule=II`

### GET `/medications/:id`

* Returns a single medication
* Includes full transaction history

---

## Transactions

### POST `/transactions`

Creates a medication transaction.

#### Rules

* **CHECKOUT** → decreases stock, rejected if insufficient quantity
* **RETURN** → increases stock
* **WASTE** → stock unchanged, **requires notes**
* `witnessId` **must differ** from `nurseId`
* **AuditLog entry is created automatically**

### GET `/transactions`

* List all transactions
* Filters:

  * `?type=CHECKOUT`
  * `?medicationId=`

---

## Audit Log

### GET `/audit-log`

* Returns audit log entries
* Supports filter: `?entityType=`

---

# ❗ Error Handling

The API returns consistent JSON error responses:

```json
{
  "success": false,
  "message": "Validation failed",
  "details": {}
}
```

Features:

* Proper HTTP status codes
* Zod validation errors formatted for clients
* Centralized Express error middleware

---

# 🧪 Testing Strategy

Covered scenarios:

### Transaction creation

* Successful checkout/return/waste
* Insufficient stock rejection
* Missing notes for waste
* Same nurse and witness rejection

### Stock calculation

* Checkout decreases quantity
* Return increases quantity
* Waste leaves quantity unchanged

### Input validation

* Missing required fields
* Invalid types
* Invalid enum values

---

# 🐳 Docker Setup

`docker-compose.yml` starts:

* **PostgreSQL database**
* **API container with hot reload**

Database migrations and seed script run automatically on startup.

---

# ⚖️ Design Decisions & Tradeoffs

### Prisma over raw SQL

Chosen for:

* Type safety
* Faster development
* Built‑in migrations

Tradeoff: less control over complex SQL optimizations.

---

### Zod for validation

Provides:

* Runtime validation
* Shared types between validation and TypeScript
* Clear error formatting

---

### Layered architecture

Benefits:

* Testable business logic
* Easy refactoring
* Clear separation of responsibilities

---

# ⭐ Bonus Features (if implemented)

* Pagination on list endpoints
* OpenAPI / Swagger documentation
* Rate limiting middleware
* Request logging

---

# 📚 API Documentation

Interactive OpenAPI (Swagger) documentation is available at:

```
http://localhost:3000/api/docs
```

The documentation includes:

* All available endpoints
* Request/response schemas
* Validation rules
* Ability to execute requests directly from the browser

---

# 📌 Notes

This project was completed as part of a **Backend Developer technical assessment** with a focus on:

* Rename .env.example to .env before running the project.
* In real production environments, environment files must not be committed and should be managed via secure configuration or secrets management.
* Clean architecture
* Correct domain rules
* Type safety
* Test coverage
* Production‑ready Docker setup

---
