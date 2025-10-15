# SPORTYTOWN - Password Manager Setup Guide

## 🔐 Team Credentials to Protect

For this project, you need to securely share:
- MySQL Database Password: `WADMatchUp`
- JWT Secret: `6a565abd575d19ee7e0a0181e609780ae2f8ceaee16fa9e99476b5f24ea1c917`
- API Keys (Google Maps, OpenWeather)

**⚠️ NEVER share these via WhatsApp, Discord, Email, or commit to Git!**

---

## Recommended Password Managers (Free for Teams)

### Option 1: Bitwarden (Best for Students - FREE)

**Why Bitwarden:**
- ✅ 100% Free for unlimited users
- ✅ Open source
- ✅ Organizations feature
- ✅ Easy sharing
- ✅ Browser extension + mobile app

**Setup Steps:**

1. **Create Account:**
   - Go to: https://vault.bitwarden.com/#/register
   - Sign up with your email
   - Install browser extension: https://bitwarden.com/download/

2. **Create Organization (for team sharing):**
   - Click **"New Organization"**
   - Name: `SPORTYTOWN Team`
   - Plan: **Free** (unlimited users!)
   - Click **"Create Organization"**

3. **Invite Team Members:**
   - In Organization → **"Manage"** → **"People"**
   - Click **"Invite User"**
   - Enter teammate's email
   - Role: **"User"** (can view/use passwords)
   - They'll receive email invitation

4. **Create Shared Collection:**
   - Go to Organization → **"Manage"** → **"Collections"**
   - Click **"New Collection"**
   - Name: `Dev Environment Secrets`
   - Assign to team members

5. **Add Credentials:**
   - Click **"New Item"** → **"Secure Note"**
   - Name: `SPORTYTOWN Backend Environment`
   - Collection: `Dev Environment Secrets`
   - Add this content:

   ```
   MySQL Database Password: WADMatchUp
   MySQL Username: root
   MySQL Database: sportytown

   JWT Secret: 6a565abd575d19ee7e0a0181e609780ae2f8ceaee16fa9e99476b5f24ea1c917

   Backend .env:
   PORT=5000
   NODE_ENV=development
   CLIENT_ORIGIN=http://localhost:5175
   JWT_SECRET=6a565abd575d19ee7e0a0181e609780ae2f8ceaee16fa9e99476b5f24ea1c917
   REFRESH_TTL_DAYS=30
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=WADMatchUp
   DB_DATABASE=sportytown
   ```

   - Click **"Save"**

6. **Team Access:**
   - Teammates install Bitwarden
   - Accept email invitation
   - Login to Bitwarden
   - Access shared `Dev Environment Secrets` collection
   - Copy credentials to their local `.env` files

---

### Option 2: 1Password (Free for Students)

**Why 1Password:**
- ✅ Free with student email (.edu)
- ✅ Beautiful interface
- ✅ Great browser integration
- ✅ Vaults for team sharing

**Setup Steps:**

1. **Get Student Account:**
   - Go to: https://www.1password.com/students
   - Sign up with your school email
   - Verify student status

2. **Create Shared Vault:**
   - Open 1Password
   - Click **"Create Vault"**
   - Name: `SPORTYTOWN Secrets`
   - Enable sharing

3. **Invite Team:**
   - Click **"Share Vault"**
   - Enter teammate emails
   - Set permissions: **"View and Edit"**

4. **Add Credentials:**
   - In shared vault, click **"+"** → **"Secure Note"**
   - Title: `Backend Environment Variables`
   - Add credentials (same as Bitwarden example above)

---

### Option 3: Google Password Manager (Quick but less secure)

**Why Google:**
- ✅ Already have Google account
- ✅ No setup needed
- ✅ Quick for small teams

**Setup Steps:**

1. **Create Google Doc:**
   - Go to: https://docs.google.com
   - Create new document: `SPORTYTOWN Credentials`

2. **Add Credentials:**
   ```
   🔒 CONFIDENTIAL - DO NOT SHARE OUTSIDE TEAM

   Backend Environment Variables:
   DB_PASSWORD=WADMatchUp
   JWT_SECRET=6a565abd575d19ee7e0a0181e609780ae2f8ceaee16fa9e99476b5f24ea1c917

   [Full .env content here]
   ```

3. **Share with Team:**
   - Click **"Share"**
   - Add teammate emails
   - Set to **"Commenter"** or **"Viewer"**
   - ⚠️ **IMPORTANT:** Click **"Advanced"** → Disable **"Editors can change permissions"**

4. **Security:**
   - Set expiration if needed
   - Regularly review who has access

---

## 🎯 Quick Start for Your Team

### For Team Lead (You):

1. **Choose Option 1 (Bitwarden)** - It's free and best for teams
2. **Set up organization** (5 minutes)
3. **Add credentials** from above
4. **Invite teammates**
5. **Send them this guide**

### For Teammates:

1. **Accept Bitwarden invitation** (check email)
2. **Install browser extension**
3. **Login and access shared collection**
4. **Copy credentials to local `.env` files:**

   ```bash
   # Backend
   cd backend
   cp .env.example .env
   # Edit .env with credentials from Bitwarden

   # Frontend
   cd frontend
   cp .env.example .env
   # Edit .env with API URL
   ```

5. **Never commit `.env` files** - they're in `.gitignore`

---

## 📋 What Each Teammate Needs

After accessing shared credentials in password manager:

### Backend `.env`:
```env
PORT=5000
NODE_ENV=development
CLIENT_ORIGIN=http://localhost:5173  # Or their port

JWT_SECRET=<from password manager>
REFRESH_TTL_DAYS=30

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=<from password manager>
DB_DATABASE=sportytown
```

### Frontend `.env`:
```env
VITE_API_URL=http://localhost:5000

VITE_GOOGLE_MAPS_API_KEY=<optional, from password manager>
VITE_OPENWEATHER_API_KEY=<optional, from password manager>
```

---

## 🚨 Security Best Practices

### DO:
✅ Use password manager for all team credentials
✅ Enable two-factor authentication on password manager
✅ Regularly review who has access
✅ Use strong master password
✅ Each dev creates own local `.env` from shared credentials
✅ Keep `.env` in `.gitignore`

### DON'T:
❌ Share passwords in WhatsApp/Discord/Slack
❌ Email passwords
❌ Commit `.env` to Git
❌ Screenshot passwords
❌ Write passwords in notebooks
❌ Use weak master passwords

---

## 🔄 Rotating Credentials (When Needed)

If credentials are compromised:

1. **Generate new JWT secret:**
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

2. **Change MySQL password:**
   ```sql
   ALTER USER 'root'@'localhost' IDENTIFIED BY 'NewPassword';
   FLUSH PRIVILEGES;
   ```

3. **Update password manager**
4. **Notify all teammates** to pull new credentials
5. **Update all local `.env` files**
6. **Restart all services**

---

## 📞 Support

**Setup Help:**
- Team Lead: [Your Name]
- Password Manager Issues: Check respective support sites

**Emergency Access:**
- If locked out, contact team lead
- Team lead can reset access via password manager admin panel

---

## ✅ Quick Checklist

**Team Lead:**
- [ ] Set up password manager (Bitwarden recommended)
- [ ] Create organization/vault
- [ ] Add all credentials
- [ ] Invite all teammates
- [ ] Share this guide

**Team Members:**
- [ ] Accept password manager invitation
- [ ] Install browser extension
- [ ] Access shared credentials
- [ ] Create local `.env` files
- [ ] Verify app runs locally
- [ ] **NEVER** commit `.env` to Git

---

## Current Team Credentials

**Database:**
- Host: `localhost`
- User: `root`
- Password: `WADMatchUp`
- Database: `sportytown`

**JWT:**
- Secret: `6a565abd575d19ee7e0a0181e609780ae2f8ceaee16fa9e99476b5f24ea1c917`
- Expiry: 15 minutes (access token)
- Refresh: 30 days

**Access this guide:** `PASSWORD_MANAGER_GUIDE.md` in project root
