import type { CatalogItem, CatalogItemType } from "./CatalogItem.js";
export interface CatalogRepository {
    create(data: {
        name: string;
        description?: string;
        price?: string;
        imageUrl?: string;
        type: CatalogItemType;
        tenantId: string;
        categoryId?: string;
    }): Promise<CatalogItem>;
    findAllByTenant(tenantId: string, categoryId?: string): Promise<CatalogItem[]>;
    findById(itemId: string): Promise<CatalogItem | null>;
    update(data: {
        itemId: string;
        tenantId: string;
        name?: string;
        description?: string;
        price?: string;
        imageUrl?: string;
        type?: CatalogItemType;
        categoryId?: string | null;
        active?: boolean;
    }): Promise<CatalogItem>;
}
//# sourceMappingURL=CatalogRepository.d.ts.map