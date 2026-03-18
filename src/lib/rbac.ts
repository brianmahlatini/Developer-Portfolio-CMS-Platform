import { getSessionFromRequest, SessionUser } from "./auth";
import { AuthorizationError } from "./errors";

export type Role = SessionUser["role"];

export async function requireRole(
  request: Request,
  allowed: Role[]
): Promise<SessionUser> {
  const session = await getSessionFromRequest(request);
  if (!session) {
    throw new AuthorizationError("Authentication required");
  }
  if (!allowed.includes(session.role)) {
    throw new AuthorizationError("Insufficient permissions for this action");
  }
  return session;
}
