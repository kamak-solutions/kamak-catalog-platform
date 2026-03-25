import type { Category } from "../domain/Category.js";
import type { CategoryRepository } from "../domain/CategoryRepository.js";
export declare class PrismaCategoryRepository implements CategoryRepository {
    create(data: {
        name: string;
        tenantId: string;
    }): Promise<Category>;
    findAllByTenant(tenantId: string): Promise<Category[]>;
}
//# sourceMappingURL=PrismaCategoryRepository.d.ts.map