import type { FastifyInstance } from "fastify";
import { authMiddleware } from "../../../shared/http/auth-middleware.js";
import { CatalogController } from "./CatalogController.js";

export async function catalogRoutes(app: FastifyInstance) {
  const catalogController = new CatalogController();

  app.post(
    "/catalog/items",
    { preHandler: authMiddleware },
    catalogController.create.bind(catalogController)
  );

  app.get(
    "/catalog/items/:tenantId",
    catalogController.findAllByTenant.bind(catalogController)
  );
}