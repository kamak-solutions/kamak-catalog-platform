import { prisma } from "../../../lib/prisma.js";
function mapCatalogItem(item) {
    return {
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.price ? item.price.toString() : null,
        imageUrl: item.imageUrl,
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
                imageUrl: data.imageUrl ?? null,
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
    async findById(itemId) {
        const item = await prisma.catalogItem.findUnique({
            where: { id: itemId },
            include: {
                category: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });
        return item ? mapCatalogItem(item) : null;
    }
    async update(data) {
        const item = await prisma.catalogItem.update({
            where: {
                id: data.itemId
            },
            data: {
                ...(data.name !== undefined ? { name: data.name } : {}),
                ...(data.description !== undefined ? { description: data.description } : {}),
                ...(data.price !== undefined ? { price: data.price } : {}),
                ...(data.imageUrl !== undefined ? { imageUrl: data.imageUrl } : {}),
                ...(data.type !== undefined ? { type: data.type } : {}),
                ...(data.categoryId !== undefined ? { categoryId: data.categoryId } : {}),
                ...(data.active !== undefined ? { active: data.active } : {})
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
}
//# sourceMappingURL=PrismaCatalogRepository.js.map