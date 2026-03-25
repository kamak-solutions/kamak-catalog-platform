import type { CategoryRepository } from "../domain/CategoryRepository.js";
export declare class ListCategoriesByTenant {
    private readonly categoryRepository;
    constructor(categoryRepository: CategoryRepository);
    execute(tenantId: string): Promise<import("../domain/Category.js").Category[]>;
}
//# sourceMappingURL=ListCategoriesByTenant.d.ts.map