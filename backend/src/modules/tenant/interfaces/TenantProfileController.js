import { z } from "zod";
import { UpdateTenantProfile } from "../application/UpdateTenantProfile.js";
const updateTenantProfileBodySchema = z.object({
    name: z.string().min(2).optional(),
    description: z.string().optional(),
    whatsapp: z.string().optional(),
});
export class TenantProfileController {
    async updateMyTenant(request, reply) {
        try {
            const body = updateTenantProfileBodySchema.parse(request.body);
            const updateTenantProfile = new UpdateTenantProfile();
            const tenant = await updateTenantProfile.execute({
                tenantId: request.user.tenantId,
                ...(body.name !== undefined ? { name: body.name } : {}),
                ...(body.description !== undefined
                    ? { description: body.description }
                    : {}),
                ...(body.whatsapp !== undefined ? { whatsapp: body.whatsapp } : {}),
            });
            return reply.status(200).send(tenant);
        }
        catch (error) {
            return reply.status(400).send({
                message: error instanceof Error ? error.message : "Invalid request",
            });
        }
    }
}
//# sourceMappingURL=TenantProfileController.js.map