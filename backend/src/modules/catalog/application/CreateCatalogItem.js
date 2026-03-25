export class CreateCatalogItem {
    catalogRepository;
    constructor(catalogRepository) {
        this.catalogRepository = catalogRepository;
    }
    async execute(input) {
        if (!input.name || input.name.trim().length < 2) {
            throw new Error("Item name must have at least 2 characters");
        }
        if (!input.tenantId) {
            throw new Error("Tenant id is required");
        }
        if (!input.type || !["PRODUCT", "SERVICE"].includes(input.type)) {
            throw new Error("Invalid catalog item type");
        }
        const data = {
            name: input.name.trim(),
            type: input.type,
            tenantId: input.tenantId
        };
        if (input.description?.trim()) {
            data.description = input.description.trim();
        }
        if (input.price) {
            data.price = input.price;
        }
        if (input.categoryId) {
            data.categoryId = input.categoryId;
        }
        return this.catalogRepository.create(data);
    }
}
//# sourceMappingURL=CreateCatalogItem.js.map