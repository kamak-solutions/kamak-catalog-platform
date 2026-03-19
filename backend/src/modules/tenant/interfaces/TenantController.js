import { z } from "zod";
import { CreateTenant } from "../application/CreateTenant.js";
import { PrismaTenantRepository } from "../infrastructure/PrismaTenantRepository.js";
const createTenantBodySchema = z.object({
    name: z.string().min(2),
});
export class TenantController {
    async create(request, reply) {
        try {
            const body = createTenantBodySchema.parse(request.body);
            const tenantRepository = new PrismaTenantRepository();
            const createTenant = new CreateTenant(tenantRepository);
            const tenant = await createTenant.execute(body.name);
            return reply.status(201).send(tenant);
        }
        catch (error) {
            return reply.status(400).send({
                message: error instanceof Error ? error.message : "Invalid request",
            });
        }
    }
    async findAll(_request, reply) {
        const tenantRepository = new PrismaTenantRepository();
        const tenants = await tenantRepository.findAll();
        return reply.status(200).send(tenants);
    }
}
//# sourceMappingURL=TenantController.js.map