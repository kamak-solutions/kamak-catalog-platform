import type { CatalogRepository } from "../domain/CatalogRepository.js";

export class ListCatalogItems {
  constructor(private readonly catalogRepository: CatalogRepository) {}

  async execute(tenantId: string) {
    if (!tenantId) {
      throw new Error("Tenant id is required");
    }

    return this.catalogRepository.findAllByTenant(tenantId);
  }
}