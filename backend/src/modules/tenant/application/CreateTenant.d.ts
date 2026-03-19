import type { TenantRepository } from "../domain/TenatRepository.js";
export declare class CreateTenant {
    private readonly tenantRepository;
    constructor(tenantRepository: TenantRepository);
    execute(name: string): Promise<import("../domain/Tenant.js").Tenant>;
}
//# sourceMappingURL=CreateTenant.d.ts.map