import type { FastifyInstance } from "fastify";
import { TenantController } from "./TenantController.js";

export async function tenantRoutes(app: FastifyInstance) {
  const tenantController = new TenantController();

  app.post("/tenants", tenantController.create.bind(tenantController));
  app.get("/tenants", tenantController.findAll.bind(tenantController));
}
