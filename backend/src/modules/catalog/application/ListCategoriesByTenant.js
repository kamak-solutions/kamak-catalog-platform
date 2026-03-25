export class ListCategoriesByTenant {
    categoryRepository;
    constructor(categoryRepository) {
        this.categoryRepository = categoryRepository;
    }
    async execute(tenantId) {
        if (!tenantId) {
            throw new Error("Tenant id is required");
        }
        return this.categoryRepository.findAllByTenant(tenantId);
    }
}
//# sourceMappingURL=ListCategoriesByTenant.js.map