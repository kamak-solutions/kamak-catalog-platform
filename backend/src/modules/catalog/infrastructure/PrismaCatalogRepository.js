import { prisma } from "../../../lib/prisma.js";
function mapCatalogItem(item) {
    return {
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.price ? item.price.toString() : null,
        type: item.type,
        active: item.active,
        tenantId: item.tenantId,
        categoryId: item.categoryId,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt
    };
}
export class PrismaCatalogRepository {
    async create(data) {
        const item = await prisma.catalogItem.create({
            data: {
                name: data.name,
                description: data.description ?? null,
                price: data.price ?? null,
                type: data.type,
                tenantId: data.tenantId,
                categoryId: data.categoryId ?? null
            }
        });
        return mapCatalogItem(item);
    }
    async findAllByTenant(tenantId) {
        const items = await prisma.catalogItem.findMany({
            where: { tenantId },
            orderBy: { createdAt: "desc" }
        });
        return items.map(mapCatalogItem);
    }
}
//# sourceMappingURL=PrismaCatalogRepository.js.map