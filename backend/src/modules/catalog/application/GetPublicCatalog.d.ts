export declare class GetPublicCatalog {
    execute(slug: string): Promise<{
        tenant: {
            id: string;
            name: string;
            slug: string;
            createdAt: Date;
        };
        items: {
            id: string;
            name: string;
            description: string | null;
            price: string | null;
            imageUrl: string | null;
            type: import("../../../generated/prisma/enums.js").CatalogItemType;
            active: boolean;
            tenantId: string;
            categoryId: string | null;
            category: {
                id: string;
                name: string;
            } | null;
            createdAt: Date;
            updatedAt: Date;
        }[];
    }>;
}
//# sourceMappingURL=GetPublicCatalog.d.ts.map