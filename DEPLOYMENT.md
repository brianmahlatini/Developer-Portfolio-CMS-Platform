# Deployment Guide

## Overview

This guide covers deployment strategies for the Developer Portfolio CMS Platform across different environments.

## Prerequisites

- Docker installed and running
- Source code pushed to Git repository
- PostgreSQL database setup (either managed or self-hosted)
- Environment variables configured

## Deployment Options

### 1. Docker Compose (Development/Small Scale)

Perfect for development, testing, or small-scale production deployments.

```bash
# Prepare environment
cp .env.example .env
# Edit .env with your configuration

# Start services
docker-compose up -d

# Perform database migrations
docker-compose exec app npm run db:push
docker-compose exec app npm run db:seed

# View logs
docker-compose logs -f app
```

**Stopping:**
```bash
docker-compose down
```

### 2. Docker Image (Self-Hosted)

For deploying on your own servers or container platforms.

```bash
# Build production image
docker build -t portfolio-cms:latest .

# Run container
docker run -d \
  --name portfolio \
  -p 3000:3000 \
  -e DATABASE_URL="postgresql://user:pass@host:5432/portfolio" \
  -e JWT_SECRET="your-secret-key" \
  -e ADMIN_EMAIL="admin@example.com" \
  -e ADMIN_PASSWORD="secure-password" \
  -e NEXT_PUBLIC_SITE_URL="https://your-domain.com" \
  portfolio-cms:latest

# Check health
curl http://localhost:3000/api/health
```

### 3. Vercel Deployment (Next.js Optimized)

Recommended for serverless deployment with automatic scaling.

**Steps:**

1. Push code to GitHub
2. Connect repository to Vercel
3. Configure environment variables in Vercel dashboard:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `ADMIN_EMAIL`
   - `ADMIN_PASSWORD`
   - `NEXT_PUBLIC_SITE_URL`
4. Deploy

**PostgreSQL for Vercel:**
- Use Vercel Postgres managed database
- Or connect to external PostgreSQL provider

### 4. Railway Deployment

Simple Git-to-Cloud deployment with built-in PostgreSQL.

**Steps:**

1. Connect GitHub repository to Railway
2. Add PostgreSQL plugin
3. Set environment variables
4. Deploy

### 5. AWS Deployment

Using ECS, RDS, and CloudFront.

```bash
# Build and push to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin YOUR_ECR_URL
docker build -t portfolio-cms:latest .
docker tag portfolio-cms:latest YOUR_ECR_URL/portfolio-cms:latest
docker push YOUR_ECR_URL/portfolio-cms:latest

# Launch ECS task with RDS database
# Configure ALB and CloudFront
```

### 6. DigitalOcean App Platform

Git-based deployment with integrated database.

**Steps:**

1. Connect GitHub repository
2. Create PostgreSQL database
3. Configure build/run commands
4. Set environment variables
5. Deploy

### 7. Kubernetes Deployment

For enterprise-scale deployments.

```yaml
# deployment.yaml example
apiVersion: apps/v1
kind: Deployment
metadata:
  name: portfolio-cms
spec:
  replicas: 3
  selector:
    matchLabels:
      app: portfolio-cms
  template:
    metadata:
      labels:
        app: portfolio-cms
    spec:
      containers:
      - name: portfolio-cms
        image: your-registry/portfolio-cms:latest
        ports:
        - containerPort: 3000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: db-secrets
              key: url
        - name: JWT_SECRET
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: jwt-secret
        livenessProbe:
          httpGet:
            path: /api/health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
```

```bash
# Deploy to Kubernetes
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml
kubectl apply -f ingress.yaml
```

## Environment Configuration

### Production Environment Variables

```env
# Critical for security
JWT_SECRET=your-very-secure-32-plus-character-string
ADMIN_PASSWORD=strong-password-32-characters-minimum

# Database
DATABASE_URL=postgresql://user:password@host:5432/portfolio-prod?schema=public

# Site
NEXT_PUBLIC_SITE_URL=https://your-production-domain.com

# Admin
ADMIN_EMAIL=admin@your-domain.com

# Features
ENABLE_ANALYTICS=true

# Node environment
NODE_ENV=production
```

### Database Setup

**PostgreSQL Setup:**

```sql
-- Create database
CREATE DATABASE portfolio_prod;

-- Create user
CREATE USER portfolio_user WITH PASSWORD 'secure-password';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE portfolio_prod TO portfolio_user;

-- Connect and run migrations
-- Use the Prisma migration tools
```

## SSL/TLS Configuration

### Using Nginx Reverse Proxy with Let's Encrypt

```nginx
server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}
```

## Monitoring & Health Checks

### Health Check Endpoint

The application exposes a health check at `/api/health`:

```bash
curl https://your-domain.com/api/health
```

Response:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00Z",
  "uptime": 3600
}
```

### Container Orchestration Health Check

- **Kubernetes**: `livenessProbe` checking `/api/health`
- **ECS**: Container health check with retries
- **Docker Compose**: `healthcheck` directive

## Database Backup Strategy

### Automated PostgreSQL Backups

```bash
#!/bin/bash
# backup.sh

BACKUP_DIR="/backups/portfolio"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
DB_NAME="portfolio_prod"

mkdir -p $BACKUP_DIR

pg_dump $DB_NAME | gzip > $BACKUP_DIR/backup_$TIMESTAMP.sql.gz

# Keep only last 30 days
find $BACKUP_DIR -mtime +30 -delete
```

Schedule with cron:
```bash
0 2 * * * /scripts/backup.sh
```

## Scaling Considerations

### Horizontal Scaling

1. **Multiple App Instances**: Run multiple containers behind a load balancer
2. **Database**: Use read replicas for high-traffic scenarios
3. **Cache Layer**: Consider Redis for session/cache storage
4. **CDN**: Use CloudFront/Cloudflare for static assets

### Vertical Scaling

Increase CPU/memory allocation for single instance deployments.

## Performance Optimization

### Database Indexing

Ensure proper indexing on frequently queried fields:

```sql
CREATE INDEX idx_posts_slug ON posts(slug);
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_projects_slug ON projects(slug);
CREATE INDEX idx_pageviews_created ON pageviews(createdAt);
```

### CDN Configuration

- Serve static assets from CDN
- Set appropriate cache headers
- Use SWR (Stale-While-Revalidate) for API responses

### Database Connection Pooling

For production, use pgBouncer or managed connection pooling.

## Troubleshooting

### Container won't start

```bash
docker logs container_name
# Check environment variables
env | grep DATABASE_URL
```

### Database connection errors

```bash
# Test connection
psql $DATABASE_URL -c "SELECT 1"

# Check connection string format
# postgresql://user:password@host:port/database?schema=public
```

### High memory usage

```bash
# Check process
docker stats container_name

# Restart container
docker restart container_name
```

## Security Checklist

- [ ] Use strong, unique `JWT_SECRET`
- [ ] Enable HTTPS/SSL
- [ ] Use managed PostgreSQL service for production
- [ ] Configure firewall rules
- [ ] Regular security updates
- [ ] Enable database backups
- [ ] Monitor error logs
- [ ] Set up alerts for health checks
- [ ] Use environment variables for secrets
- [ ] Enable CORS only for trusted origins

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Vercel Deployment Guide](https://vercel.com/docs)
- [Prisma Database Setup](https://www.prisma.io/docs/getting-started/setup-prisma)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [PostgreSQL Backup Guide](https://www.postgresql.org/docs/current/backup.html)
