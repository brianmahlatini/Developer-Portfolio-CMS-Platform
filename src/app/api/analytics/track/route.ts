import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { analyticsSchema } from "@/lib/validators";
import { parseBody, createResponse, createErrorResponse } from "@/lib/errors";
import { checkRateLimit, apiLimiter } from "@/lib/middleware";

/**
 * POST /api/analytics/track
 * Track page views and analytics events
 */
export async function POST(request: Request) {
  try {
    if (checkRateLimit(request, apiLimiter)) {
      return NextResponse.json(
        { error: "Rate limit exceeded" },
        { status: 429 }
      );
    }

    const data = await parseBody(request, analyticsSchema);

    const userAgent = request.headers.get("user-agent") ?? undefined;

    await prisma.pageView.create({
      data: {
        path: data.path,
        referrer: data.referrer || null,
        userAgent,
      },
    });

    return createResponse(null, "Event tracked", 202);
  } catch (error) {
    return createErrorResponse(error as Error);
  }
}
