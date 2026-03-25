export class ListCatalogItems {
    catalogRepository;
    constructor(catalogRepository) {
        this.catalogRepository = catalogRepository;
    }
    async execute(tenantId, categoryId) {
        if (!tenantId) {
            throw new Error("Tenant id is required");
        }
        return this.catalogRepository.findAllByTenant(tenantId, categoryId);
    }
}
//# sourceMappingURL=ListCatalogItems.js.map