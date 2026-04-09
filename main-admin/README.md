# TATKAL Admin Panel

Full-stack MVP admin panel for managing TATKAL SaaS clients, reviewing submitted UI configurations, and simulating deployment of pre-built booking systems.

## Stack

- Frontend: React + Vite + Tailwind CSS
- Backend: Node.js + Express.js
- Database: MongoDB + Mongoose
- Auth: JWT

## Project Structure

```text
main-admin/
  backend/
  client/
```

## Backend Setup

1. Copy `backend/.env.example` to `backend/.env`
2. Fill in MongoDB and JWT values
3. Install dependencies
4. Start the API

```bash
cd main-admin/backend
npm install
npm run dev
```

Optional demo data:

```bash
npm run seed:demo
```

## Frontend Setup

1. Copy `client/.env.example` to `client/.env`
2. Install dependencies
3. Start the Vite app

```bash
cd main-admin/client
npm install
npm run dev
```

## Required Environment Variables

### Backend

- `PORT`
- `MONGO_URI`
- `JWT_SECRET`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`

### Frontend

- `VITE_API_URL`

## MVP Features

- Admin login with JWT
- Protected admin routes
- Dashboard metrics
- Pending request review
- Request detail inspection for nested JSON configs
- Client management overview
- Simulated deployment flow for travel and event systems
- Optional demo seed script for prototype data

## API Endpoints

### Auth

- `POST /api/auth/login`

### Requests

- `GET /api/requests`
- `GET /api/requests/:clientId`
- `PATCH /api/requests/:clientId/approve`
- `GET /api/requests/stats/overview`

### Clients

- `GET /api/clients`

### Deployments

- `GET /api/deploy`
- `POST /api/deploy`

## Notes

- Deployment is simulated for the MVP.
- The platform applies client configuration to pre-built systems. It does not generate code dynamically.
