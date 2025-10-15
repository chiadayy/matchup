# MatchUp - Sports Match Finder 🏀⚽🎾

Find nearby sports matches, check the weather, and join games in your area.

## 🚀 Tech Stack

**Frontend:**
- Vue 3 + TypeScript
- Vite (build tool)
- Vue Router
- Google Maps API
- OpenWeather API

**Database & Auth:**
- Supabase (PostgreSQL + Authentication)
- Row Level Security (RLS)

**Coming Soon:**
- Stripe (payments)
- TalkJS (chat)

## 📦 Quick Start

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Configure Environment

Create `frontend/.env`:
```env
VITE_SUPABASE_URL=https://iazpwqforzzdhvkrdodj.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
VITE_GOOGLE_MAPS_API_KEY=your_key
VITE_OPENWEATHER_API_KEY=your_key
```

**Get credentials from team lead or Supabase Dashboard → Project Settings → API**

### 3. Run Database Migration

Go to **Supabase Dashboard → SQL Editor** and run `supabase_schema.sql`

### 4. Disable Email Confirmation (Dev)

**Supabase Dashboard → Authentication → Settings → Email Auth**
- Turn OFF "Enable email confirmations"

### 5. Run Frontend
```bash
npm run dev
```

Visit: **http://localhost:5173**

## 📚 Documentation

- [SUPABASE_MIGRATION.md](SUPABASE_MIGRATION.md) - Full migration guide
- [supabase_schema.sql](supabase_schema.sql) - Database schema
- [Supabase Docs](https://supabase.com/docs)

## 🔐 Authentication

Uses Supabase Auth (email/password). No backend required!

## 🗄️ Database Tables

- **profiles** - User data (extends auth.users)
- **matches** - Games/events
- **users_matches** - Who joined which game

All tables have Row Level Security enabled.

## 🤝 Team Collaboration

**New members:** Just get Supabase credentials, add to `.env`, and run! No MySQL/WAMP setup needed.

Everyone accesses the same cloud database ✨

## 📝 Archived

Old MySQL auth code moved to `backend/archive/`
