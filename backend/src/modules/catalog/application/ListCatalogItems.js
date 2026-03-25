export class ListCatalogItems {
    catalogRepository;
    constructor(catalogRepository) {
        this.catalogRepository = catalogRepository;
    }
    async execute(tenantId) {
        if (!tenantId) {
            throw new Error("Tenant id is required");
        }
        return this.catalogRepository.findAllByTenant(tenantId);
    }
}
//# sourceMappingURL=ListCatalogItems.js.map