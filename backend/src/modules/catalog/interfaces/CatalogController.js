import { z } from "zod";
import { CreateCatalogItem } from "../application/CreateCatalogItem.js";
import { ListCatalogItems } from "../application/ListCatalogItems.js";
import { PrismaCatalogRepository } from "../infrastructure/PrismaCatalogRepository.js";
const createCatalogItemBodySchema = z.object({
    name: z.string().min(2),
    description: z.string().optional(),
    price: z.string().optional(),
    type: z.enum(["PRODUCT", "SERVICE"]),
    categoryId: z.uuid().optional()
});
const listCatalogItemsParamsSchema = z.object({
    tenantId: z.uuid()
});
export class CatalogController {
    async create(request, reply) {
        try {
            const body = createCatalogItemBodySchema.parse(request.body);
            const catalogRepository = new PrismaCatalogRepository();
            const createCatalogItem = new CreateCatalogItem(catalogRepository);
            const data = {
                name: body.name,
                type: body.type,
                tenantId: request.user.tenantId
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
                message: error instanceof Error ? error.message : "Invalid request"
            });
        }
    }
    async findAllByTenant(request, reply) {
        try {
            const params = listCatalogItemsParamsSchema.parse(request.params);
            const catalogRepository = new PrismaCatalogRepository();
            const listCatalogItems = new ListCatalogItems(catalogRepository);
            const items = await listCatalogItems.execute(params.tenantId);
            return reply.status(200).send(items);
        }
        catch (error) {
            return reply.status(400).send({
                message: error instanceof Error ? error.message : "Invalid request"
            });
        }
    }
}
//# sourceMappingURL=CatalogController.js.map