import { getSessionFromRequest, SessionUser } from "./auth";

export type Role = SessionUser["role"];

export async function requireRole(
  request: Request,
  allowed: Role[]
): Promise<SessionUser> {
  const session = await getSessionFromRequest(request);
  if (!session || !allowed.includes(session.role)) {
    throw new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }
  return session;
}
