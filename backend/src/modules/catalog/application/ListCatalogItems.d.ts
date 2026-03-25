import type { CatalogRepository } from "../domain/CatalogRepository.js";
export declare class ListCatalogItems {
    private readonly catalogRepository;
    constructor(catalogRepository: CatalogRepository);
    execute(tenantId: string): Promise<import("../domain/CatalogItem.js").CatalogItem[]>;
}
//# sourceMappingURL=ListCatalogItems.d.ts.map