import { NextResponse } from "next/server";
import { clearSession } from "@/lib/auth";
import { createResponse, createErrorResponse } from "@/lib/errors";

/**
 * POST /api/auth/logout
 * Clear user session
 */
export async function POST() {
  try {
    await clearSession();
    return createResponse(null, "Logged out successfully");
  } catch (error) {
    return createErrorResponse(error as Error);
  }
}
