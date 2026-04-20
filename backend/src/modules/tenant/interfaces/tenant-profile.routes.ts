import type { FastifyInstance } from "fastify";
import { TenantProfileController } from "./TenantProfileController.js";
import { authMiddleware } from "../../../shared/http/auth-middleware.js";

export async function tenantProfileRoutes(app: FastifyInstance) {
  const tenantProfileController = new TenantProfileController();

  app.patch(
    "/tenants/me/profile",
    { preHandler: [authMiddleware] },
    tenantProfileController.updateMyTenant.bind(tenantProfileController),
  );
}