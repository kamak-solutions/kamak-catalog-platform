import { prisma } from "../../../lib/prisma.js";
import { slugify } from "../../../shared/utils/slug.js";
export class PrismaTenantRepository {
    async create(name) {
        const baseSlug = slugify(name);
        if (!baseSlug) {
            throw new Error("Invalid tenant name");
        }
        let slug = baseSlug;
        let counter = 1;
        while (await prisma.tenant.findUnique({ where: { slug } })) {
            slug = `${baseSlug}-${counter}`;
            counter++;
        }
        return prisma.tenant.create({
            data: {
                name,
                slug,
            },
        });
    }
    async findById(id) {
        return prisma.tenant.findUnique({
            where: { id },
        });
    }
    async findAll() {
        return prisma.tenant.findMany({
            orderBy: { createdAt: "desc" },
        });
    }
}
//# sourceMappingURL=PrismaTenantRepository.js.map