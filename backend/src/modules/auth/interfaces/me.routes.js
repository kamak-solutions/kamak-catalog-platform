import { authMiddleware } from "../../../shared/http/auth-middleware.js";
export async function meRoutes(app) {
    app.get("/me", { preHandler: authMiddleware }, async (request, reply) => {
        return reply.status(200).send({
            id: request.user.id,
            tenantId: request.user.tenantId,
            role: request.user.role
        });
    });
}
//# sourceMappingURL=me.routes.js.map