import { prisma } from "../../../lib/prisma.js";

interface UpdateTenantProfileInput {
  tenantId: string;
  name?: string;
  description?: string;
  whatsapp?: string;
}

export class UpdateTenantProfile {
  async execute(input: UpdateTenantProfileInput) {
    const tenant = await prisma.tenant.findUnique({
      where: { id: input.tenantId },
    });

    if (!tenant) {
      throw new Error("Tenant not found");
    }

    return prisma.tenant.update({
      where: { id: input.tenantId },
      data: {
        ...(input.name !== undefined ? { name: input.name.trim() } : {}),
        ...(input.description !== undefined
          ? { description: input.description?.trim() || null }
          : {}),
        ...(input.whatsapp !== undefined
          ? { whatsapp: input.whatsapp?.trim() || null }
          : {}),
      },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        whatsapp: true,
        createdAt: true,
      },
    });
  }
}