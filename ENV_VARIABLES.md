# Environment Variables Template for Railway Deployment

## Backend Service Environment Variables

### Database Connection (MySQL on Railway)
```
SPRING_DATASOURCE_URL=jdbc:mysql://database:3306/bidverse_db?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true
SPRING_DATASOURCE_USERNAME=root
SPRING_DATASOURCE_PASSWORD=5809944808
```

### JPA/Hibernate Configuration
```
SPRING_JPA_HIBERNATE_DDL_AUTO=update
SPRING_JPA_SHOW_SQL=false
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect
```

### Server Configuration
```
SERVER_PORT=2000
SERVER_ADDRESS=0.0.0.0
```

### CORS Configuration (Update with your frontend domain)
```
FRONTEND_ORIGINS=http://your-frontend-app.railway.app
```

---

## Frontend Service Build Arguments

```
VITE_API_BASE_URL=
```
(Leave empty - frontend uses relative paths to backend API)

---

## Frontend Service Environment Variables

```
VITE_API_BASE_URL=
```

---

## Database Service Configuration

### MySQL Service
```
MYSQL_ROOT_PASSWORD=5809944808
MYSQL_DATABASE=bidverse_db
```

---

## How to Set These in Railway

1. **Dashboard Method:**
   - Go to Railway Project
   - Select each Service
   - Click "Variables"
   - Add each key-value pair

2. **CLI Method:**
   ```bash
   railway variables set SPRING_DATASOURCE_URL "jdbc:mysql://..."
   railway variables set SPRING_DATASOURCE_USERNAME "root"
   # ... etc
   ```

3. **railway.json Method:**
   - Variables defined in `railway.json`
   - Secrets reference: `${{ secrets.DATABASE_PASSWORD }}`

---

## Important Notes

⚠️ **Security:**
- Never commit `.env` files with real passwords
- Use Railway's secrets management for sensitive data
- The password `5809944808` should be changed for production
- Enable Railway's built-in SSL/TLS

⚠️ **Database:**
- Remove hardcoded credentials from `application.properties`
- Use environment variables exclusively
- Ensure `allowPublicKeyRetrieval=true` for MySQL 8+

⚠️ **Frontend:**
- Leave `VITE_API_BASE_URL` empty for production
- Nginx proxy will handle `/api/*` requests to backend

---

## Generate Secure Passwords

Railway will auto-generate if you use:
```json
"SPRING_DATASOURCE_PASSWORD": "${{ secrets.DATABASE_PASSWORD }}"
```

Or manually generate:
```bash
# Using OpenSSL
openssl rand -base64 24

# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Using Python
python -c "import secrets; print(secrets.token_hex(32))"
```

---

## Verification Checklist

Before deployment, verify:
- [ ] All environment variables are set in Railway dashboard
- [ ] Backend can connect to database (check logs)
- [ ] Frontend can access backend API
- [ ] No hardcoded passwords in source code
- [ ] CORS headers allow frontend domain
- [ ] Database migrations run successfully
- [ ] Health checks pass (if configured)

---

## Reference Files

- Backend config: `bidverse-backend/src/main/resources/application.properties`
- Frontend config: `bidverse-frontend/vite.config.js`
- Docker compose: `docker-compose.yml` (local reference only)
- Nginx config: `bidverse-frontend/nginx.conf`
