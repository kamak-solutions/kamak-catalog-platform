import { prisma } from "../../../lib/prisma.js";
import type { CatalogItem, CatalogItemType } from "../domain/CatalogItem.js";
import type { CatalogRepository } from "../domain/CatalogRepository.js";

function mapCatalogItem(item: {
  id: string;
  name: string;
  description: string | null;
  price: { toString(): string } | null;
  type: CatalogItemType;
  active: boolean;
  tenantId: string;
  categoryId: string | null;
  createdAt: Date;
  updatedAt: Date;
  category?: {
    id: string;
    name: string;
  } | null;
}): CatalogItem {
  return {
    id: item.id,
    name: item.name,
    description: item.description,
    price: item.price ? item.price.toString() : null,
    type: item.type,
    active: item.active,
    tenantId: item.tenantId,
    categoryId: item.categoryId,
    category: item.category
      ? {
          id: item.category.id,
          name: item.category.name
        }
      : null,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt
  };
}

export class PrismaCatalogRepository implements CatalogRepository {
  async create(data: {
    name: string;
    description?: string;
    price?: string;
    type: CatalogItemType;
    tenantId: string;
    categoryId?: string;
  }) {
    const item = await prisma.catalogItem.create({
      data: {
        name: data.name,
        description: data.description ?? null,
        price: data.price ?? null,
        type: data.type,
        tenantId: data.tenantId,
        categoryId: data.categoryId ?? null
      },
      include: {
        category: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    return mapCatalogItem(item);
  }

  async findAllByTenant(tenantId: string, categoryId?: string) {
    const items = await prisma.catalogItem.findMany({
      where: {
        tenantId,
        ...(categoryId ? { categoryId } : {})
      },
      include: {
        category: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    return items.map(mapCatalogItem);
  }
}