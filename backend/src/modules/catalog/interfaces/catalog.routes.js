import { authMiddleware } from "../../../shared/http/auth-middleware.js";
import { CatalogController } from "./CatalogController.js";
export async function catalogRoutes(app) {
    const catalogController = new CatalogController();
    app.post("/catalog/items", { preHandler: authMiddleware }, catalogController.create.bind(catalogController));
    app.get("/catalog/items/:tenantId", catalogController.findAllByTenant.bind(catalogController));
    app.post("/catalog/categories", { preHandler: authMiddleware }, catalogController.createCategory.bind(catalogController));
    app.get("/catalog/categories/:tenantId", catalogController.findCategoriesByTenant.bind(catalogController));
}
//# sourceMappingURL=catalog.routes.js.map