import type { CatalogItemType } from "../domain/CatalogItem.js";
import type { CatalogRepository } from "../domain/CatalogRepository.js";
interface UpdateCatalogItemInput {
    itemId: string;
    tenantId: string;
    name?: string;
    description?: string;
    price?: string;
    type?: CatalogItemType;
    categoryId?: string | null;
    active?: boolean;
}
export declare class UpdateCatalogItem {
    private readonly catalogRepository;
    constructor(catalogRepository: CatalogRepository);
    execute(input: UpdateCatalogItemInput): Promise<import("../domain/CatalogItem.js").CatalogItem>;
}
export {};
//# sourceMappingURL=UpdateCatalogItem.d.ts.map