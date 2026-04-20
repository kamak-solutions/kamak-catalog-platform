import { prisma } from "../../../lib/prisma.js";
import { signToken } from "../../../shared/security/jwt.js";
import { comparePassword } from "../../../shared/security/password.js";
export class LoginUser {
    async execute(input) {
        if (!input.email || !input.email.includes("@")) {
            throw new Error("Invalid email");
        }
        if (!input.password) {
            throw new Error("Password is required");
        }
        const user = await prisma.user.findUnique({
            where: {
                email: input.email.toLowerCase().trim(),
            },
            include: {
                tenant: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        createdAt: true,
                    },
                },
            },
        });
        if (!user) {
            throw new Error("Invalid credentials");
        }
        const passwordMatches = await comparePassword(input.password, user.passwordHash);
        if (!passwordMatches) {
            throw new Error("Invalid credentials");
        }
        const token = signToken({
            sub: user.id,
            tenantId: user.tenantId,
            role: user.role,
        });
        return {
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                tenantId: user.tenantId,
                createdAt: user.createdAt,
            },
            tenant: {
                id: user.tenant.id,
                name: user.tenant.name,
                slug: user.tenant.slug,
                createdAt: user.tenant.createdAt,
            },
        };
    }
}
//# sourceMappingURL=LoginUser.js.map