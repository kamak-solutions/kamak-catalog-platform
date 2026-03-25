import type { CatalogItemType } from "../domain/CatalogItem.js";
import type { CatalogRepository } from "../domain/CatalogRepository.js";

interface UpdateCatalogItemInput {
  itemId: string;
  tenantId: string;
  name?: string;
  description?: string;
  price?: string;
  type?: CatalogItemType;
  categoryId?: string | null;
  active?: boolean;
}

export class UpdateCatalogItem {
  constructor(private readonly catalogRepository: CatalogRepository) {}

  async execute(input: UpdateCatalogItemInput) {
    if (!input.itemId) {
      throw new Error("Item id is required");
    }

    if (!input.tenantId) {
      throw new Error("Tenant id is required");
    }

    const existingItem = await this.catalogRepository.findById(input.itemId);

    if (!existingItem) {
      throw new Error("Catalog item not found");
    }

    if (existingItem.tenantId !== input.tenantId) {
      throw new Error("You cannot modify an item from another tenant");
    }

    const data: {
      itemId: string;
      tenantId: string;
      name?: string;
      description?: string;
      price?: string;
      type?: CatalogItemType;
      categoryId?: string | null;
      active?: boolean;
    } = {
      itemId: input.itemId,
      tenantId: input.tenantId
    };

    if (input.name !== undefined) {
      if (input.name.trim().length < 2) {
        throw new Error("Item name must have at least 2 characters");
      }
      data.name = input.name.trim();
    }

    if (input.description !== undefined) {
      data.description = input.description.trim();
    }

    if (input.price !== undefined) {
      data.price = input.price;
    }

    if (input.type !== undefined) {
      if (!["PRODUCT", "SERVICE"].includes(input.type)) {
        throw new Error("Invalid catalog item type");
      }
      data.type = input.type;
    }

    if (input.categoryId !== undefined) {
      data.categoryId = input.categoryId;
    }

    if (input.active !== undefined) {
      data.active = input.active;
    }

    return this.catalogRepository.update(data);
  }
}