import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/rbac";
import { postSchema } from "@/lib/validators";
import { parseBody, createResponse, createErrorResponse, NotFoundError, ApiError } from "@/lib/errors";
import { checkRateLimit, generalLimiter } from "@/lib/middleware";

/**
 * POST /api/posts
 * Create a new blog post (requires ADMIN or EDITOR role)
 */
export async function POST(request: Request) {
  try {
    if (checkRateLimit(request, generalLimiter)) {
      throw new ApiError("Rate limit exceeded", 429, "RATE_LIMITED");
    }

    const session = await requireRole(request, ["ADMIN", "EDITOR"]);

    const data = await parseBody(request, postSchema);

    const post = await prisma.post.create({
      data: {
        ...data,
        publishedAt: data.status === "PUBLISHED" ? new Date() : null,
        authorId: session.id,
      },
      include: { author: { select: { id: true, name: true, email: true } } },
    });

    return createResponse(post, "Post created successfully", 201);
  } catch (error) {
    return createErrorResponse(error as Error);
  }
}

/**
 * GET /api/posts
 * List all published posts with pagination
 */
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const page = Math.max(1, parseInt(url.searchParams.get("page") || "1"));
    const limit = Math.min(50, parseInt(url.searchParams.get("limit") || "10"));
    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where: { status: "PUBLISHED" },
        select: {
          id: true,
          title: true,
          slug: true,
          summary: true,
          publishedAt: true,
          author: { select: { name: true, email: true } },
        },
        orderBy: { publishedAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.post.count({ where: { status: "PUBLISHED" } }),
    ]);

    return createResponse({
      posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return createErrorResponse(error as Error);
  }
}
