import type { TenantRepository } from "../domain/TenatRepository.js";
export declare class PrismaTenantRepository implements TenantRepository {
    create(name: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
    }>;
    findById(id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
    } | null>;
    findAll(): Promise<{
        id: string;
        name: string;
        createdAt: Date;
    }[]>;
}
//# sourceMappingURL=PrismaTenantRepository.d.ts.map