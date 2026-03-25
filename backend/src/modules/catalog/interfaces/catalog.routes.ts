import type { FastifyInstance } from "fastify";
import { CatalogController } from "./CatalogController.js";

export async function catalogRoutes(app: FastifyInstance) {
  const catalogController = new CatalogController();

  app.post("/catalog/items", catalogController.create.bind(catalogController));
  app.get(
    "/catalog/items/:tenantId",
    catalogController.findAllByTenant.bind(catalogController)
  );
}