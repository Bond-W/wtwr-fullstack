# WTWR API (Express + MongoDB)

Backend for **WTWR (What To Wear)** — a simple REST API for user auth and wardrobe items. Built with **Node.js**, **Express**, and **MongoDB (Mongoose)**. Includes JWT auth, input validation via Mongoose, CORS, and robust error handling.

---

## Table of Contents

* [Frontend Repo](#frontend-repository)
* [Features](#features)
* [Tech Stack](#tech-stack)
* [Quick Start](#quick-start)
* [Configuration](#configuration)
* [Project Structure](#project-structure)
* [API Reference](#api-reference)

  * [Auth](#auth)
  * [Users](#users)
  * [Clothing Items](#clothing-items)
* [Errors](#errors)
* [Security Notes](#security-notes)
* [Troubleshooting](#troubleshooting)

---

## Frontend Repository
Frontend repo: https://github.com/Bond-W/se_project_react-1


## Features

* **JWT Authentication** with 7‑day expiry (`Authorization: Bearer <token>`)
* **Sign up / Sign in** with email + password (bcrypt-hashed)
* **Current user** endpoint (`GET /users/me`) and **profile update** (`PATCH /users/me`)
* **Clothing items** CRUD-like ops (create, like/unlike, delete with **ownership check**)
* **CORS enabled** for connecting a separate frontend
* **Consistent error responses**: `{ "message": string }`
* **Password safety**: hashes are never returned from queries (`select: false`)

## Tech Stack

* Node.js (Express)
* MongoDB with Mongoose
* JWT via `jsonwebtoken`
* Password hashing via `bcryptjs`
* Validation via `validator` and Mongoose schema rules
* CORS via `cors`
* Dev tooling: `nodemon`

---

## Quick Start

### Prerequisites

* **Node.js** v18+ (v20 tested)
* **MongoDB** running locally on `mongodb://127.0.0.1:27017`

### Install

```bash
npm install
```

### Environment

Create `.env` (recommended) or use `utils/config.js` fallback:

```bash
# .env
PORT=3001
MONGODB_URI=mongodb://127.0.0.1:27017/wtwr_db
JWT_SECRET=change-this-in-production
```

### Run (dev)

```bash
npm run dev   # nodemon app.js
```

### Run (prod)

```bash
npm start     # node app.js
```

> On start, the app connects to MongoDB and mounts routes at `/`.

---

## Configuration

* **CORS**: enabled globally via `app.use(cors())`. Lock down `origin` in production.
* **JWT Secret**: loaded from `utils/config.js` (prefers `process.env.JWT_SECRET`).
* **Mongo URI**: change default in `app.js` or via `MONGODB_URI`.

---

## Project Structure

```
.
├─ app.js
├─ controllers/
│  ├─ users.js
│  └─ clothingItems.js
├─ routes/
│  ├─ index.js
│  ├─ users.js
│  └─ clothingItems.js
├─ models/
│  ├─ user.js
│  └─ clothingItem.js
├─ middlewares/
│  └─ auth.js
├─ utils/
│  ├─ errors.js
│  └─ config.js
└─ package.json
```

---

## API Reference

### Auth

#### `POST /signup`

Create a new user.

**Body**

```json
{
  "name": "Jane Doe",
  "avatar": "https://example.com/a.png",
  "email": "jane@example.com",
  "password": "secret123"
}
```

**Responses**

* `201` — user (without password)
* `409` — `{ "message": "Email already exists" }` (duplicate)
* `400` — invalid payload

**Example**

```bash
curl -X POST http://localhost:3001/signup \
 -H 'Content-Type: application/json' \
 -d '{"name":"Jane","avatar":"https://ex.com/a.png","email":"jane@example.com","password":"secret"}'
```

#### `POST /signin`

Authenticate and receive a JWT.

**Body**

```json
{ "email": "jane@example.com", "password": "secret" }
```

**Responses**

* `200` — `{ "token": "<jwt>" }`
* `401` — incorrect email or password
* `400` — missing email/password
* `500` — server/db error

---

### Users (protected)

> Requires header: `Authorization: Bearer <token>`

#### `GET /users/me`

Return the current user.

**Responses**

* `200` — user object
* `401` — not authorized
* `404` — user not found

#### `PATCH /users/me`

Update profile (only `name` and/or `avatar`).

**Body** (any subset)

```json
{ "name": "New Name", "avatar": "https://example.com/new.png" }
```

**Responses**

* `200` — updated user
* `400` — validation error
* `401` — not authorized
* `404` — user not found

---

### Clothing Items

#### `GET /items`

Public list of clothing items.

**Responses**

* `200` — array of items

#### `POST /items` (protected)

Create a clothing item (owned by the current user).

**Body**

```json
{ "name": "Hoodie", "weather": "cold", "imageUrl": "https://example.com/hoodie.jpg" }
```

**Responses**

* `201` — created item
* `400` — validation error
* `401` — not authorized

#### `PUT /items/:itemId/likes` (protected)

Like an item.

#### `DELETE /items/:itemId/likes` (protected)

Remove like.

**Responses** (for like/unlike)

* `200` — updated item
* `400` — invalid ID
* `401` — not authorized
* `404` — item not found

#### `DELETE /items/:itemId` (protected)

Delete an item **only if you are the owner**.

**Responses**

* `200` — `{ "message": "Item deleted successfully" }`
* `403` — attempting to delete another user’s item
* `400` — invalid ID
* `401` — not authorized
* `404` — item not found

---

## Errors

All errors return a JSON body:

```json
{ "message": "<human-readable message>" }
```

Common status codes:

* `400 Bad Request`
* `401 Unauthorized`
* `403 Forbidden`
* `404 Not Found`
* `409 Conflict` (duplicate email)
* `500 Internal Server Error`

---

## Security Notes

* Passwords are hashed with **bcryptjs**.
* User schema sets `password: { select: false }`, so hashes are not returned from queries.
* JWT payload contains only `{ _id }` and expires in **7 days**.
* Duplicate email is prevented via a **unique index** and controller pre-check. If duplicates already exist, remove them or drop the collection to allow index creation.

---

## Troubleshooting

* **`Cannot find module 'bcryptjs'`**: `npm i bcryptjs`
* **Duplicate email not returning 409**: ensure unique index exists on `users.email` and/or rely on the controller’s pre-check; handle `err.code === 11000`.
* **`Route.get() requires a callback ... Undefined`**: check that imported controller names match your exports (e.g., `getClothingItems`).
* **JWT errors (401)**: ensure `Authorization: Bearer <token>` header is present on protected routes and that `JWT_SECRET` matches server config.

---


