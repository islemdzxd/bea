# BEA Project - Quick Start

Small guide to run the full project (both backends + frontend).

## Prerequisites
- Java 17+
- Maven 3.8+
- Node.js 20+
- pnpm (`npm i -g pnpm`)
- PostgreSQL running locally

## 1) Database setup
Create a PostgreSQL database named `bea`.

Current backend DB config:
- URL: `jdbc:postgresql://localhost:5432/bea`
- User: `postgres`
- Password: `1212`

If needed, change credentials in:
- `bea-admin/src/main/resources/application.properties`
- `bea-client/src/main/resources/application.properties`

## 2) Run backend services
Open two terminals from the project root.

Terminal A (Admin API - port `8080`):
```bash
cd bea-admin
mvn clean install
mvn spring-boot:run
```

Terminal B (Client API - port `8081`):
```bash
cd bea-client
mvn clean install
mvn spring-boot:run
```

Optional (first run seed data for client):
```bash
cd bea-client
mvn spring-boot:run -Dspring-boot.run.profiles=seed
```

## 3) Run frontend
Open a third terminal from the project root:

```bash
cd bea-front
pnpm install
pnpm dev
```

Frontend runs on `http://localhost:3000` by default.

## Services
- Admin backend: `http://localhost:8080`
- Client backend: `http://localhost:8081`
- Frontend: `http://localhost:3000`

## Useful existing backend API notes
See `README-BACKEND-POSTMAN.md` for quick Postman login requests and API base routes.
