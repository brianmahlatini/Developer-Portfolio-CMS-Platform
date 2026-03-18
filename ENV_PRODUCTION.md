# Production Environment Example

This file shows the recommended environment configuration for production deployments.

## Copy to .env.production

```env
# ====== PRODUCTION DATABASE ======
DATABASE_URL="postgresql://portfolio_user:SuperSecure$Password123@db.production.example.com:5432/portfolio_prod?schema=public&sslmode=require"
POSTGRES_USER="portfolio_user"
POSTGRES_PASSWORD="SuperSecure$Password123"
POSTGRES_DB="portfolio_prod"

# ====== JWT & SECURITY ======
# Must be at least 32 characters, use a strong random string
# Generate with: openssl rand -base64 32
JWT_SECRET="aBcDeFgHiJkLmNoPqRsTuVwXyZ0123456789ABC"

# ====== SITE CONFIGURATION ======
NEXT_PUBLIC_SITE_URL="https://your-domain.com"

# ====== ADMIN ACCOUNT ======
# These credentials will be used to create the first admin user
ADMIN_EMAIL="admin@your-domain.com"
ADMIN_PASSWORD="ChangeMe2024!SuperSecure"

# ====== FEATURES ======
ENABLE_ANALYTICS="true"

# ====== NODE ENVIRONMENT ======
NODE_ENV="production"
```

## Security Best Practices

### Environment Variable Security

1. **Never commit .env files to Git**
   ```bash
   # Verify it's in .gitignore
   cat .gitignore | grep "\.env"
   ```

2. **Use strong passwords**
   - Minimum 12 characters
   - Mix uppercase, lowercase, numbers, special characters
   - Avoid common words and personal information

3. **Generate secure random strings**
   ```bash
   # Linux/Mac
   openssl rand -base64 32
   
   # Windows PowerShell
   [Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
   ```

4. **Store secrets in platform secrets manager**
   - Vercel Secrets
   - AWS Secrets Manager
   - HashiCorp Vault
   - 1Password/Bitwarden

### Database Configuration

- Use a dedicated database user with minimal permissions
- Enable SSL/TLS for database connections
- Restrict database access by IP
- Regular backups to separate storage
- Use managed services when possible (AWS RDS, Heroku Postgres, etc.)

### JWT Secret

- Minimum 32 characters
- Generate cryptographically random
- Rotate periodically (plan for rotation)
- Never hardcode in source

```bash
# Generate JWT secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Per-Environment Examples

### Development

```env
NODE_ENV="development"
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/portfolio?schema=public"
JWT_SECRET="dev-secret-key-at-least-32-characters-long-xxxx"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
ADMIN_EMAIL="admin@localhost"
ADMIN_PASSWORD="admin12345"
ENABLE_ANALYTICS="false"
```

### Staging

```env
NODE_ENV="production"
DATABASE_URL="postgresql://user:pass@staging-db.internal:5432/portfolio_staging?schema=public&sslmode=require"
JWT_SECRET="<staging-secret-32-chars>"
NEXT_PUBLIC_SITE_URL="https://staging.your-domain.com"
ADMIN_EMAIL="admin@staging.your-domain.com"
ADMIN_PASSWORD="<strong-staging-password>"
ENABLE_ANALYTICS="true"
```

### Production

```env
NODE_ENV="production"
DATABASE_URL="postgresql://user:pass@prod-db.internal:5432/portfolio_prod?schema=public&sslmode=require"
JWT_SECRET="<prod-secret-32-chars>"
NEXT_PUBLIC_SITE_URL="https://your-domain.com"
ADMIN_EMAIL="admin@your-domain.com"
ADMIN_PASSWORD="<very-strong-production-password>"
ENABLE_ANALYTICS="true"
```

## Deployment Checklist

- [ ] JWT_SECRET is 32+ characters and cryptographically random
- [ ] ADMIN_PASSWORD is 12+ characters with mixed case and special chars
- [ ] DATABASE_URL uses SSL/TLS connection
- [ ] NEXT_PUBLIC_SITE_URL is set to production domain
- [ ] NODE_ENV is set to "production"
- [ ] No sensitive data in git history
- [ ] Secrets stored in platform-specific managers
- [ ] Database backups enabled and tested
- [ ] Monitoring and logging configured
- [ ] Health check endpoint accessible
- [ ] Rate limiting configured appropriately
- [ ] CORS settings reviewed and restricted

## Rotating Secrets

### JWT Secret Rotation

1. Generate new secret:
   ```bash
   openssl rand -base64 32
   ```

2. Update in all environments with small window:
   ```bash
   # Old JWT tokens remain valid for their duration
   # New tokens use new secret
   # Implement dual validation during transition
   ```

3. Monitor for any authentication issues

### Password Rotation

1. Update ADMIN_PASSWORD in .env
2. Run seed script to update database:
   ```bash
   npm run db:seed
   ```

## Troubleshooting

### "Invalid DATABASE_URL"

- Check format: `postgresql://user:password@host:port/database?schema=public`
- Verify credentials are correct
- Ensure special characters in password are URL-encoded

### "JWT_SECRET is not long enough"

- JWT_SECRET must be at least 32 characters
- Generate with: `openssl rand -base64 32`

### "ADMIN_PASSWORD does not meet requirements"

- Use 12+ characters
- Include uppercase, lowercase, numbers, special characters
- Avoid simple patterns

## Additional Resources

- [Prisma Security Best Practices](https://www.prisma.io/docs/guides/security)
- [OWASP: Environment Variables](https://owasp.org/www-community/attacks/Environment_Variable_Manipulation)
- [12 Factor App: Store Config in Environment](https://12factor.net/config)
- [Node.js Security Guidelines](https://nodejs.org/en/docs/guides/nodejs-security/)
