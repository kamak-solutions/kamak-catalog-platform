import type { CatalogItem, CatalogItemType } from "../domain/CatalogItem.js";
import type { CatalogRepository } from "../domain/CatalogRepository.js";
export declare class PrismaCatalogRepository implements CatalogRepository {
    create(data: {
        name: string;
        description?: string;
        price?: string;
        type: CatalogItemType;
        tenantId: string;
        categoryId?: string;
    }): Promise<CatalogItem>;
    findAllByTenant(tenantId: string): Promise<CatalogItem[]>;
}
//# sourceMappingURL=PrismaCatalogRepository.d.ts.map