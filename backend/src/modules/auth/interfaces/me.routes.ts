import type { FastifyInstance } from "fastify";
import { authMiddleware } from "../../../shared/http/auth-middleware.js";

export async function meRoutes(app: FastifyInstance) {
  app.get("/me", { preHandler: authMiddleware }, async (request, reply) => {
    return reply.status(200).send({
      id: request.user.id,
      tenantId: request.user.tenantId,
      role: request.user.role
    });
  });
}