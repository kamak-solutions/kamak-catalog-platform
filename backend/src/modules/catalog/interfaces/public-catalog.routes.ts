import type { FastifyInstance } from "fastify";
import { PublicCatalogController } from "./PublicCatalogController.js";

export async function publicCatalogRoutes(app: FastifyInstance) {
  const publicCatalogController = new PublicCatalogController();

  app.get(
    "/public/catalog/:slug",
    publicCatalogController.handle.bind(publicCatalogController),
  );
}
