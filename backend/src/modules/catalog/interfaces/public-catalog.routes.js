import { PublicCatalogController } from "./PublicCatalogController.js";
export async function publicCatalogRoutes(app) {
    const publicCatalogController = new PublicCatalogController();
    app.get("/public/catalog/:slug", publicCatalogController.handle.bind(publicCatalogController));
}
//# sourceMappingURL=public-catalog.routes.js.map