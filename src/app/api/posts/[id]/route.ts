import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/rbac";
import { postSchema } from "@/lib/validators";
import { parseBody, createResponse, createErrorResponse, NotFoundError, AuthorizationError, ApiError } from "@/lib/errors";

/**
 * GET /api/posts/[id]
 * Get a single post by ID
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const post = await prisma.post.findUnique({
      where: { id },
      include: { author: { select: { id: true, name: true, email: true } } },
    });

    if (!post) {
      throw new NotFoundError("Post");
    }

    if (post.status !== "PUBLISHED") {
      throw new ApiError("Post not available", 404, "NOT_FOUND");
    }

    return createResponse(post);
  } catch (error) {
    return createErrorResponse(error as Error);
  }
}

/**
 * PATCH /api/posts/[id]
 * Update a post (requires ADMIN or EDITOR role)
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireRole(request, ["ADMIN", "EDITOR"]);
    if (session instanceof NextResponse) return session;

    const { id } = await params;

    const post = await prisma.post.findUnique({ where: { id } });
    if (!post) {
      throw new NotFoundError("Post");
    }

    if (post.authorId !== session.id && session.role !== "ADMIN") {
      throw new AuthorizationError();
    }

    const partialSchema = postSchema.partial();
    const data = await parseBody(request, partialSchema);

    const updated = await prisma.post.update({
      where: { id },
      data: {
        ...data,
        publishedAt: data.status === "PUBLISHED" ? new Date() : undefined,
      },
      include: { author: { select: { id: true, name: true, email: true } } },
    });

    return createResponse(updated, "Post updated successfully");
  } catch (error) {
    return createErrorResponse(error as Error);
  }
}

/**
 * DELETE /api/posts/[id]
 * Delete a post (requires ADMIN or EDITOR role)
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireRole(request, ["ADMIN", "EDITOR"]);
    if (session instanceof NextResponse) return session;

    const { id } = await params;

    const post = await prisma.post.findUnique({ where: { id } });
    if (!post) {
      throw new NotFoundError("Post");
    }

    if (post.authorId !== session.id && session.role !== "ADMIN") {
      throw new AuthorizationError();
    }

    await prisma.post.delete({ where: { id } });

    return createResponse(null, "Post deleted successfully");
  } catch (error) {
    return createErrorResponse(error as Error);
  }
}
