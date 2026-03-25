import type { CatalogRepository } from "../domain/CatalogRepository.ts";

export class ListCatalogItems {
  constructor(private readonly catalogRepository: CatalogRepository) {}

  async execute(tenantId: string, categoryId?: string) {
    if (!tenantId) {
      throw new Error("Tenant id is required");
    }

    return this.catalogRepository.findAllByTenant(tenantId, categoryId);
  }
}