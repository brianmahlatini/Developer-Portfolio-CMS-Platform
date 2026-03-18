# API Documentation

## Base URL

```
http://localhost:3000 (development)
https://your-domain.com (production)
```

## Authentication

Most endpoints require authentication. Provide JWT token via:

1. **Cookie** (recommended for web apps):
   ```
   Cookie: session=<token>
   ```

2. **Authorization Header**:
   ```
   Authorization: Bearer <token>
   ```

## Response Format

All responses follow this format:

### Success Response

```json
{
  "success": true,
  "data": { /* data object */ },
  "message": "Operation successful"
}
```

### Error Response

```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "statusCode": 400,
  "errors": { /* field errors */ }
}
```

## Status Codes

- `200 OK` - Request successful
- `201 Created` - Resource created
- `202 Accepted` - Request accepted (async)
- `400 Bad Request` - Invalid request
- `401 Unauthorized` - Authentication required
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `409 Conflict` - Resource already exists
- `429 Too Many Requests` - Rate limited
- `500 Internal Server Error` - Server error
- `503 Service Unavailable` - Service down

## Endpoints

### Authentication

#### Login

```
POST /api/auth/login
```

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user-id",
      "name": "User Name",
      "email": "user@example.com",
      "role": "ADMIN"
    },
    "token": "jwt-token"
  },
  "message": "Login successful"
}
```

**Errors:**
- `401 INVALID_CREDENTIALS` - Wrong email or password
- `429 RATE_LIMITED` - Too many login attempts

#### Logout

```
POST /api/auth/logout
```

**Response (200):**
```json
{
  "success": true,
  "data": null,
  "message": "Logged out successfully"
}
```

### Posts

#### List Posts

```
GET /api/posts?page=1&limit=10
```

**Query Parameters:**
- `page` (number) - Page number (default: 1)
- `limit` (number) - Items per page (default: 10, max: 50)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "posts": [
      {
        "id": "post-id",
        "title": "Post Title",
        "slug": "post-slug",
        "summary": "Post summary",
        "publishedAt": "2024-01-15T10:30:00Z",
        "author": {
          "name": "Author Name",
          "email": "author@example.com"
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "pages": 3
    }
  }
}
```

#### Get Single Post

```
GET /api/posts/[id]
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "post-id",
    "title": "Post Title",
    "slug": "post-slug",
    "summary": "Post summary",
    "content": "# Full post content in markdown",
    "status": "PUBLISHED",
    "publishedAt": "2024-01-15T10:30:00Z",
    "author": {
      "id": "author-id",
      "name": "Author Name",
      "email": "author@example.com"
    }
  }
}
```

**Errors:**
- `404 NOT_FOUND` - Post not found
- `404 NOT_FOUND` - Post not published

#### Create Post

```
POST /api/posts
```

**Authentication Required:** Yes (ADMIN | EDITOR)

**Request:**
```json
{
  "title": "My New Post",
  "slug": "my-new-post",
  "summary": "A brief summary of the post",
  "content": "# Full post content in markdown format",
  "status": "DRAFT"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "new-post-id",
    "title": "My New Post",
    "slug": "my-new-post",
    "summary": "A brief summary of the post",
    "content": "# Full post content in markdown format",
    "status": "DRAFT",
    "publishedAt": null,
    "author": {
      "id": "your-id",
      "name": "Your Name",
      "email": "you@example.com"
    }
  },
  "message": "Post created successfully"
}
```

**Errors:**
- `400 VALIDATION_ERROR` - Invalid input
- `401 AUTHENTICATION_REQUIRED` - Not authenticated
- `403 INSUFFICIENT_PERMISSIONS` - Wrong role

#### Update Post

```
PATCH /api/posts/[id]
```

**Authentication Required:** Yes (ADMIN | EDITOR, author only)

**Request:** (all fields optional)
```json
{
  "title": "Updated Title",
  "content": "Updated content",
  "status": "PUBLISHED"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": { /* updated post */ },
  "message": "Post updated successfully"
}
```

**Errors:**
- `403 INSUFFICIENT_PERMISSIONS` - Not author or admin
- `404 NOT_FOUND` - Post not found

#### Delete Post

```
DELETE /api/posts/[id]
```

**Authentication Required:** Yes (ADMIN | EDITOR, author only)

**Response (200):**
```json
{
  "success": true,
  "data": null,
  "message": "Post deleted successfully"
}
```

### Projects

#### List Projects

```
GET /api/projects?page=1&limit=10&tag=nextjs
```

**Query Parameters:**
- `page` (number) - Page number (default: 1)
- `limit` (number) - Items per page (default: 10, max: 50)
- `tag` (string) - Filter by tag

**Response (200):**
```json
{
  "success": true,
  "data": {
    "projects": [
      {
        "id": "project-id",
        "title": "Project Title",
        "slug": "project-slug",
        "summary": "Project summary",
        "tags": ["nextjs", "react"],
        "repoUrl": "https://github.com/...",
        "liveUrl": "https://example.com",
        "publishedAt": "2024-01-15T10:30:00Z",
        "author": {
          "name": "Author Name",
          "email": "author@example.com"
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 15,
      "pages": 2
    }
  }
}
```

#### Get Single Project

```
GET /api/projects/[id]
```

**Response (200):** Similar to posts endpoint

#### Create Project

```
POST /api/projects
```

**Authentication Required:** Yes (ADMIN | EDITOR)

**Request:**
```json
{
  "title": "New Project",
  "slug": "new-project",
  "summary": "Project summary",
  "content": "# Full project description",
  "tags": ["nextjs", "typescript"],
  "repoUrl": "https://github.com/user/project",
  "liveUrl": "https://project.example.com",
  "status": "DRAFT"
}
```

**Response (201):** Created project object

#### Update/Delete Project

Same pattern as posts with `PATCH` and `DELETE` methods.

### Analytics

#### Track Page View

```
POST /api/analytics/track
```

**Authentication Required:** No

**Request:**
```json
{
  "path": "/blog/my-post",
  "referrer": "https://google.com"
}
```

**Response (202):**
```json
{
  "success": true,
  "data": null,
  "message": "Event tracked"
}
```

#### Get Analytics

```
GET /api/analytics?days=7
```

**Authentication Required:** Yes (ADMIN | EDITOR)

**Query Parameters:**
- `days` (number) - Number of days to analyze (default: 7, max: 365)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "period": {
      "days": 7,
      "since": "2024-01-08T10:30:00Z"
    },
    "stats": {
      "totalViews": 1250,
      "postsCount": 15,
      "projectsCount": 8,
      "usersCount": 3
    },
    "topPages": [
      {
        "path": "/blog/popular-post",
        "_count": 150
      }
    ],
    "referrers": [
      {
        "referrer": "https://google.com",
        "_count": 450
      }
    ]
  }
}
```

### Health

#### Health Check

```
GET /api/health
```

**Authentication Required:** No

**Response (200):**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00Z",
  "uptime": 3600
}
```

**Response (503):** If database is down
```json
{
  "status": "unhealthy",
  "timestamp": "2024-01-15T10:30:00Z",
  "error": "Connection timeout"
}
```

## Rate Limiting

- **General API**: 100 requests per 15 minutes per IP
- **Auth Endpoints**: 5 login attempts per 15 minutes per IP
- **Analytics**: 30 requests per 1 minute per IP

Rate limit information in response headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1705315800
```

## Error Codes

- `API_ERROR` - Generic API error
- `VALIDATION_ERROR` - Invalid input data
- `AUTHENTICATION_ERROR` - Not authenticated
- `AUTHORIZATION_ERROR` - Insufficient permissions
- `NOT_FOUND` - Resource not found
- `CONFLICT` - Resource already exists
- `RATE_LIMITED` - Rate limit exceeded
- `INVALID_CREDENTIALS` - Wrong email or password

## Examples

### JavaScript/Fetch

```javascript
// Login
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'admin@example.com',
    password: 'password123'
  })
});
const { data } = await response.json();

// Create post
await fetch('/api/posts', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${data.token}`
  },
  body: JSON.stringify({
    title: 'New Post',
    slug: 'new-post',
    summary: 'Summary',
    content: '# Content',
    status: 'DRAFT'
  })
});
```

### cURL

```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password123"}'

# Create post
curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title":"New Post",
    "slug":"new-post",
    "summary":"Summary",
    "content":"# Content",
    "status":"DRAFT"
  }'
```
