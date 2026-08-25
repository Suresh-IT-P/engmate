# Deployment & Production Setup Guide — English Mate

## Prerequisites
- Node.js >= 18.0.0
- MySQL Server >= 5.7 / 8.0 (or embedded SQLite fallback for local preview)
- npm or yarn

---

## 1. Fresh Server Setup (Ubuntu / Debian / RHEL / Windows Server)

```bash
# 1. Update server packages
sudo apt update && sudo apt upgrade -y

# 2. Install Node.js 20 LTS & MySQL
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs mysql-server git

# 3. Clone English Mate repository
git clone https://github.com/your-org/english-mate.git
cd english-mate

# 4. Install all dependencies
npm run install:all

# 5. Create MySQL Database
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS englishmate CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# 6. Configure Environment
cp .env.example .env
nano .env  # Configure DB_USER, DB_PASSWORD, JWT_SECRET, AI_API_KEY
```

---

## 2. Database Migration and Seeding

```bash
# Run schema migrations
npm run db:migrate

# Populate full portable learning dataset
npm run db:seed
```

---

## 3. Build Production Bundle

```bash
# Build React + Vite frontend into backend/dist
npm run build
```

---

## 4. Run Production Server with PM2

```bash
# Install PM2 process manager
sudo npm install -g pm2

# Start backend server
cd backend
pm2 start server.js --name "english-mate-api"
pm2 save
pm2 startup
```

---

## 5. Nginx Reverse Proxy Configuration (Optional / Recommended)

```nginx
server {
    listen 80;
    server_name englishmate.yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```
