# BidVerse Railway Deployment Guide

## Prerequisites
- GitHub account with your repository pushed
- Railway account (free at railway.app)
- Custom domain (optional)

---

## Quick Start (Railway Dashboard)

### 1. Connect Your Repository
1. Go to [railway.app](https://railway.app)
2. Sign in with GitHub
3. Create new project → "Deploy from GitHub repo"
4. Select: `harsh-0409/BidVerse`
5. Click "Deploy"

---

## 2. Configure Services

Railway will auto-detect your Docker setup. You need to configure 3 services:

### **Service 1: MySQL Database**
- **Name:** `database`
- **Image:** `mysql:8`
- **Add Variables:**
  - `MYSQL_ROOT_PASSWORD`: `5809944808` (or generate secure password)
  - `MYSQL_DATABASE`: `bidverse_db`

### **Service 2: Backend (Spring Boot)**
- **Name:** `backend`
- **Build:** From `bidverse-backend/backend.Dockerfile`
- **Port:** `2000`
- **Environment Variables:**
  ```
  SPRING_DATASOURCE_URL=jdbc:mysql://database:3306/bidverse_db?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true
  SPRING_DATASOURCE_USERNAME=root
  SPRING_DATASOURCE_PASSWORD=5809944808
  SPRING_JPA_HIBERNATE_DDL_AUTO=update
  SPRING_JPA_SHOW_SQL=false
  SERVER_PORT=2000
  SERVER_ADDRESS=0.0.0.0
  FRONTEND_ORIGINS=$RAILWAY_PUBLIC_DOMAIN
  ```
- **Connect Database:** Link to `database` service
- **Wait for readiness:** Yes (30s timeout)

### **Service 3: Frontend (React + Nginx)**
- **Name:** `frontend`
- **Build:** From `bidverse-frontend/frontend.Dockerfile`
- **Port:** `80`
- **Build Args:**
  ```
  VITE_API_BASE_URL=
  ```
- **Environment Variables:**
  ```
  VITE_API_BASE_URL=
  ```
- **Connect Backend:** Link to `backend` service
- **Public URL:** Enable (this is your frontend domain)

---

## 3. Environment Variables Setup

### Backend Environment Variables (Critical)
```
SPRING_DATASOURCE_URL=jdbc:mysql://database:3306/bidverse_db?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true
SPRING_DATASOURCE_USERNAME=root
SPRING_DATASOURCE_PASSWORD=5809944808
SPRING_JPA_HIBERNATE_DDL_AUTO=update
SPRING_JPA_SHOW_SQL=false
SERVER_PORT=2000
SERVER_ADDRESS=0.0.0.0
FRONTEND_ORIGINS=http://your-frontend-domain.railway.app
```

### Frontend Build Arguments
```
VITE_API_BASE_URL=
(Leave empty - frontend will use relative paths /api/...)
```

---

## 4. Add Custom Domain (Optional)

1. In Railway Dashboard → Your Project
2. Select Frontend Service
3. Click "Settings" → "Domains"
4. Add your custom domain
5. Update DNS records at your domain registrar:
   ```
   CNAME: your-domain.com → railway-generated-domain
   ```

---

## 5. Database Configuration

### Update Backend application.properties

File: `bidverse-backend/src/main/resources/application.properties`

```properties
# Railway environment (MySQL)
spring.datasource.url=jdbc:mysql://database:3306/bidverse_db?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=5809944808

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect
```

---

## 6. Deploy & Monitor

1. **Auto Deployment:** Railway auto-deploys on GitHub push
2. **View Logs:** Dashboard → Service → "Logs"
3. **Monitor Health:**
   - Backend: Check `/api/health` endpoint (if available)
   - Frontend: Check `your-frontend-domain.railway.app`
   - Database: Check connection status in logs

---

## 7. Troubleshooting

| Issue | Solution |
|-------|----------|
| Frontend can't reach backend | Check `FRONTEND_ORIGINS` in backend env vars. Should be frontend's Railway domain |
| Database connection failed | Verify `SPRING_DATASOURCE_URL` includes all parameters, especially `allowPublicKeyRetrieval=true` |
| Port conflicts | Ensure backend uses port 2000, frontend uses port 80 |
| Builds failing | Check build logs in Railway dashboard. Ensure `mvnw` has execute permissions |
| CORS errors | Check that `FRONTEND_ORIGINS` in backend matches the frontend's actual domain |

---

## 8. Update Backend Hardcoded Credentials

Before deploying, remove hardcoded database credentials:

File: `bidverse-backend/src/main/resources/application.properties`

❌ **Don't hardcode:**
```properties
spring.datasource.password=Uraj2@7254
```

✅ **Use environment variables:**
```properties
spring.datasource.password=${SPRING_DATASOURCE_PASSWORD}
```

---

## 9. Continuous Deployment

1. Push code to GitHub
2. Railway automatically:
   - Rebuilds images
   - Restarts services
   - Updates database (if schema changes)

---

## 10. Scaling (if needed)

In Railway Dashboard:
- **Backend:** Increase replicas or RAM
- **Database:** Upgrade to managed PostgreSQL/MySQL (paid tier)
- **Frontend:** Auto-scales with backend

---

## Useful Railway Commands (CLI)

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link project
railway link

# View logs
railway logs

# Deploy manually
railway up

# Check variables
railway variables
```

---

## Contact & Support

- Railway Docs: https://docs.railway.app
- Railway Status: https://status.railway.app
- Community: https://railway.app/community

---

**Note:** Your project is production-ready! The Dockerfiles are well-configured. Railway will handle scaling and monitoring.
