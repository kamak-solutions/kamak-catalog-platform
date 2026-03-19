export class CreateTenant {
    tenantRepository;
    constructor(tenantRepository) {
        this.tenantRepository = tenantRepository;
    }
    async execute(name) {
        if (!name || name.trim().length < 2) {
            throw new Error("Tenant name must have at least 2 characters");
        }
        return this.tenantRepository.create(name.trim());
    }
}
//# sourceMappingURL=CreateTenant.js.map