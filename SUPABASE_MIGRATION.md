# Supabase Migration Complete! 🎉

We've successfully migrated from MySQL + Custom JWT auth to Supabase.

## What Changed

### ✅ Removed (464 lines of code deleted!)
- `backend/routes/auth.js` (345 lines)
- `backend/middleware/authz.js` (85 lines)
- `backend/config/db.js` (34 lines)
- Custom JWT token management
- bcrypt password hashing code
- Refresh token rotation logic

### ✅ Added
- `frontend/src/lib/supabase.ts` - Supabase client configuration
- Supabase authentication in Login.vue
- Supabase authentication in Register.vue
- Supabase session checks in router guards

### ✅ Database
- PostgreSQL (managed by Supabase)
- `profiles` table with Row Level Security
- Auto-create profile trigger on signup

---

## Setup Instructions for Team Members

### 1. Get Supabase Credentials

Ask your team lead for:
- **VITE_SUPABASE_URL**
- **VITE_SUPABASE_ANON_KEY**

Or find them in: Supabase Dashboard → Project Settings → API

### 2. Update `.env` File

Edit `frontend/.env`:
```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### 3. Run Database Migration

**Only needs to be done ONCE by team lead** in Supabase SQL Editor:

```sql
-- Create profiles table for custom user data
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name VARCHAR(120),
  role TEXT CHECK (role IN ('player', 'organiser')) DEFAULT 'player',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, role)
  VALUES (new.id, new.raw_user_meta_data->>'name', COALESCE(new.raw_user_meta_data->>'role', 'player'));
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### 4. Install Dependencies

```bash
cd frontend
npm install
```

### 5. Run Frontend

```bash
cd frontend
npm run dev
```

**No backend needed!** 🎉

---

## How Authentication Works Now

### Registration Flow
```javascript
// Old (Custom Backend)
await http.post('/auth/register', { email, password, name, role })
await http.post('/auth/login', { email, password })

// New (Supabase)
await supabase.auth.signUp({
  email,
  password,
  options: { data: { name, role } }
})
```

### Login Flow
```javascript
// Old (Custom Backend)
const response = await http.post('/auth/login', { email, password })
setAccessToken(response.data.accessToken)

// New (Supabase)
await supabase.auth.signInWithPassword({ email, password })
// Token management is automatic!
```

### Protected Routes
```javascript
// Old (Custom Backend)
await http.get('/auth/me')

// New (Supabase)
const { data: { session } } = await supabase.auth.getSession()
```

---

## Benefits

✅ **No local database setup** - Everyone accesses same cloud database
✅ **No WAMP/MySQL needed** - Works on any machine
✅ **Automatic token refresh** - No manual JWT management
✅ **Built-in security** - Row Level Security policies
✅ **Less code** - 464 lines deleted
✅ **Easier deployment** - Frontend only (no backend hosting)

---

## What Backend Can Still Do

You can keep your Express backend for:
- Weather API proxying
- Stripe payment integration
- TalkJS chat integration
- Custom business logic
- Game management endpoints

Just remove the auth routes and focus on features!

---

## Troubleshooting

### "Missing Supabase environment variables"
- Make sure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are in `frontend/.env`
- Restart dev server after adding variables

### "Invalid login credentials"
- Make sure you ran the database migration SQL
- Check Supabase Dashboard → Authentication to see if user exists

### "Cannot access protected route"
- Clear browser storage (localStorage/sessionStorage)
- Try logging out and back in
- Check browser console for errors

---

## Next Steps

1. ✅ Team lead: Share Supabase credentials via password manager
2. ✅ Team members: Update `.env` files
3. ✅ Test registration and login
4. ✅ Start building features!

---

## Resources

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)

---

**Questions?** Check the Supabase Dashboard or ask your team lead!
