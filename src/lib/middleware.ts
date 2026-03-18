import { NextResponse } from "next/server";
import { getSession } from "./auth";

/**
 * Simple in-memory rate limiter for route handlers
 */
class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private readonly windowMs: number;
  private readonly maxRequests: number;

  constructor(windowMs: number = 15 * 60 * 1000, maxRequests: number = 100) {
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;
  }

  isLimited(identifier: string): boolean {
    const now = Date.now();
    const requests = this.requests.get(identifier) || [];

    // Remove old requests outside the window
    const recentRequests = requests.filter((time) => now - time < this.windowMs);

    if (recentRequests.length >= this.maxRequests) {
      return true;
    }

    recentRequests.push(now);
    this.requests.set(identifier, recentRequests);

    return false;
  }
}

export const generalLimiter = new RateLimiter(15 * 60 * 1000, 100);
export const authLimiter = new RateLimiter(15 * 60 * 1000, 5);
export const apiLimiter = new RateLimiter(60 * 1000, 30);

/**
 * Get rate limiter identifier from request
 */
export function getRateLimitId(request: Request): string {
  return (
    request.headers.get("x-forwarded-for") ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

/**
 * Check if request is rate limited
 */
export function checkRateLimit(
  request: Request,
  limiter: RateLimiter = generalLimiter
): boolean {
  const id = getRateLimitId(request);
  return limiter.isLimited(id);
}

/**
 * Create rate limit headers
 */
export function getRateLimitHeaders(
  remaining: number,
  limit: number,
  reset: number
) {
  return {
    "X-RateLimit-Limit": limit.toString(),
    "X-RateLimit-Remaining": remaining.toString(),
    "X-RateLimit-Reset": reset.toString(),
  };
}

/**
 * Middleware: Require authentication
 */
export async function requireAuth() {
  const session = await getSession();
  if (!session) {
    return new NextResponse(
      JSON.stringify({ error: "Unauthorized", code: "AUTHENTICATION_REQUIRED" }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }
  return session;
}

/**
 * Middleware: Require specific role
 */
export async function requireRole(request: Request, roles: string[]) {
  const session = await getSession();
  if (!session || !roles.includes(session.role)) {
    return new NextResponse(
      JSON.stringify({ error: "Forbidden", code: "INSUFFICIENT_PERMISSIONS" }),
      { status: 403, headers: { "Content-Type": "application/json" } }
    );
  }
  return session;
}

/**
 * Middleware: CORS headers
 */
export function addCorsHeaders(response: Response): Response {
  const origin = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  response.headers.set("Access-Control-Allow-Origin", origin);
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  response.headers.set("Access-Control-Allow-Credentials", "true");
  return response;
}

/**
 * Middleware: Security headers
 */
export function addSecurityHeaders(response: Response): Response {
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  return response;
}
