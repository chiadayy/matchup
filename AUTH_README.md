# SPORTYTOWN Authentication System

Complete JWT-based authentication system with access tokens and refresh token rotation.

## Overview

- **Access Token**: JWT, 15-minute expiry, stored in-memory
- **Refresh Token**: Random bytes (96 chars), httpOnly cookie, 30-day expiry
- **Token Rotation**: Refresh tokens are rotated on each use
- **Security**: Passwords hashed with bcrypt, tokens never in localStorage

## Backend Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

Dependencies installed:
- `express` - Web framework
- `mysql2` - MySQL database driver
- `bcrypt` - Password hashing
- `jsonwebtoken` - JWT creation/verification
- `cors` - CORS middleware
- `cookie-parser` - Parse cookies
- `dotenv` - Environment variables

### 2. Configure Environment

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `.env`:

```env
PORT=5000
NODE_ENV=development
CLIENT_ORIGIN=http://localhost:5173

JWT_SECRET=your_random_secret_min_32_characters_long
REFRESH_TTL_DAYS=30

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_DATABASE=sportytown
```

**Important**: Generate a strong JWT_SECRET:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. Run Database Migration

Execute the SQL migration to create auth tables:

```bash
mysql -u root -p sportytown < config/migrations/001_auth.sql
```

Or via MySQL Workbench/phpMyAdmin:
```sql
-- Run the contents of config/migrations/001_auth.sql
```

This creates:
- `users` table (id, email, password_hash, name, role, created_at)
- `refresh_tokens` table (id, user_id, token_hash, expires_at, created_at)

### 4. Start Server

```bash
npm start
# or for development with auto-reload:
npm run dev
```

Server starts at `http://localhost:5000`

Test health endpoint:
```bash
curl http://localhost:5000/health
```

## Frontend Setup

### 1. Install Dependencies

```bash
cd frontend
npm install
```

New dependency: `axios` (HTTP client)

### 2. Configure Environment

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `.env`:

```env
VITE_API_URL=http://localhost:5000
```

### 3. Run Frontend

```bash
npm run dev
```

App starts at `http://localhost:5173`

## API Endpoints

### POST /auth/register

Register a new user.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "minimum8chars",
  "name": "Optional Name",
  "role": "player"  // or "organiser"
}
```

**Response (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "Optional Name",
    "role": "player"
  }
}
```

### POST /auth/login

Authenticate and get access token + refresh cookie.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "yourpassword"
}
```

**Response (200):**
```json
{
  "accessToken": "eyJhbGc...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "Optional Name",
    "role": "player",
    "createdAt": "2025-01-15T10:00:00.000Z"
  }
}
```

Sets httpOnly cookie: `refreshToken`

### POST /auth/refresh

Rotate refresh token and get new access token.

**Request:** (automatic via cookie)

**Response (200):**
```json
{
  "accessToken": "eyJhbGc..."
}
```

Sets new httpOnly cookie: `refreshToken`

### POST /auth/logout

Delete refresh token and clear cookie.

**Response (200):**
```json
{
  "message": "Logged out successfully"
}
```

### GET /auth/me

Get current user info (protected).

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Response (200):**
```json
{
  "id": 1,
  "email": "user@example.com",
  "name": "Optional Name",
  "role": "player",
  "createdAt": "2025-01-15T10:00:00.000Z"
}
```

## Frontend Pages

### Login Page

Route: `/login`

Features:
- Email + password form
- Stores access token in memory
- Redirects to protected route after login
- Shows error messages

### Register Page

Route: `/register`

Features:
- Name (optional), email, password, role
- Auto-login after registration
- Form validation (min 8 char password)
- Shows error messages

## Authentication Flow

### 1. User Registration

```
User fills form → POST /auth/register →
Auto-login → POST /auth/login →
Store access token → Redirect to /location-weather
```

### 2. User Login

```
User fills form → POST /auth/login →
Receive access token + refresh cookie →
Store access token in memory →
Redirect to protected route
```

### 3. Accessing Protected Routes

```
Navigate to protected route →
Router guard checks auth →
GET /auth/me (with access token) →
Success: Allow access
Failure: Redirect to /login
```

### 4. Automatic Token Refresh

```
API request fails with 401 →
Axios interceptor catches error →
POST /auth/refresh (with refresh cookie) →
Receive new access token →
Retry original request
```

### 5. Logout

```
User clicks logout → POST /auth/logout →
Clear access token → Clear refresh cookie →
Redirect to /
```

## Router Protection

Protected routes use `meta: { requiresAuth: true }`:

```javascript
{
  path: '/location-weather',
  component: LocationWeather,
  meta: { requiresAuth: true }
}
```

The `beforeEach` guard checks authentication:
1. If route requires auth, call `/auth/me`
2. On success, allow navigation
3. On failure, redirect to `/login?next=<route>`

## Security Features

✅ **Access tokens**: Short-lived (15min), stored in memory
✅ **Refresh tokens**: Long-lived (30d), httpOnly cookie
✅ **Token rotation**: New refresh token on every use
✅ **Password hashing**: bcrypt with 10 salt rounds
✅ **CORS**: Restricted to `CLIENT_ORIGIN`
✅ **No localStorage**: Tokens never stored in browser storage
✅ **Secure cookies**: `secure: true` in production
✅ **httpOnly cookies**: JavaScript cannot access refresh token

## Development Notes

### Local Development

For local dev over HTTP, cookies use `secure: false`. In production, ensure:
- HTTPS enabled
- `NODE_ENV=production`
- Update `CLIENT_ORIGIN` to production URL

### Adding Protected Routes

1. Add `meta: { requiresAuth: true }` to route:
```javascript
{
  path: '/games/create',
  component: CreateGame,
  meta: { requiresAuth: true }
}
```

2. Router guard automatically protects it

### Using HTTP Client

Import and use the configured axios instance:

```javascript
import http from '@/lib/http'

// GET request (automatic auth header)
const response = await http.get('/api/games')

// POST request
const response = await http.post('/api/games', { data })
```

Automatic features:
- Adds `Authorization: Bearer <token>` header
- Retries on 401 with token refresh
- Handles refresh token rotation

### Checking Auth Status

```javascript
import http from '@/lib/http'

try {
  const { data } = await http.get('/auth/me')
  console.log('Logged in as:', data.email)
} catch (error) {
  console.log('Not authenticated')
}
```

## Troubleshooting

### "Refresh token missing" error

**Cause**: Cookie not sent or expired

**Solution**:
- Check `withCredentials: true` in axios config
- Verify CORS allows credentials
- Check cookie hasn't expired (30 days)
- Try logging in again

### "CORS error" in browser

**Cause**: Backend CORS misconfigured

**Solution**:
- Verify `CLIENT_ORIGIN` in backend `.env` matches frontend URL
- Check `credentials: true` in CORS config
- Restart backend after env changes

### "Invalid access token" error

**Cause**: Token expired or invalid

**Solution**:
- Token should auto-refresh via interceptor
- If persistent, check JWT_SECRET is same across restarts
- Try logging out and in again

### "Database connection failed"

**Cause**: MySQL not running or credentials wrong

**Solution**:
- Start MySQL: `mysql.server start` (Mac) or check WAMP (Windows)
- Verify DB credentials in `.env`
- Run migration: `mysql -u root -p sportytown < config/migrations/001_auth.sql`

## Testing

### Manual API Testing

Using curl:

```bash
# Register
curl -X POST http://localhost:5000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User","role":"player"}'

# Login
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}' \
  -c cookies.txt

# Get user info (replace TOKEN)
curl http://localhost:5000/auth/me \
  -H "Authorization: Bearer TOKEN"

# Refresh token
curl -X POST http://localhost:5000/auth/refresh \
  -b cookies.txt \
  -c cookies.txt

# Logout
curl -X POST http://localhost:5000/auth/logout \
  -b cookies.txt
```

### Frontend Testing

1. Navigate to `http://localhost:5173/register`
2. Create an account
3. Verify redirect to `/location-weather`
4. Refresh page - should stay logged in
5. Open DevTools → Application → Cookies - verify `refreshToken` exists
6. Logout - verify cookie deleted and redirected to `/`

## File Structure

```
backend/
├── config/
│   ├── db.js                     # MySQL connection pool
│   └── migrations/
│       └── 001_auth.sql          # Auth tables migration
├── middleware/
│   └── authz.js                  # JWT verification middleware
├── routes/
│   └── auth.js                   # Auth endpoints
├── server.js                     # Express server
├── .env.example                  # Environment template
└── package.json

frontend/
├── src/
│   ├── lib/
│   │   └── http.ts              # Axios instance + interceptors
│   ├── pages/
│   │   ├── Login.vue            # Login page
│   │   ├── Register.vue         # Register page
│   │   ├── Landing.vue          # Public landing
│   │   └── LocationWeather.vue  # Protected page
│   └── router/
│       └── index.js             # Router with auth guards
├── .env.example                 # Environment template
└── package.json
```

## Next Steps

1. ✅ Run database migration
2. ✅ Configure environment variables
3. ✅ Start backend server
4. ✅ Start frontend dev server
5. ✅ Test registration flow
6. ✅ Test login flow
7. ✅ Test protected routes
8. ✅ Test token refresh
9. ✅ Test logout

## Support

For issues or questions:
- Check server logs for errors
- Verify database connection
- Check browser console for frontend errors
- Verify environment variables are set correctly
