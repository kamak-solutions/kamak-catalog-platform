import type { CatalogRepository } from "../domain/CatalogRepository.ts";
export declare class ListCatalogItems {
    private readonly catalogRepository;
    constructor(catalogRepository: CatalogRepository);
    execute(tenantId: string, categoryId?: string): Promise<import("../domain/CatalogItem.js").CatalogItem[]>;
}
//# sourceMappingURL=ListCatalogItems.d.ts.map