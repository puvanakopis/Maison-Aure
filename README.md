# Maison·Auré — Luxury Dining Platform & Haute Cuisine API

A full-stack culinary web application featuring Next.js 15, Tailwind CSS, Motion animations, and a decoupled Express.js REST API backend with persistent data storage and JWT security.

---

## Architecture Overview

```
Maison·Auré/
├── backend/                   # Express.js REST API Server (Port 5000)
│   ├── src/
│   │   ├── config/            # MongoDB Connection (db.js) & Seeder (seedData.js)
│   │   ├── models/            # Mongoose Models (ItemModel, ReservationModel, UserModel)
│   │   ├── controllers/       # Auth, Menu Items, & Reservations Controllers
│   │   ├── routes/            # Express Route Handlers
│   │   ├── middleware/        # JWT Authentication Guard & Error Handler
│   │   └── server.js          # Express Application Entry Point
│   ├── .env                   # Server Port, JWT Secret, Admin Credentials, MONGODB_URI
│   └── package.json
└── frontend/                  # Next.js 15 App Router Frontend (Port 3000)
    ├── src/
    │   ├── app/
    │   │   ├── page.tsx       # Public Haute Cuisine Homepage & Live Teaser Menu
    │   │   ├── menu/          # Public Full Categorized Menu
    │   │   ├── reservations/  # Public Table Reservation & Live Status Tracker
    │   │   └── admin/         # Executive Management Suite (Dashboard, Items, Orders)
    │   └── lib/
    │       ├── api.ts         # Centralized Fetch API Client with Bearer Token Auth
    │       └── admin-store.tsx# Unified State Store with Live Backend Synchronization
    └── .env.local             # NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## Quick Start

### 1. Configure & Start the Backend API (Port 5000)

```bash
cd backend
npm install

# Seed initial restaurant dishes & sample bookings (node src/config/seedData.js)
npm run seed

# Start development server
npm run dev
```

#### MongoDB Configuration
In `backend/.env`, configure your MongoDB connection:
- **Local MongoDB**:
  ```env
  MONGODB_URI=mongodb://localhost:27017/maison_aure
  ```
- **MongoDB Atlas (Cloud)**:
  ```env
  MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/maison_aure?retryWrites=true&w=majority
  ```

*On initial connection to MongoDB, the backend automatically seeds your collections (`items` and `reservations`) with the restaurant's signature dishes and initial booking data.*

### 2. Start the Frontend (Port 3000)

```bash
cd frontend
npm install
npm run dev
```

Visit:
- **Public Restaurant Portal**: [http://localhost:3000](http://localhost:3000)
- **Reserve a Table**: [http://localhost:3000/reservations](http://localhost:3000/reservations)
- **Menu**: [http://localhost:3000/menu](http://localhost:3000/menu)
- **Admin Executive Portal**: [http://localhost:3000/admin](http://localhost:3000/admin)
- **API Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## Admin Credentials

- **Email**: `admin@maisonaure.com`
- **Password**: `admin123`

---

## API Endpoints Reference

### Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/login` | Public | Validates executive credentials and returns signed JWT token |
| `GET` | `/api/auth/me` | Protected | Returns authenticated administrator profile |

### Menu Items (`/api/items`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/items` | Public | Returns all active menu items (supports `?category=` and `?search=`) |
| `GET` | `/api/items/categories` | Public | Returns menu categories list |
| `GET` | `/api/items/:id` | Public | Returns specific menu item details |
| `POST` | `/api/items` | Admin (JWT) | Creates a new dish or cocktail with image, price, ingredients |
| `PUT` | `/api/items/:id` | Admin (JWT) | Updates existing item details |
| `DELETE` | `/api/items/:id` | Admin (JWT) | Deletes item from restaurant menu |
| `POST` | `/api/items/reset` | Admin (JWT) | Restores original chef signature items |

### Table Reservations (`/api/reservations` & `/api/orders`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/reservations` | Public (User) | Submits a guest booking; generates confirmation reference code (`ORD-XXXX`) |
| `GET` | `/api/reservations/lookup` | Public (User) | Allows guests to track request status by confirmation code or email |
| `GET` | `/api/orders` | Admin (JWT) | Returns all bookings with status filter (`Pending`, `Confirmed`, `Completed`, `Cancelled`) |
| `GET` | `/api/orders/stats` | Admin (JWT) | Aggregates seated covers, pending approvals, and revenue analytics |
| `PATCH` | `/api/orders/:id` | Admin (JWT) | Updates status (e.g. approve/confirm, seat, cancel) and assigns table numbers |
| `DELETE` | `/api/orders/:id` | Admin (JWT) | Removes or rejects booking |

---

## Production Deployment Guide

### Option 1: Full Vercel Deployment (Frontend & Backend Serverless)

Both the Next.js frontend and Express REST API backend are configured to deploy seamlessly on [Vercel](https://vercel.com).

#### Step 1: Deploy Backend API on Vercel
1. In the Vercel Dashboard, click **Add New...** > **Project** and select your repository.
2. Under **Root Directory**, click **Edit** and choose `backend`.
3. Framework Preset: **Other**.
4. In **Environment Variables**, add:
   - `MONGODB_URI`: `mongodb+srv://<user>:<password>@cluster0.mongodb.net/maison_aure?retryWrites=true&w=majority`
   - `NODE_ENV`: `production`
   - `JWT_SECRET`: A long random secret string
   - `JWT_EXPIRES_IN`: `7d`
   - `ADMIN_NAME`: `Executive Admin`
   - `ADMIN_EMAIL`: `admin@maisonaure.com`
   - `ADMIN_PASSWORD`: Your chosen secure admin password
   - `FRONTEND_URL`: `*` (or your frontend Vercel URL once deployed)
5. Click **Deploy**. Note your backend domain (e.g., `https://maison-aure-api.vercel.app`).

#### Step 2: Deploy Frontend on Vercel
1. In the Vercel Dashboard, import the same repository as a second project.
2. Under **Root Directory**, choose `frontend`.
3. Framework Preset: **Next.js**.
4. In **Environment Variables**, add:
   - `NEXT_PUBLIC_API_URL`: `https://<your-backend-project>.vercel.app/api`
5. Click **Deploy**.

---

### Option 2: Render / Railway (Backend) + Vercel (Frontend)

You can also deploy the backend as a traditional long-running Node.js process using [`render.yaml`](file:///c:/Users/Asus/Downloads/Maison%C2%B7Aur%C3%A9/render.yaml) or Render / Railway dashboard with `Root Directory: backend` and `Start Command: npm start`.


