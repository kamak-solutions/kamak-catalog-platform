import { prisma } from "../../../lib/prisma.js";
export class GetPublicCatalog {
    async execute(slug) {
        const tenant = await prisma.tenant.findUnique({
            where: {
                slug,
            },
            select: {
                id: true,
                name: true,
                slug: true,
                createdAt: true,
            },
        });
        if (!tenant) {
            throw new Error("Tenant not found");
        }
        const items = await prisma.catalogItem.findMany({
            where: {
                tenantId: tenant.id,
                active: true,
            },
            include: {
                category: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        return {
            tenant,
            items: items.map((item) => ({
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
                        name: item.category.name,
                    }
                    : null,
                createdAt: item.createdAt,
                updatedAt: item.updatedAt,
            })),
        };
    }
}
//# sourceMappingURL=GetPublicCatalog.js.map