import type { FastifyInstance } from "fastify";
import { PublicCatalogController } from "./PublicCatalogController.js";

export async function publicCatalogRoutes(app: FastifyInstance) {
  const publicCatalogController = new PublicCatalogController();

  app.get(
    "/public/catalog/:tenantId",
    publicCatalogController.handle.bind(publicCatalogController),
  );
}