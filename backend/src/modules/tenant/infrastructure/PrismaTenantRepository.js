import { prisma } from "../../../lib/prisma.js";
export class PrismaTenantRepository {
    async create(name) {
        return prisma.tenant.create({
            data: { name }
        });
    }
    async findById(id) {
        return prisma.tenant.findUnique({
            where: { id }
        });
    }
    async findAll() {
        return prisma.tenant.findMany();
    }
}
//# sourceMappingURL=PrismaTenantRepository.js.map