import { z } from "zod";
import { CreateCatalogItem } from "../application/CreateCatalogItem.js";
import { ListCatalogItems } from "../application/ListCatalogItems.js";
import { PrismaCatalogRepository } from "../infrastructure/PrismaCatalogRepository.js";
import { CreateCategory } from "../application/CreateCategory.js";
import { ListCategoriesByTenant } from "../application/ListCategoriesByTenant.js";
import { PrismaCategoryRepository } from "../infrastructure/PrismaCategoryRepository.js";
const createCatalogItemBodySchema = z.object({
    name: z.string().min(2),
    description: z.string().optional(),
    price: z.string().optional(),
    type: z.enum(["PRODUCT", "SERVICE"]),
    categoryId: z.uuid().optional(),
});
const listCatalogItemsParamsSchema = z.object({
    tenantId: z.uuid(),
});
const createCategoryBodySchema = z.object({
    name: z.string().min(2),
});
const listCategoriesParamsSchema = z.object({
    tenantId: z.uuid(),
});
const listCatalogItemsQuerySchema = z.object({
    categoryId: z.uuid().optional(),
});
export class CatalogController {
    async createCategory(request, reply) {
        try {
            const body = createCategoryBodySchema.parse(request.body);
            const categoryRepository = new PrismaCategoryRepository();
            const createCategory = new CreateCategory(categoryRepository);
            const category = await createCategory.execute({
                name: body.name,
                tenantId: request.user.tenantId,
            });
            return reply.status(201).send(category);
        }
        catch (error) {
            return reply.status(400).send({
                message: error instanceof Error ? error.message : "Invalid request",
            });
        }
    }
    async findCategoriesByTenant(request, reply) {
        try {
            const params = listCategoriesParamsSchema.parse(request.params);
            const categoryRepository = new PrismaCategoryRepository();
            const listCategoriesByTenant = new ListCategoriesByTenant(categoryRepository);
            const categories = await listCategoriesByTenant.execute(params.tenantId);
            return reply.status(200).send(categories);
        }
        catch (error) {
            return reply.status(400).send({
                message: error instanceof Error ? error.message : "Invalid request",
            });
        }
    }
    async create(request, reply) {
        try {
            const body = createCatalogItemBodySchema.parse(request.body);
            const catalogRepository = new PrismaCatalogRepository();
            const createCatalogItem = new CreateCatalogItem(catalogRepository);
            const data = {
                name: body.name,
                type: body.type,
                tenantId: request.user.tenantId,
            };
            if (body.description) {
                data.description = body.description;
            }
            if (body.price) {
                data.price = body.price;
            }
            if (body.categoryId) {
                data.categoryId = body.categoryId;
            }
            const item = await createCatalogItem.execute(data);
            return reply.status(201).send(item);
        }
        catch (error) {
            return reply.status(400).send({
                message: error instanceof Error ? error.message : "Invalid request",
            });
        }
    }
    async findAllByTenant(request, reply) {
        try {
            const params = listCatalogItemsParamsSchema.parse(request.params);
            const query = listCatalogItemsQuerySchema.parse(request.query);
            const catalogRepository = new PrismaCatalogRepository();
            const listCatalogItems = new ListCatalogItems(catalogRepository);
            const items = await listCatalogItems.execute(params.tenantId, query.categoryId);
            return reply.status(200).send(items);
        }
        catch (error) {
            return reply.status(400).send({
                message: error instanceof Error ? error.message : "Invalid request",
            });
        }
    }
}
//# sourceMappingURL=CatalogController.js.map