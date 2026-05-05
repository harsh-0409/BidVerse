# BidVerse Railway Deployment Checklist

## Pre-Deployment (Do These Now)

- [ ] **Remove hardcoded database password** from `bidverse-backend/src/main/resources/application.properties`
  - Remove: `spring.datasource.password=Uraj2@7254`
  - Add instead: `spring.datasource.password=${SPRING_DATASOURCE_PASSWORD}`

- [ ] **Update CORS configuration** in backend
  - File: `bidverse-backend/src/main/java/com/bidverse/config/CorsConfig.java`
  - Allow origin: `${FRONTEND_ORIGINS}` (use env variable)

- [ ] **Test locally with Docker Compose first**
  ```bash
  docker-compose up --build
  # Should work on http://localhost:30021
  ```

- [ ] **Commit all changes to GitHub**
  ```bash
  git add .
  git commit -m "Prepare for Railway deployment"
  git push origin main
  ```

---

## Railway Deployment Steps

### Step 1: Create Railway Account & Project
- [ ] Go to [railway.app](https://railway.app)
- [ ] Sign in with GitHub
- [ ] Click "Create New Project"
- [ ] Select "Deploy from GitHub repo"
- [ ] Choose: `harsh-0409/BidVerse`
- [ ] Click "Deploy Now"

### Step 2: Create Database Service
- [ ] Wait for initial build (Railway will detect it needs services)
- [ ] Click "Add Service" → "Database" → "MySQL 8"
- [ ] Configuration:
  - [ ] Set `MYSQL_ROOT_PASSWORD` = `5809944808`
  - [ ] Set `MYSQL_DATABASE` = `bidverse_db`
  - [ ] Save variables

### Step 3: Create Backend Service
- [ ] Click "Add Service" → "Docker service"
- [ ] Link to: `bidverse-backend/backend.Dockerfile`
- [ ] **Connect to Database:**
  - [ ] In the Backend service → "Variables"
  - [ ] Add all variables from [ENV_VARIABLES.md](ENV_VARIABLES.md)
- [ ] Port: `2000`
- [ ] Set restart policy: "On Failure"

### Step 4: Create Frontend Service
- [ ] Click "Add Service" → "Docker service"
- [ ] Link to: `bidverse-frontend/frontend.Dockerfile`
- [ ] **Build Arguments:**
  - [ ] `VITE_API_BASE_URL` = (empty string)
- [ ] Port: `80`
- [ ] Enable public URL (get domain)
- [ ] Note: `your-frontend-domain.railway.app` (you'll use this next)

### Step 5: Update Backend CORS
- [ ] Go to Backend service → "Variables"
- [ ] Update `FRONTEND_ORIGINS` = `http://your-frontend-domain.railway.app`
- [ ] (Use the actual domain from Step 4)
- [ ] Save and redeploy backend

### Step 6: Connect Services
- [ ] In Backend service → Dependencies:
  - [ ] Add link to: `database`
- [ ] In Frontend service → Dependencies:
  - [ ] Add link to: `backend`

### Step 7: Monitor Deployment
- [ ] Go to "Deployments" tab
- [ ] Wait for all 3 services to show ✓ status
- [ ] Check logs if any service fails:
  - [ ] Database logs: connection test
  - [ ] Backend logs: Spring Boot startup
  - [ ] Frontend logs: Nginx startup & build

### Step 8: Test Your Deployment
- [ ] Open: `http://your-frontend-domain.railway.app`
- [ ] Should load the BidVerse homepage
- [ ] Try to:
  - [ ] Browse products
  - [ ] Login/Register
  - [ ] View a product detail
  - [ ] Add item to cart
  - [ ] Place a bid

### Step 9: Add Custom Domain (Optional)
- [ ] Go to Frontend service → Settings
- [ ] Click "Domains"
- [ ] Add your custom domain
- [ ] Follow DNS instructions from your domain registrar

---

## Useful URLs After Deployment

- **Frontend:** `http://your-frontend-domain.railway.app`
- **Backend API:** `http://your-frontend-domain.railway.app/api/`
- **Railway Dashboard:** `https://railway.app/dashboard`
- **Project Logs:** Railway Dashboard → Your Project → Select Service → Logs

---

## If Something Goes Wrong

### Backend won't start
1. Check logs: Dashboard → Backend → Logs
2. Common issues:
   - Database not running yet (wait 30s)
   - Wrong connection string (check `SPRING_DATASOURCE_URL`)
   - Wrong password (verify `SPRING_DATASOURCE_PASSWORD`)

### Frontend shows blank page
1. Check browser console (F12) for errors
2. Check logs: Dashboard → Frontend → Logs
3. Likely issues:
   - Backend not running
   - API base URL wrong
   - CORS not configured

### Database connection timeout
1. Make sure MySQL service is created
2. Wait at least 30-60 seconds for it to initialize
3. Check variables are set correctly
4. Verify database service shows healthy status

### Need to redeploy?
```bash
# Make changes locally
# Push to GitHub
git push origin main
# Railway auto-redeploys (2-5 minutes)
```

---

## File Locations to Update

If you need to make changes before deployment:

| File | Change |
|------|--------|
| `bidverse-backend/src/main/resources/application.properties` | Use env variables for credentials |
| `bidverse-backend/src/main/java/com/bidverse/config/CorsConfig.java` | Update CORS origins |
| `bidverse-backend/backend.Dockerfile` | ✓ Already configured |
| `bidverse-frontend/frontend.Dockerfile` | ✓ Already configured |
| `bidverse-frontend/nginx.conf` | ✓ Check API proxy config |

---

## Estimated Timeline

- GitHub setup: 2 minutes
- Railway project creation: 1 minute
- Service configuration: 10 minutes
- Build & deployment: 5-10 minutes
- Testing: 5 minutes

**Total: ~25-30 minutes** ⏱️

---

## Support Resources

- [Railway Docs](https://docs.railway.app)
- [Spring Boot Docker](https://spring.io/guides/topicals/spring-boot-docker/)
- [Nginx Configuration](https://nginx.org/en/docs/)
- [MySQL Connection Issues](https://dev.mysql.com/doc/connector-j/8.0/en/)

---

## Files Created for You

✓ `railway.json` - Complete Railway configuration  
✓ `RAILWAY_DEPLOYMENT.md` - Detailed deployment guide  
✓ `ENV_VARIABLES.md` - Environment variables reference  
✓ `DEPLOYMENT_CHECKLIST.md` - This checklist  

---

**Ready to deploy? Start with "Pre-Deployment" section above!**
