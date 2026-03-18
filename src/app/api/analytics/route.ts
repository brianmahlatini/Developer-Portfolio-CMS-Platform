import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/rbac";
import { createResponse, createErrorResponse } from "@/lib/errors";

/**
 * GET /api/analytics
 * Get analytics data for dashboard (requires ADMIN or EDITOR role)
 */
export async function GET(request: Request) {
  try {
    await requireRole(request, ["ADMIN", "EDITOR"]);

    const url = new URL(request.url);
    const days = Math.min(365, parseInt(url.searchParams.get("days") || "7"));
    const since = new Date();
    since.setDate(since.getDate() - days);

    const [
      totalViews,
      topPages,
      referrers,
      postsCount,
      projectsCount,
      usersCount,
    ] = await Promise.all([
      prisma.pageView.count({
        where: { createdAt: { gte: since } },
      }),
      prisma.pageView.groupBy({
        by: ["path"],
        where: { createdAt: { gte: since } },
        _count: true,
        orderBy: { _count: { id: "desc" } },
        take: 10,
      }),
      prisma.pageView.groupBy({
        by: ["referrer"],
        where: {
          createdAt: { gte: since },
          referrer: { not: null },
        },
        _count: true,
        orderBy: { _count: { id: "desc" } },
        take: 10,
      }),
      prisma.post.count({ where: { status: "PUBLISHED" } }),
      prisma.project.count({ where: { status: "PUBLISHED" } }),
      prisma.user.count(),
    ]);

    return createResponse({
      period: { days, since },
      stats: {
        totalViews,
        postsCount,
        projectsCount,
        usersCount,
      },
      topPages,
      referrers,
    });
  } catch (error) {
    return createErrorResponse(error as Error);
  }
}
