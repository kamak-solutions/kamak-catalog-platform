import { TenantProfileController } from "./TenantProfileController.js";
import { authMiddleware } from "../../../shared/http/auth-middleware.js";
export async function tenantProfileRoutes(app) {
    const tenantProfileController = new TenantProfileController();
    app.patch("/tenants/me/profile", { preHandler: [authMiddleware] }, tenantProfileController.updateMyTenant.bind(tenantProfileController));
}
//# sourceMappingURL=tenant-profile.routes.js.map