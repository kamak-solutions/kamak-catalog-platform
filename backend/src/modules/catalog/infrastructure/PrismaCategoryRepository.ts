import { prisma } from "../../../lib/prisma.js";
import type { Category } from "../domain/Category.js";
import type { CategoryRepository } from "../domain/CategoryRepository.js";

function mapCategory(category: {
  id: string;
  name: string;
  tenantId: string;
  createdAt: Date;
}): Category {
  return {
    id: category.id,
    name: category.name,
    tenantId: category.tenantId,
    createdAt: category.createdAt
  };
}

export class PrismaCategoryRepository implements CategoryRepository {
  async create(data: { name: string; tenantId: string }) {
    const category = await prisma.category.create({
      data: {
        name: data.name,
        tenantId: data.tenantId
      }
    });

    return mapCategory(category);
  }

  async findAllByTenant(tenantId: string) {
    const categories = await prisma.category.findMany({
      where: { tenantId },
      orderBy: { createdAt: "desc" }
    });

    return categories.map(mapCategory);
  }
}