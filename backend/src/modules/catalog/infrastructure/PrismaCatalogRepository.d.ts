import type { CatalogItem, CatalogItemType } from "../domain/CatalogItem.js";
import type { CatalogRepository } from "../domain/CatalogRepository.js";
export declare class PrismaCatalogRepository implements CatalogRepository {
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
//# sourceMappingURL=PrismaCatalogRepository.d.ts.map