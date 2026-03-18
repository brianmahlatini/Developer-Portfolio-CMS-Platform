import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/rbac";
import { projectSchema } from "@/lib/validators";
import { parseBody, createResponse, createErrorResponse, ApiError } from "@/lib/errors";
import { checkRateLimit, generalLimiter } from "@/lib/middleware";

/**
 * POST /api/projects
 * Create a new project (requires ADMIN or EDITOR role)
 */
export async function POST(request: Request) {
  try {
    if (checkRateLimit(request, generalLimiter)) {
      throw new ApiError("Rate limit exceeded", 429, "RATE_LIMITED");
    }

    const session = await requireRole(request, ["ADMIN", "EDITOR"]);

    const data = await parseBody(request, projectSchema);

    const project = await prisma.project.create({
      data: {
        ...data,
        repoUrl: data.repoUrl || null,
        liveUrl: data.liveUrl || null,
        publishedAt: data.status === "PUBLISHED" ? new Date() : null,
        authorId: session.id,
      },
      include: { author: { select: { id: true, name: true, email: true } } },
    });

    return createResponse(project, "Project created successfully", 201);
  } catch (error) {
    return createErrorResponse(error as Error);
  }
}

/**
 * GET /api/projects
 * List all published projects with pagination and filtering
 */
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const page = Math.max(1, parseInt(url.searchParams.get("page") || "1"));
    const limit = Math.min(50, parseInt(url.searchParams.get("limit") || "10"));
    const tag = url.searchParams.get("tag");
    const skip = (page - 1) * limit;

    const where = {
      status: "PUBLISHED" as const,
      ...(tag && { tags: { has: tag } }),
    };

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        select: {
          id: true,
          title: true,
          slug: true,
          summary: true,
          tags: true,
          repoUrl: true,
          liveUrl: true,
          publishedAt: true,
          author: { select: { name: true, email: true } },
        },
        orderBy: { publishedAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.project.count({ where }),
    ]);

    return createResponse({
      projects,
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
