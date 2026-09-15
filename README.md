# Noted — MERN Authentication App

A full-stack notes application with complete user authentication, built with the MERN stack (MongoDB, Express, React, Node.js).

## Features

- **User signup** with name, email, and password
- **User login** with email and password
- **Password hashing** via bcrypt (12-round salt)
- **JWT-based authentication** with Bearer tokens
- **Protected API routes** — notes are only accessible when authenticated
- **Protected frontend routes** — unauthenticated users are redirected to login
- **Logout** clears the token and redirects to login
- **Input validation** on both client and server (express-validator)
- **Per-user data isolation** — each user only sees their own notes

## Tech Stack

| Layer      | Technology                          |
| ---------- | ----------------------------------- |
| Frontend   | React 18, React Router 6, Vite     |
| Backend    | Express 4, Node.js                 |
| Database   | MongoDB with Mongoose 8            |
| Auth       | bcryptjs, jsonwebtoken              |
| Validation | express-validator                   |

## Project Structure

```
mern-auth-app/
├── server/
│   ├── config/db.js            # MongoDB connection
│   ├── middleware/auth.js      # JWT verification middleware
│   ├── models/User.js          # User schema + password hashing
│   ├── routes/auth.js          # POST /signup, POST /login, GET /me
│   ├── routes/notes.js         # CRUD notes (protected)
│   ├── server.js               # Express entry point
│   └── .env.example            # Environment variable template
├── client/
│   ├── src/
│   │   ├── context/AuthContext.jsx   # Auth state + API calls
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   └── Dashboard.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   └── vite.config.js          # Dev proxy to backend
├── .gitignore
├── package.json                # Root scripts (concurrently)
└── README.md
```

## Prerequisites

- **Node.js** 18+
- **MongoDB** running locally or a MongoDB Atlas connection string

## Setup

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd mern-auth-app
   ```

2. **Install all dependencies**

   ```bash
   npm run install:all
   ```

3. **Configure environment variables**

   ```bash
   cp server/.env.example server/.env
   ```

   Edit `server/.env` with your values:

   ```
   MONGO_URI=mongodb://localhost:27017/mern_auth_db
   JWT_SECRET=your-strong-random-secret-here
   JWT_EXPIRES_IN=7d
   PORT=5000
   ```

   > Generate a strong JWT secret: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`

4. **Start the development servers**

   ```bash
   npm run dev
   ```

   This starts Express on `http://localhost:5000` and React on `http://localhost:5173` simultaneously.

## API Endpoints

### Authentication

| Method | Endpoint         | Body                            | Auth     | Description         |
| ------ | ---------------- | ------------------------------- | -------- | ------------------- |
| POST   | `/api/auth/signup` | `{ name, email, password }`    | No       | Create a new user   |
| POST   | `/api/auth/login`  | `{ email, password }`          | No       | Log in, receive JWT |
| GET    | `/api/auth/me`     | —                              | Required | Get current user    |

### Notes (protected)

| Method | Endpoint           | Body            | Auth     | Description          |
| ------ | ------------------ | --------------- | -------- | -------------------- |
| GET    | `/api/notes`       | —               | Required | List user's notes    |
| POST   | `/api/notes`       | `{ title }`     | Required | Create a note        |
| DELETE | `/api/notes/:id`   | —               | Required | Delete a note        |

All protected endpoints require a header: `Authorization: Bearer <token>`

## How Authentication Works

1. **Signup** — the server hashes the password with bcrypt, stores the user in MongoDB, and returns a signed JWT.
2. **Login** — the server looks up the user by email, compares the password hash with bcrypt, and returns a signed JWT.
3. **Subsequent requests** — the client sends the JWT in the `Authorization` header. The `protect` middleware verifies the token and attaches the user to the request.
4. **Logout** — the client removes the JWT from localStorage. Since JWTs are stateless, no server call is needed.

## Security Notes

- Passwords are **never stored in plaintext** — bcrypt with a 12-round salt is used.
- The User model has `select: false` on the password field, preventing accidental exposure.
- JWT secrets and database credentials are stored in `.env` (git-ignored).
- Login returns a generic "Invalid email or password" to avoid revealing whether an email exists.
- CORS is configured to only allow the client origin.

## License

MIT
