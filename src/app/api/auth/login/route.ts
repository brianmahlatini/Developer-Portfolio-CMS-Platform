import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createSessionToken, setSessionCookie, verifyPassword } from "@/lib/auth";
import { parseBody, createResponse, createErrorResponse, ApiError } from "@/lib/errors";
import { loginSchema } from "@/lib/validators";
import { authLimiter, getRateLimitId } from "@/lib/middleware";

/**
 * POST /api/auth/login
 * Authenticate user and create session
 */
export async function POST(request: Request) {
  try {
    // Rate limiting
    const limitterId = getRateLimitId(request);
    if (authLimiter.isLimited(limitterId)) {
      throw new ApiError("Too many login attempts", 429, "RATE_LIMITED");
    }

    const { email, password } = await parseBody(request, loginSchema);

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !(await verifyPassword(password, user.passwordHash))) {
      throw new ApiError("Invalid credentials", 401, "INVALID_CREDENTIALS");
    }

    const token = await createSessionToken({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });

    await setSessionCookie(token);

    return createResponse(
      {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      },
      "Login successful"
    );
  } catch (error) {
    return createErrorResponse(error as Error);
  }
}
