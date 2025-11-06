# MatchUp - Sports Match Finder 🏀⚽🎾

Find nearby sports matches, check the weather, and join games in your area.

## 🌐 Live Application

**URL:** https://matchup-fe.onrender.com
## 🔑 Demo Account Credentials

If you need to access the application, you can use the following dummy account:
- **Email:** demo@matchup.com
- **Password:** demo123456

*Note: Create this demo account in your Supabase dashboard or replace with actual test credentials*

## 🚀 Tech Stack

**Frontend:**
- Vue 3
- Javascript
- Vite (build tool)
- Vue Router
- Bootstrap 5
- FullCalendar
- Three.js (3D animations)

**Backend:**
- Node.js + Express
- Supabase JS Client
- JWT Authentication
- Stripe API (Secure server-side payment handling)

**APIs & Services:**
- Google Maps API (Location services)
- OpenWeather API (Weather data)
- TalkJS (Real-time chat)
- Stripe (Payment processing)

**Database & Auth:**
- Supabase (PostgreSQL + Authentication)
- Row Level Security (RLS)

## 📦 Quick Start

### 1. Install Dependencies

**Frontend:**
```bash
cd frontend
npm install
```

**Backend:**
```bash
cd backend
npm install
```

### 2. Configure Environment

Create `frontend/.env`:
```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# API Configuration
VITE_API_URL=http://localhost:3000

# Third-party APIs
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_key_here
VITE_OPENWEATHER_API_KEY=your_openweather_key_here

# Payment Integration
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here

# Chat Integration
VITE_TALKJS_APP_ID=your_talkjs_app_id_here
```

Create `backend/.env`:
```env
# Server Configuration
PORT=5000
NODE_ENV=development
CLIENT_ORIGIN=http://localhost:5173

# JWT Configuration
JWT_SECRET=your_long_random_secret_key_min_32_chars

# Stripe Configuration
STRIPE_SECRET_KEY=your_stripe_secret_key_here

# Supabase Configuration
SUPABASE_URL=your_supabase_url_here
SUPABASE_SERVICE_KEY=your_supabase_service_role_key_here
```

**Get credentials:**
- Supabase API Key: Dashboard → Project Settings → API Keys → copy anon public key  
- Supabase URL: Dashboard → Project Settings → Data API → copy URL 
- Google Maps: [Google Cloud Console](https://console.cloud.google.com/)
- OpenWeather: [OpenWeather API Keys](https://openweathermap.org/api)
- Stripe: Create an account at https://dashboard.stripe.com (use Secret Key for backend, Publishable Key for frontend)
- TalkJS: [TalkJS Dashboard](https://talkjs.com/dashboard)

### 3. Run Database Migration

Go to **Supabase Dashboard → SQL Editor** and run `supabase_schema.sql`

### 4. Disable Email Confirmation (Dev)

**Supabase Dashboard → Authentication → Settings → Email Auth**
- Turn OFF "Enable email confirmations"

### 5. Run the Application

**Backend (Terminal 1):**
```bash
cd backend
npm run dev
```
Backend runs on: **http://localhost:3000**

**Frontend (Terminal 2):**
```bash
cd frontend
npm run dev
```
Frontend runs on: **http://localhost:5173**

## 📚 Documentation

- [SUPABASE_MIGRATION.md](SUPABASE_MIGRATION.md) - Full migration guide
- [supabase_schema.sql](supabase_schema.sql) - Database schema
- [Supabase Docs](https://supabase.com/docs)

## ✨ Features

- **Match Discovery** - Browse and search for sports matches near you
- **Real-time Chat** - Communicate with match participants via TalkJS
- **Payment Integration** - Secure payment processing with Stripe
- **Calendar View** - View matches in a calendar format with FullCalendar
- **User Profiles** - Create and customize your player profile
- **Match Creation** - Organizers can create and manage matches
- **Admin Dashboard** - Special dashboard for organizers to manage their events
- **Weather Integration** - Check weather conditions for match locations
- **Map View** - Visualize match locations with Google Maps

## 🔐 Authentication

Uses Supabase Auth with email/password authentication. The backend provides additional API endpoints for chat, payments, and user management.

## 🗄️ Database Schema

- **profiles** - User profiles (extends auth.users)
  - Stores name, role (player/organiser), profile image, description, favourites
- **matches** - Games/events
  - Match details, pricing, location, date/time, host info
- **users_matches** - Junction table for match participation
  - Links users to matches, tracks payment status

All tables have Row Level Security (RLS) enabled for data protection.

## 🤝 Team Collaboration

**New members:** Just get Supabase credentials, add to `.env`, and run! No MySQL/WAMP setup needed.

Everyone accesses the same cloud database ✨

## 📝 Archived

Old MySQL auth code moved to `backend/archive/`
