import { prisma } from "../../../lib/prisma.js";
export class PrismaUserRepository {
    async create(data) {
        return prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                passwordHash: data.passwordHash,
                tenantId: data.tenantId,
                role: data.role ?? "OWNER"
            }
        });
    }
    async findByEmail(email) {
        return prisma.user.findUnique({
            where: { email }
        });
    }
}
//# sourceMappingURL=PrismaUserRepository.js.map