import { TenantController } from "./TenantController.js";
export async function tenantRoutes(app) {
    const tenantController = new TenantController();
    app.post("/tenants", tenantController.create.bind(tenantController));
    app.get("/tenants", tenantController.findAll.bind(tenantController));
}
//# sourceMappingURL=tenat.routes.js.map