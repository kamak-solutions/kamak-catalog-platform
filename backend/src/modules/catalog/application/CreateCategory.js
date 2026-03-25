export class CreateCategory {
    categoryRepository;
    constructor(categoryRepository) {
        this.categoryRepository = categoryRepository;
    }
    async execute(input) {
        if (!input.name || input.name.trim().length < 2) {
            throw new Error("Category name must have at least 2 characters");
        }
        if (!input.tenantId) {
            throw new Error("Tenant id is required");
        }
        return this.categoryRepository.create({
            name: input.name.trim(),
            tenantId: input.tenantId
        });
    }
}
//# sourceMappingURL=CreateCategory.js.map