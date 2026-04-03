# Backend + Postman (Quick Guide)

## 1) Prerequisites
- Java 17+
- Maven 3.8+
- PostgreSQL running locally

Database config currently used in both backends:
- DB URL: `jdbc:postgresql://localhost:5432/bea`
- DB user: `postgres`
- DB password: `1212`

If needed, change credentials in:
- `bea-admin/src/main/resources/application.properties`
- `bea-client/src/main/resources/application.properties`

## 2) Run BEA Admin backend
```bash
cd bea-admin
mvn clean install
mvn spring-boot:run
```
Runs on: `http://localhost:8080`

## 3) Run BEA Client backend
```bash
cd bea-client
mvn clean install
mvn spring-boot:run
```
Runs on: `http://localhost:8081`

To generate test clients (first run), start with seed profile:
```bash
cd bea-client
mvn spring-boot:run -Dspring-boot.run.profiles=seed
```

## 4) Test with Postman
### Login (Admin)
- Method: `POST`
- URL: `http://localhost:8080/api/auth/login`
- Body (JSON):
```json
{
  "email": "admin@bea.com",
  "password": "admin123"
}
```

### Login (Client)
- Method: `POST`
- URL: `http://localhost:8081/api/auth/login`
- Body (JSON):
```json
{
  "cli": "000010000000001",
  "password": "Test1234"
}
```

Note: client login uses `cli` (not `email`). If this CLI does not exist in your DB, get one with:
```sql
SELECT cli FROM client LIMIT 1;
```

If login succeeds, copy the returned token and use it in Postman:
- Authorization -> Bearer Token -> `<your_token>`
- Or header: `Authorization: Bearer <your_token>`

## 5) Current API base routes (for next endpoints)
- Admin: `http://localhost:8080/api/*`
- Client: `http://localhost:8081/api/*`
- Present base routes in code: `/api/auth`, `/api/credit`, `/api/bourse`
