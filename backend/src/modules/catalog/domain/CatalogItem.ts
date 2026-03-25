export type CatalogItemType = "PRODUCT" | "SERVICE";

export interface CatalogItem {
  id: string;
  name: string;
  description: string | null;
  price: string | null;
  type: CatalogItemType;
  active: boolean;
  tenantId: string;
  categoryId: string | null;
  createdAt: Date;
  updatedAt: Date;
}
