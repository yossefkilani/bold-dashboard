# Hostinger Deployment Guide

## 1. Upload the project
Upload all files (except `node_modules`) to your Hostinger server via FTP or Git.

## 2. Create .env file
Copy `.env.example` → `.env` and fill in your values:
```
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=bold_dashboard
ADMIN_PASSWORD=YourStrongPassword
FTP_HOST=...
FTP_USER=...
FTP_PASSWORD=...
```

## 3. Setup MySQL database
- Open phpMyAdmin on Hostinger
- Create a new database named `bold_dashboard`
- Import `database.sql`

## 4. Install & Build (SSH)
```bash
npm install
npm run build
```

## 5. Start with PM2
```bash
npm install -g pm2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## 6. Configure Hostinger Node.js
- In hPanel → Websites → Manage → Node.js
- Set startup file: `node_modules/.bin/next`
- Set arguments: `start -p 3000`
- Or use PM2 (recommended)

## Notes
- The dashboard runs on port 3000
- Use Hostinger's reverse proxy or set the domain to point to port 3000
- If using Hostinger Cloud/VPS, open port 3000 in the firewall
