import type { CatalogItemType } from "../domain/CatalogItem.js";
import type { CatalogRepository } from "../domain/CatalogRepository.js";
interface CreateCatalogItemInput {
    name: string;
    description?: string;
    price?: string;
    type: CatalogItemType;
    tenantId: string;
    categoryId?: string;
}
export declare class CreateCatalogItem {
    private readonly catalogRepository;
    constructor(catalogRepository: CatalogRepository);
    execute(input: CreateCatalogItemInput): Promise<import("../domain/CatalogItem.js").CatalogItem>;
}
export {};
//# sourceMappingURL=CreateCatalogItem.d.ts.map