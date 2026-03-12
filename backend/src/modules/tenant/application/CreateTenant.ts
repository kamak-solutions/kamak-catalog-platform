import type { TenantRepository } from "../domain/TenatRepository.js";

export class CreateTenant {
  constructor(private readonly tenantRepository: TenantRepository) {}

  async execute(name: string) {
    if (!name || name.trim().length < 2) {
      throw new Error("Tenant name must have at least 2 characters");
    }

    return this.tenantRepository.create(name.trim());
  }
}