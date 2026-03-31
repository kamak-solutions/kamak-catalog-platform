import type { CatalogItemType } from "../domain/CatalogItem.js";
import type { CatalogRepository } from "../domain/CatalogRepository.js";

interface CreateCatalogItemInput {
  name: string;
  description?: string;
  price?: string;
  imageUrl?: string;
  type: CatalogItemType;
  tenantId: string;
  categoryId?: string;
}

export class CreateCatalogItem {
  constructor(private readonly catalogRepository: CatalogRepository) {}

  async execute(input: CreateCatalogItemInput) {
    if (!input.name || input.name.trim().length < 2) {
      throw new Error("Item name must have at least 2 characters");
    }

    if (!input.tenantId) {
      throw new Error("Tenant id is required");
    }

    if (!input.type || !["PRODUCT", "SERVICE"].includes(input.type)) {
      throw new Error("Invalid catalog item type");
    }

    const data: {
      name: string;
      description?: string;
      price?: string;
      imageUrl?: string;
      type: CatalogItemType;
      tenantId: string;
      categoryId?: string;
    } = {
      name: input.name.trim(),
      type: input.type,
      tenantId: input.tenantId
    };

    if (input.description?.trim()) {
      data.description = input.description.trim();
    }

    if (input.price) {
      data.price = input.price;
    }

    if (input.imageUrl) {
      data.imageUrl = input.imageUrl;
    }

    if (input.categoryId) {
      data.categoryId = input.categoryId;
    }

    return this.catalogRepository.create(data);
  }
}