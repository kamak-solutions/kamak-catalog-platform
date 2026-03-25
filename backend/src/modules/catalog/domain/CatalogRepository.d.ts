import type { CatalogItem, CatalogItemType } from "./CatalogItem.js";
export interface CatalogRepository {
    create(data: {
        name: string;
        description?: string;
        price?: string;
        type: CatalogItemType;
        tenantId: string;
        categoryId?: string;
    }): Promise<CatalogItem>;
    findAllByTenant(tenantId: string, categoryId?: string): Promise<CatalogItem[]>;
}
//# sourceMappingURL=CatalogRepository.d.ts.map