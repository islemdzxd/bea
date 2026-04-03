# BEA Banking Application

A complete banking platform with a modern Next.js frontend and Java Spring Boot backend. Supports tourist allocations, credit requests, bank transfers, stock trading, and comprehensive account management.

## Project Structure

```
bea/
├── bea-front/        # Next.js React frontend
├── bea-admin/        # Spring Boot admin backend
└── bea-client/       # Spring Boot client backend
```

## Quick Start

### Frontend Setup

```bash
cd bea-front
npm install
npm run dev
```

The app will run on **http://localhost:3000**

See [bea-front/README.md](./bea-front/README.md) for detailed frontend setup.

### Backend Setup

Choose one or both backends based on your needs:

#### BEA Admin Backend

```bash
cd bea-admin
mvn clean install
mvn spring-boot:run
```

Admin backend will run on **http://localhost:8080** (default, check `application.properties`)

#### BEA Client Backend

```bash
cd bea-client
mvn clean install
mvn spring-boot:run
```

Client backend will run on **http://localhost:8081** (or alternate port, check `application.properties`)

### Backend Prerequisites

- **Java 17+** (https://www.oracle.com/java/technologies/downloads/)
- **Maven 3.8+** (https://maven.apache.org/)

Verify installation:
```bash
java -version
mvn -version
```

## Full Stack Development

To run the entire application locally:

1. **Terminal 1 - Frontend**
   ```bash
   cd bea-front
   npm install
   npm run dev
   ```
   → http://localhost:3000

2. **Terminal 2 - Admin Backend**
   ```bash
   cd bea-admin
   mvn clean install
   mvn spring-boot:run
   ```
   → http://localhost:8080

3. **Terminal 3 - Client Backend** (optional)
   ```bash
   cd bea-client
   mvn clean install
   mvn spring-boot:run
   ```
   → http://localhost:8081

## Features Overview

### Frontend (bea-front)
- 🎨 Apple-inspired modern UI with Tailwind CSS v4
- 🌍 Tourist allocation requests with document upload
- 💳 Credit application workflow
- 💸 Bank transfer with RIB/IBAN validation
- 📈 Stock market trading simulator
- 💾 Persistent localStorage state management
- 🔔 Real-time notifications
- 📱 Fully responsive design

### Backend
- RESTful API for banking operations
- Spring Data JPA with database persistence
- Request validation and business logic
- Transaction management
- User/client management

## API Integration (When Ready)

Update frontend `.env.local`:
```bash
NEXT_PUBLIC_API_URL=http://localhost:8080
```

Then update the banking provider to call real API endpoints instead of mock data.

## Build for Production

### Frontend
```bash
cd bea-front
npm run build
npm run start
```

### Backend
```bash
cd bea-admin
mvn clean package
java -jar target/bea-admin-*.jar
```

## Documentation

- [Frontend README](./bea-front/README.md) - Detailed frontend setup, structure, and development notes
- [Backend + Postman Quick Guide](./README-BACKEND-POSTMAN.md) - Minimal steps to run backend and test with Postman
- [Admin Backend Docs](./bea-admin/README.md) - Admin backend configuration (if available)
- [Client Backend Docs](./bea-client/README.md) - Client backend configuration (if available)

## Troubleshooting

### Port conflicts
- Change frontend port: `npm run dev -- -p 3001`
- Change backend port in application.properties: `server.port=8082`

### Dependencies not installing
```bash
# Frontend
cd bea-front
rm -rf node_modules pnpm-lock.yaml
npm install

# Backend
cd bea-admin
mvn clean
mvn install
```

### Build errors
- Ensure Java 17+: `java -version`
- Ensure Maven 3.8+: `mvn -version`
- Ensure Node.js 18+: `node --version`

## Development Workflow

1. Create feature branch: `git checkout -b feature/xyz`
2. Make changes in frontend and/or backend
3. Test locally on all three ports
4. Commit and push: `git push origin feature/xyz`
5. Create pull request

## Testing

### Frontend
```bash
cd bea-front
npm run lint      # Linting
npm run build     # Build validation
```

### Backend
```bash
cd bea-admin
mvn test          # Run unit tests
mvn verify        # Full build verification
```

## Deployment Notes

- Frontend: Deploy as static Next.js app (Vercel, Netlify, or Docker container)
- Backend: Deploy as Spring Boot JAR or WAR on application server (Tomcat, embedded server, Docker)
- Database: Configure connection before deployment
- Environment variables: Set production secrets in deployment environment

## Support

For issues or questions:
1. Check the individual README files in each directory
2. Review backend Spring Boot configuration
3. Check frontend component structure in `features/` and `components/`

---

**Last updated:** April 2, 2026  
**Status:** Core features complete, production hardening ongoing
