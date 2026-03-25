import type { CategoryRepository } from "../domain/CategoryRepository.js";

interface CreateCategoryInput {
  name: string;
  tenantId: string;
}

export class CreateCategory {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(input: CreateCategoryInput) {
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