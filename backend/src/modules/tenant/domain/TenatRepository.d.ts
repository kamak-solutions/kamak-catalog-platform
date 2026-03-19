import type { Tenant } from "./Tenant.js";
export interface TenantRepository {
    create(name: string): Promise<Tenant>;
    findById(id: string): Promise<Tenant | null>;
    findAll(): Promise<Tenant[]>;
}
//# sourceMappingURL=TenatRepository.d.ts.map