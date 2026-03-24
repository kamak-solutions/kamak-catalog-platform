import type { FastifyReply, FastifyRequest } from "fastify";
import jwt from "jsonwebtoken";

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not defined");
  }

  return secret;
}

interface AuthTokenPayload extends jwt.JwtPayload {
  sub: string;
  tenantId: string;
  role: string;
}

declare module "fastify" {
  interface FastifyRequest {
    user: {
      id: string;
      tenantId: string;
      role: string;
    };
  }
}

function isAuthTokenPayload(payload: unknown): payload is AuthTokenPayload {
  if (!payload || typeof payload !== "object") {
    return false;
  }

  const value = payload as Record<string, unknown>;

  return (
    typeof value.sub === "string" &&
    typeof value.tenantId === "string" &&
    typeof value.role === "string"
  );
}

export async function authMiddleware(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    return reply.status(401).send({
      message: "Authorization header is missing"
    });
  }

  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return reply.status(401).send({
      message: "Invalid authorization format"
    });
  }

  try {
    const decoded = jwt.verify(token, getJwtSecret()) as unknown;

    if (!isAuthTokenPayload(decoded)) {
      return reply.status(401).send({
        message: "Invalid token payload"
      });
    }

    request.user = {
      id: decoded.sub,
      tenantId: decoded.tenantId,
      role: decoded.role
    };
  } catch {
    return reply.status(401).send({
      message: "Invalid or expired token"
    });
  }
}