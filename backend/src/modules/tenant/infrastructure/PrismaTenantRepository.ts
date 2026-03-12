import { prisma } from "../../../lib/prisma.js";
import type { TenantRepository } from "../domain/TenatRepository.js";

export class PrismaTenantRepository implements TenantRepository {

  async create(name: string) {
    return prisma.tenant.create({
      data: { name }
    });
  }

  async findById(id: string) {
    return prisma.tenant.findUnique({
      where: { id }
    });
  }

  async findAll() {
    return prisma.tenant.findMany();
  }

}