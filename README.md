# Developer Portfolio CMS Platform

A production-ready, full-stack content management system built with Next.js, TypeScript, Tailwind CSS, Prisma, and PostgreSQL. Designed for developers to showcase their portfolio with blog posts, projects, and analytics.

## 🚀 Features

### Core Features
- **Blog CMS** - Full-featured markdown/MDX blog with WYSIWYG editor
- **Project Management** - Showcase projects with tags, links, and descriptions
- **SEO Optimization** - Built-in meta tags, structured data, and sitemap generation
- **Analytics Dashboard** - Real-time visitor tracking and insights
- **Dynamic Page Generation** - Server-side and static site generation

### Advanced Features
- **Role-Based Access Control (RBAC)** - Admin, Editor, and Viewer roles
- **Authentication & Session Management** - Secure JWT-based auth with http-only cookies
- **API Rate Limiting** - Sliding window rate limiter for API endpoints
- **Content Versioning** - Draft and published status for all content
- **MDX Support** - Rich interactive content with React components
- **Security Headers** - CORS, CSP, and other security headers included
- **Docker Deployment** - Multi-stage Docker build for production
- **Health Checks** - Liveness and readiness probes for monitoring

## 📋 Tech Stack

- **Frontend**: Next.js 16.1.7, React 19, TypeScript 5
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL 16, Prisma 7.5.0 ORM
- **Styling**: Tailwind CSS 4, PostCSS
- **Content**: MDX with remark-gfm, rehype-slug
- **Auth**: JWT (jose), bcryptjs
- **Container**: Docker, Docker Compose
- **Validation**: Zod

## 🛠️ Quick Start

### Prerequisites
- Node.js 20+ 
- PostgreSQL 16+
- Docker & Docker Compose (optional)

### Local Development

**1. Clone and setup:**
```bash
git clone <repo>
cd Developer-Portfolio-CMS-Platform
npm install
```

**2. Configure environment:**
```bash
cp .env.example .env
# Edit .env with your configuration
```

**3. Setup database:**
```bash
npm run db:push
npm run db:seed
```

**4. Start development server:**
```bash
npm run dev
```

Visit `http://localhost:3000` and login with:
- Email: `admin@example.com`
- Password: `admin12345`

### Docker Deployment

**Option 1: Using docker-compose (easiest)**
```bash
# Start all services
npm run docker:up

# View logs
npm run docker:logs

# Stop services
npm run docker:down
```

**Option 2: Manual Docker build**
```bash
# Build image
npm run docker:build

# Run container
docker run -p 3000:3000 --env-file .env portfolio-cms:latest
```

**Option 3: Production with environment variables**
```bash
docker run -d \
  --name portfolio \
  -p 3000:3000 \
  -e DATABASE_URL="postgresql://user:pass@db:5432/portfolio?schema=public" \
  -e JWT_SECRET="your-secret-key" \
  -e ADMIN_EMAIL="admin@example.com" \
  -e ADMIN_PASSWORD="admin12345" \
  -e NEXT_PUBLIC_SITE_URL="https://example.com" \
  portfolio-cms:latest
```

## 📁 Project Structure

```
├── src/
│   ├── app/
│   │   ├── api/              # API routes
│   │   │   ├── auth/         # Authentication endpoints
│   │   │   ├── posts/        # Blog post CRUD
│   │   │   ├── projects/     # Project management CRUD
│   │   │   ├── analytics/    # Analytics tracking and stats
│   │   │   └── health/       # Health check
│   │   ├── dashboard/        # Admin dashboard pages
│   │   ├── blog/             # Public blog pages
│   │   ├── projects/         # Public project pages
│   │   └── login/            # Authentication UI
│   ├── components/           # Reusable React components
│   ├── lib/
│   │   ├── auth.ts           # JWT and session management
│   │   ├── db.ts             # Prisma client instance
│   │   ├── errors.ts         # Custom error classes
│   │   ├── middleware.ts     # Auth, rate limiting, security
│   │   ├── rbac.ts           # Role-based access control
│   │   ├── validators.ts     # Zod validation schemas
│   │   └── env.ts            # Environment validation
│   └── middleware.ts         # Next.js middleware
├── prisma/
│   ├── schema.prisma         # Database schema
│   └── seed.ts               # Seed script
├── public/                   # Static assets
├── Dockerfile                # Production image
├── docker-compose.yml        # Development/demo compose file
└── package.json

```

## 🔐 API Endpoints

### Authentication
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST   | `/api/auth/login` | ❌ | Login and get session token |
| POST   | `/api/auth/logout` | ✅ | Clear session |

### Posts
| Method | Endpoint | Auth | Roles | Description |
|--------|----------|------|-------|-------------|
| GET    | `/api/posts` | ❌ | - | List published posts (paginated) |
| GET    | `/api/posts/[id]` | ❌ | - | Get single post |
| POST   | `/api/posts` | ✅ | Admin, Editor | Create post |
| PATCH  | `/api/posts/[id]` | ✅ | Admin, Editor | Update post |
| DELETE | `/api/posts/[id]` | ✅ | Admin, Editor | Delete post |

### Projects
| Method | Endpoint | Auth | Roles | Description |
|--------|----------|------|-------|-------------|
| GET    | `/api/projects` | ❌ | - | List projects with filtering |
| GET    | `/api/projects/[id]` | ❌ | - | Get single project |
| POST   | `/api/projects` | ✅ | Admin, Editor | Create project |
| PATCH  | `/api/projects/[id]` | ✅ | Admin, Editor | Update project |
| DELETE | `/api/projects/[id]` | ✅ | Admin, Editor | Delete project |

### Analytics
| Method | Endpoint | Auth | Roles | Description |
|--------|----------|------|-------|-------------|
| POST   | `/api/analytics/track` | ❌ | - | Track page view |
| GET    | `/api/analytics` | ✅ | Admin, Editor | Get analytics dashboard |

### Health
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/api/health` | Health check for monitoring |

## 🔐 Security Features

- **HTTP-only Cookies**: Session tokens stored securely
- **CSRF Protection**: Token validation on state-changing operations
- **Rate Limiting**: Sliding window rate limiter for API endpoints
- **RBAC**: Three-tier role system with authorization checks
- **Input Validation**: Zod schemas for all API inputs
- **SQL Injection Prevention**: Prisma parameterized queries
- **XSS Protection**: React escaping + security headers
- **Environment Validation**: Strict env var validation on startup

## 📊 Database Schema

### Users
```sql
- id (PRIMARY KEY)
- name
- email (UNIQUE)
- passwordHash
- role (ADMIN | EDITOR | VIEWER)
- createdAt
- updatedAt
```

### Posts
```sql
- id (PRIMARY KEY)
- title
- slug (UNIQUE)
- summary
- content (TEXT)
- status (DRAFT | PUBLISHED)
- publishedAt
- authorId (FOREIGN KEY)
- createdAt
- updatedAt
```

### Projects
```sql
- id (PRIMARY KEY)
- title
- slug (UNIQUE)
- summary
- content (TEXT)
- status (DRAFT | PUBLISHED)
- publishedAt
- repoUrl
- liveUrl
- tags (ARRAY)
- authorId (FOREIGN KEY)
- createdAt
- updatedAt
```

### PageViews
```sql
- id (PRIMARY KEY)
- path
- referrer
- userAgent
- createdAt
```

## 🚀 Deployment

### Vercel (Recommended for Next.js)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Connect PostgreSQL database
# Set environment variables in Vercel dashboard
```

### Railway
```bash
# Push to Git
git push

# Connect repository to Railway
# Configure PostgreSQL service
# Set environment variables
```

### Docker/Self-hosted
```bash
# Build image
docker build -t portfolio-cms:1.0 .

# Push to registry
docker tag portfolio-cms:1.0 yourregistry/portfolio-cms:1.0
docker push yourregistry/portfolio-cms:1.0

# Deploy with Docker Compose/Kubernetes
```

## 🧪 Testing

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Database validation
npm run db:push --dry-run
```

## 📈 Production Checklist

- [ ] Update `JWT_SECRET` with secure 32+ character string
- [ ] Set strong `ADMIN_PASSWORD`
- [ ] Configure `DATABASE_URL` for production database
- [ ] Set `NEXT_PUBLIC_SITE_URL` to production domain
- [ ] Enable HTTPS / SSL certificates
- [ ] Configure CDN for static assets
- [ ] Set up monitoring and alerts
- [ ] Configure automated backups for database
- [ ] Enable CORS for specific origins if needed
- [ ] Review security headers in middleware
- [ ] Set up CI/CD pipeline
- [ ] Rate limit configuration for production load

## 🔄 Environment Variables

See `.env.example` for all available variables:

```env
# Database
DATABASE_URL=postgresql://user:pass@host:5432/portfolio?schema=public

# JWT
JWT_SECRET=your-32-plus-character-secret-key

# Site
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Admin
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin12345

# Features
ENABLE_ANALYTICS=true

# Node
NODE_ENV=development
```

## 📝 License

MIT License - See LICENSE file for details

## 🤝 Contributing

Contributions welcome! Please open an issue or submit a pull request.

## 📞 Support

For issues and questions:
- Open a GitHub issue
- Check documentation
- Review examples in code

---

Built with ❤️ for developers showcasing their work.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
