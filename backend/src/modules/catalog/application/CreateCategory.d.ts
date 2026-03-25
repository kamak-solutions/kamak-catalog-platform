import type { CategoryRepository } from "../domain/CategoryRepository.js";
interface CreateCategoryInput {
    name: string;
    tenantId: string;
}
export declare class CreateCategory {
    private readonly categoryRepository;
    constructor(categoryRepository: CategoryRepository);
    execute(input: CreateCategoryInput): Promise<import("../domain/Category.js").Category>;
}
export {};
//# sourceMappingURL=CreateCategory.d.ts.map