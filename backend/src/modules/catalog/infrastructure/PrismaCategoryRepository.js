import { prisma } from "../../../lib/prisma.js";
function mapCategory(category) {
    return {
        id: category.id,
        name: category.name,
        tenantId: category.tenantId,
        createdAt: category.createdAt
    };
}
export class PrismaCategoryRepository {
    async create(data) {
        const category = await prisma.category.create({
            data: {
                name: data.name,
                tenantId: data.tenantId
            }
        });
        return mapCategory(category);
    }
    async findAllByTenant(tenantId) {
        const categories = await prisma.category.findMany({
            where: { tenantId },
            orderBy: { createdAt: "desc" }
        });
        return categories.map(mapCategory);
    }
}
//# sourceMappingURL=PrismaCategoryRepository.js.map