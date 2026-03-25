import type { Category } from "./Category.js";

export interface CategoryRepository {
  create(data: {
    name: string;
    tenantId: string;
  }): Promise<Category>;

  findAllByTenant(tenantId: string): Promise<Category[]>;
}