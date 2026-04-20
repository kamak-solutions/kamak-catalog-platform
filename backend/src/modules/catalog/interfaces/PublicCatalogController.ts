import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { GetPublicCatalog } from "../application/GetPublicCatalog.js";

const publicCatalogParamsSchema = z.object({
  slug: z.string().min(1),
});

export class PublicCatalogController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    try {
      const params = publicCatalogParamsSchema.parse(request.params);

      const getPublicCatalog = new GetPublicCatalog();
      const result = await getPublicCatalog.execute(params.slug);
      return reply.status(200).send(result);
    } catch (error) {
      return reply.status(404).send({
        message: error instanceof Error ? error.message : "Catalog not found",
      });
    }
  }
}
