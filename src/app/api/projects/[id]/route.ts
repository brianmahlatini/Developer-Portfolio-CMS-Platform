import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/rbac";
import { projectSchema } from "@/lib/validators";
import { parseBody, createResponse, createErrorResponse, NotFoundError, AuthorizationError, ApiError } from "@/lib/errors";

/**
 * GET /api/projects/[id]
 * Get a single project by ID
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const project = await prisma.project.findUnique({
      where: { id },
      include: { author: { select: { id: true, name: true, email: true } } },
    });

    if (!project) {
      throw new NotFoundError("Project");
    }

    if (project.status !== "PUBLISHED") {
      throw new ApiError("Project not available", 404, "NOT_FOUND");
    }

    return createResponse(project);
  } catch (error) {
    return createErrorResponse(error as Error);
  }
}

/**
 * PATCH /api/projects/[id]
 * Update a project (requires ADMIN or EDITOR role)
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireRole(request, ["ADMIN", "EDITOR"]);
    if (session instanceof NextResponse) return session;

    const { id } = await params;

    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) {
      throw new NotFoundError("Project");
    }

    if (project.authorId !== session.id && session.role !== "ADMIN") {
      throw new AuthorizationError();
    }

    const partialSchema = projectSchema.partial();
    const data = await parseBody(request, partialSchema);

    const updated = await prisma.project.update({
      where: { id },
      data: {
        ...data,
        repoUrl: data.repoUrl || undefined,
        liveUrl: data.liveUrl || undefined,
        publishedAt: data.status === "PUBLISHED" ? new Date() : undefined,
      },
      include: { author: { select: { id: true, name: true, email: true } } },
    });

    return createResponse(updated, "Project updated successfully");
  } catch (error) {
    return createErrorResponse(error as Error);
  }
}

/**
 * DELETE /api/projects/[id]
 * Delete a project (requires ADMIN or EDITOR role)
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireRole(request, ["ADMIN", "EDITOR"]);
    if (session instanceof NextResponse) return session;

    const { id } = await params;

    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) {
      throw new NotFoundError("Project");
    }

    if (project.authorId !== session.id && session.role !== "ADMIN") {
      throw new AuthorizationError();
    }

    await prisma.project.delete({ where: { id } });

    return createResponse(null, "Project deleted successfully");
  } catch (error) {
    return createErrorResponse(error as Error);
  }
}
