# Troubleshooting Guide

Common issues and their solutions for the Developer Portfolio CMS Platform.

## Startup Issues

### Database Connection Error

**Error:** `Error: getaddrinfo ENOTFOUND localhost`

**Causes:**
- PostgreSQL is not running
- Database URL is incorrect
- Network connectivity issue

**Solutions:**

1. Check if PostgreSQL is running:
   ```bash
   # macOS
   brew services list | grep postgresql
   
   # Linux
   sudo systemctl status postgresql
   
   # Windows
   # Check Services application or:
   sc query postgresql
   ```

2. Start PostgreSQL:
   ```bash
   # macOS
   brew services start postgresql
   
   # Linux
   sudo systemctl start postgresql
   
   # Docker
   docker-compose up -d postgresql
   ```

3. Verify DATABASE_URL:
   ```bash
   # Should be in format:
   # postgresql://user:password@host:port/database?schema=public
   echo $DATABASE_URL
   ```

4. Test connection:
   ```bash
   psql $DATABASE_URL -c "SELECT 1"
   ```

### JWT_SECRET Not Set

**Error:** `Error: JWT_SECRET is not set`

**Solution:**

1. Create .env file:
   ```bash
   cp .env.example .env
   ```

2. Add JWT_SECRET:
   ```bash
   # Generate a secure random string
   openssl rand -base64 32
   
   # Add to .env
   JWT_SECRET="your-generated-string"
   ```

3. Restart development server:
   ```bash
   npm run dev
   ```

### Prisma Client Generation Failed

**Error:** `Error: @prisma/client did not initialize yet`

**Solution:**

```bash
# Generate Prisma client
npx prisma generate

# If that doesn't work:
rm -rf node_modules/.prisma
npm ci
```

## Development Issues

### Hot Reload Not Working

**Issue:** Changes don't reflect without manual refresh

**Solutions:**

1. Clear Next.js cache:
   ```bash
   rm -rf .next
   npm run dev
   ```

2. Check file permissions:
   ```bash
   ls -la src/ | head
   ```

3. Restart development server

### TypeScript Errors

**Error:** `Type 'X' is not assignable to type 'Y'`

**Solutions:**

1. Run type check:
   ```bash
   npm run type-check
   ```

2. Rebuild TypeScript:
   ```bash
   npx tsc --noEmit
   ```

3. Check import paths - ensure they match actual files

### ESLint Errors

**Error:** `Unexpected token or Expected operator`

**Solutions:**

```bash
# Run linter
npm run lint

# Fix automatically
npx eslint --fix src/

# Check specific file
npx eslint src/app/api/posts/route.ts
```

## API Issues

### 401 Unauthorized

**Cause:** Missing or invalid authentication token

**Solutions:**

1. Verify login was successful:
   ```bash
   curl -X POST http://localhost:3000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@example.com","password":"admin12345"}'
   ```

2. Check token format:
   ```bash
   # Token should be a valid JWT
   # Verify at: https://jwt.io/
   ```

3. Check cookie:
   ```bash
   # Browser DevTools > Application > Cookies
   # Look for 'session' cookie
   ```

### 403 Forbidden

**Cause:** User lacks required permissions

**Solutions:**

1. Check user role:
   ```bash
   # Query database
   SELECT email, role FROM "User" WHERE email = 'your-email@example.com';
   ```

2. Ensure user is ADMIN or EDITOR for mutations

3. For resource operations, verify ownership or admin status

### 404 Not Found

**Cause:** Resource doesn't exist

**Solutions:**

1. Verify resource ID exists:
   ```bash
   # Check in database
   SELECT id, title FROM "Post" WHERE id = 'your-id';
   ```

2. Check if resource is published (for GET requests)

3. Verify request path is correct

### Rate Limiting (429)

**Error:** `Too many login attempts`

**Cause:** Exceeded rate limit of 5 logins per 15 minutes

**Solutions:**

1. Wait 15 minutes
2. Check for attack/brute force attempts
3. Adjust rate limit in `src/lib/middleware.ts`

## Database Issues

### Migration Failed

**Error:** `Migration failed. Roll back with...`

**Solutions:**

```bash
# Reset database (⚠️ deletes all data)
npm run db:reset

# Or manually rollback
npx prisma migrate resolve --rolled-back migration_name

# Check migration status
npx prisma migrate status
```

### Seed Failed

**Error:** `Seed failed`

**Solutions:**

1. Check if admin user already exists:
   ```bash
   npx prisma db execute --stdin < seed.ts
   ```

2. Manually create admin user:
   ```sql
   INSERT INTO "User" (id, name, email, "passwordHash", role)
   VALUES (
     'user_' || gen_random_uuid()::text,
     'Admin',
     'admin@example.com',
     '$2a$10$...', -- bcrypt hash
     'ADMIN'
   );
   ```

3. Run seed again:
   ```bash
   npm run db:seed
   ```

### Connection Pool Exhausted

**Error:** `remaining connection slots are reserved`

**Cause:** Too many concurrent connections

**Solutions:**

1. Restart application:
   ```bash
   docker-compose restart app
   ```

2. Check for idle connections:
   ```sql
   SELECT * FROM pg_stat_activity;
   ```

3. Kill idle connections:
   ```sql
   SELECT pg_terminate_backend(pid) 
   FROM pg_stat_activity 
   WHERE state = 'idle' AND query_start < now() - interval '10 min';
   ```

4. Implement connection pooling (PgBouncer)

## Docker Issues

### Container Won't Start

**Error:** `container exited with code 1`

**Solutions:**

1. Check logs:
   ```bash
   docker logs container_id
   docker-compose logs app
   ```

2. Verify environment variables:
   ```bash
   docker-compose config
   ```

3. Check database connectivity:
   ```bash
   docker-compose exec app \
     npx tsnode -e "import {prisma} from '@/lib/db'; console.log(prisma)"
   ```

### Database Container Unhealthy

**Error:** `database unhealthy`

**Solutions:**

```bash
# Check container status
docker-compose ps

# View database logs
docker-compose logs postgresql

# Check permissions
docker-compose exec postgresql \
  pg_isready -U postgres

# Restart database
docker-compose restart postgresql
```

### Port Already in Use

**Error:** `port is already allocated`

**Causes:**
- Another service on port 3000 or 5432
- Stale Docker process

**Solutions:**

1. Find process using port:
   ```bash
   # macOS/Linux
   lsof -i :3000
   lsof -i :5432
   
   # Windows
   netstat -ano | findstr :3000
   netstat -ano | findstr :5432
   ```

2. Kill process or use different port:
   ```bash
   docker-compose down
   docker ps -a  # Check for stale containers
   docker rm container_id
   ```

## Performance Issues

### Slow API Responses

**Solutions:**

1. Check database query performance:
   ```sql
   EXPLAIN ANALYZE SELECT * FROM "Post" WHERE status = 'PUBLISHED';
   ```

2. Add indexes:
   ```sql
   CREATE INDEX idx_posts_status ON posts(status);
   CREATE INDEX idx_posts_slug ON posts(slug);
   ```

3. Check for N+1 queries - use `include` in Prisma

4. Monitor database connections:
   ```sql
   SELECT count(*) FROM pg_stat_activity;
   ```

### High Memory Usage

**Solutions:**

1. Check process:
   ```bash
   docker stats
   top -p `pgrep -f "node.*next start"`
   ```

2. Increase memory limit in docker-compose:
   ```yaml
   services:
     app:
       mem_limit: 2g
   ```

3. Check for memory leaks

### Slow Build Times

**Solutions:**

```bash
# Clear Next.js cache
rm -rf .next

# Clear Prisma cache
rm -rf node_modules/.prisma

# Rebuild
npm run build
```

## Security Issues

### Unauthorized Access

**Check:**

1. JWT_SECRET is strong and consistent
2. CORS settings are restrictive
3. Rate limiting is enabled
4. SQL injection is prevented (Prisma handles this)

### Sensitive Data Leaks

**Check:**

1. No secrets in logs:
   ```bash
   grep -r "SECRET\|PASSWORD" .next/
   ```

2. .env not in git:
   ```bash
   git status | grep .env
   ```

3. Check error responses don't leak details

## Monitoring & Logging

### Enable Debug Logging

```bash
# Set debug environment variable
DEBUG=prisma* npm run dev
```

### Check Application Logs

```bash
# Docker
docker-compose logs -f app

# Development
# Check terminal output where `npm run dev` is running
```

### Health Check

```bash
curl http://localhost:3000/api/health
```

## Getting Help

1. **Check existing issues**: GitHub Issues
2. **Review docs**: README.md, DEPLOYMENT.md, API_DOCS.md
3. **Enable debug logging** for more details
4. **Check environment variables** - most issues are config-related
5. **Verify database**: `psql $DATABASE_URL -c "SELECT 1"`
6. **Review error messages carefully** - they usually indicate the issue

## Common Error Codes

| Code | Meaning | Solution |
|------|---------|----------|
| `ENOTFOUND` | DNS/hostname not found | Check DATABASE_URL |
| `ECONNREFUSED` | Connection refused | Check if service is running |
| `EACCES` | Permission denied | Check file/folder permissions |
| `ENOMEM` | Out of memory | Increase memory allocation |
| `ETIMEDOUT` | Connection timeout | Check network/firewall |
| `EADDRINUSE` | Port already in use | Kill process or use different port |

## Still Having Issues?

1. Collect diagnostic information:
   ```bash
   node -v
   npm -v
   docker -v
   psql --version
   npm run lint
   npm run type-check
   ```

2. Create GitHub issue with:
   - Error message (full stack trace)
   - Steps to reproduce
   - Environment (OS, Node version, Docker version)
   - Relevant logs
   - Configuration (redacted secrets)

3. Share diagnostic output

---

**Last Updated:** 2024
