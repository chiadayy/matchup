# SPORTYTOWN - Team Development Setup

## Prerequisites
- Node.js 18+
- MySQL (WAMP/XAMPP/MAMP)
- Git

## Initial Setup

### 1. Clone the Repository
```bash
git clone https://github.com/YOUR_ORG/assemble.git
cd assemble
git checkout bingzI
```

### 2. Backend Setup

#### Install Dependencies
```bash
cd backend
npm install
```

#### Create Environment File
```bash
cp .env.example .env
```

#### Configure `.env`
Edit `backend/.env` with team credentials:

```env
PORT=5000
NODE_ENV=development
CLIENT_ORIGIN=http://localhost:5173

# Get these from team password manager or team lead:
JWT_SECRET=<ask_team_lead>
REFRESH_TTL_DAYS=30

# Database - use team shared credentials
DB_HOST=localhost
DB_USER=<ask_team_lead>
DB_PASSWORD=<ask_team_lead>
DB_DATABASE=sportytown
```

**📧 Contact team lead for:**
- JWT_SECRET
- DB credentials

#### Run Database Migration
```bash
# Via phpMyAdmin or MySQL console:
# 1. CREATE DATABASE sportytown;
# 2. Run: backend/config/migrations/001_auth.sql
```

### 3. Frontend Setup

#### Install Dependencies
```bash
cd frontend
npm install
```

#### Create Environment File
```bash
cp .env.example .env
```

#### Configure `.env`
Edit `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000

# Get API keys from team lead if needed:
VITE_GOOGLE_MAPS_API_KEY=<optional>
VITE_OPENWEATHER_API_KEY=<optional>
```

### 4. Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

**Access:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- API Health: http://localhost:5000/health

## Team Credentials

**🔒 IMPORTANT:**
- Never commit `.env` files
- Get credentials from team password manager
- Use strong, unique passwords
- Don't share credentials via chat/email

## Troubleshooting

### Database Connection Failed
1. Check WAMP/MySQL is running
2. Verify DB credentials in `.env`
3. Run migration: `backend/config/migrations/001_auth.sql`

### CORS Error
1. Check `CLIENT_ORIGIN` in `backend/.env` matches your frontend URL
2. Restart backend after changing `.env`

### Port Already in Use
- Backend: Change `PORT` in `backend/.env`
- Frontend: Vite will auto-select next available port

## Contact

For setup help or credentials:
- Team Lead: [Your Name/Email]
- Password Manager: [Link to shared vault]
