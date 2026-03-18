import { z } from "zod";

/**
 * Base error class for API responses
 */
export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly code: string;

  constructor(message: string, statusCode: number = 500, code: string = "API_ERROR") {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.code = code;
  }

  toJSON() {
    return {
      error: this.message,
      code: this.code,
      statusCode: this.statusCode,
    };
  }
}

export class ValidationError extends ApiError {
  public readonly errors: Record<string, string[]>;

  constructor(message: string, errors: Record<string, string[]> = {}) {
    super(message, 400, "VALIDATION_ERROR");
    this.errors = errors;
  }

  toJSON() {
    return {
      ...super.toJSON(),
      errors: this.errors,
    };
  }
}

export class AuthenticationError extends ApiError {
  constructor(message: string = "Authentication required") {
    super(message, 401, "AUTHENTICATION_ERROR");
  }
}

export class AuthorizationError extends ApiError {
  constructor(message: string = "Insufficient permissions") {
    super(message, 403, "AUTHORIZATION_ERROR");
  }
}

export class NotFoundError extends ApiError {
  constructor(resource: string = "Resource") {
    super(`${resource} not found`, 404, "NOT_FOUND");
  }
}

export class ConflictError extends ApiError {
  constructor(message: string = "Resource already exists") {
    super(message, 409, "CONFLICT");
  }
}

/**
 * Parse and validate request body
 */
export async function parseBody<T>(
  request: Request,
  schema: z.ZodSchema<T>
): Promise<T> {
  try {
    const body = await request.json();
    const result = schema.safeParse(body);

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      throw new ValidationError("Invalid request body", errors as Record<string, string[]>);
    }

    return result.data;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (error instanceof SyntaxError) {
      throw new ValidationError("Invalid JSON");
    }
    throw error;
  }
}

/**
 * Create standardized API response
 */
export function createResponse<T>(
  data: T,
  message?: string,
  statusCode: number = 200
) {
  return Response.json(
    {
      success: true,
      data,
      ...(message && { message }),
    },
    { status: statusCode }
  );
}

/**
 * Create error response
 */
export function createErrorResponse(
  error: Error | ApiError,
  statusCode?: number
) {
  if (error instanceof ApiError) {
    return Response.json(error.toJSON(), { status: error.statusCode });
  }

  const apiError = new ApiError(
    error.message || "An unexpected error occurred",
    statusCode || 500
  );
  return Response.json(apiError.toJSON(), { status: apiError.statusCode });
}
