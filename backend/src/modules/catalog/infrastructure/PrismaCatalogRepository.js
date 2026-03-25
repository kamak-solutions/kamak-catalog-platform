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
        category: item.category
            ? {
                id: item.category.id,
                name: item.category.name
            }
            : null,
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
            },
            include: {
                category: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });
        return mapCatalogItem(item);
    }
    async findAllByTenant(tenantId, categoryId) {
        const items = await prisma.catalogItem.findMany({
            where: {
                tenantId,
                ...(categoryId ? { categoryId } : {})
            },
            include: {
                category: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            },
            orderBy: { createdAt: "desc" }
        });
        return items.map(mapCatalogItem);
    }
}
//# sourceMappingURL=PrismaCatalogRepository.js.map