import type { FastifyInstance } from "fastify";
import { authMiddleware } from "../../../shared/http/auth-middleware.js";
import { CatalogController } from "./CatalogController.js";

export async function catalogRoutes(app: FastifyInstance) {
  const catalogController = new CatalogController();

  app.post(
    "/catalog/items",
    { preHandler: authMiddleware },
    catalogController.create.bind(catalogController),
  );

  app.get(
    "/catalog/items/:tenantId",
    catalogController.findAllByTenant.bind(catalogController),
  );

  app.post(
    "/catalog/categories",
    { preHandler: authMiddleware },
    catalogController.createCategory.bind(catalogController),
  );

  app.get(
    "/catalog/categories/:tenantId",
    catalogController.findCategoriesByTenant.bind(catalogController),
  );
  app.get(
    "/catalog/my-items",
    { preHandler: authMiddleware },
    catalogController.findMyItems.bind(catalogController),
  );

  app.get(
    "/catalog/my-categories",
    { preHandler: authMiddleware },
    catalogController.findMyCategories.bind(catalogController),
  );
  app.patch(
    "/catalog/items/:itemId",
    { preHandler: authMiddleware },
    catalogController.updateItem.bind(catalogController),
  );

  app.patch(
    "/catalog/items/:itemId/deactivate",
    { preHandler: authMiddleware },
    catalogController.deactivateItem.bind(catalogController),
  );
}
