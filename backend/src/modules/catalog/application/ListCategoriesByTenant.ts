import type { CategoryRepository } from "../domain/CategoryRepository.js";

export class ListCategoriesByTenant {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(tenantId: string) {
    if (!tenantId) {
      throw new Error("Tenant id is required");
    }

    return this.categoryRepository.findAllByTenant(tenantId);
  }
}