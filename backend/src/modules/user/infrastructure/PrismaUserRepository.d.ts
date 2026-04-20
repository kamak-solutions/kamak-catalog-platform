import type { UserRole } from "../domain/User.js";
import type { UserRepository } from "../domain/UserRepository.js";
export declare class PrismaUserRepository implements UserRepository {
    create(data: {
        name: string;
        email: string;
        passwordHash: string;
        tenantId: string;
        role?: UserRole;
    }): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        tenantId: string;
        role: import("../../../generated/prisma/enums.js").UserRole;
        email: string;
        passwordHash: string;
    }>;
    findByEmail(email: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        tenantId: string;
        role: import("../../../generated/prisma/enums.js").UserRole;
        email: string;
        passwordHash: string;
    } | null>;
}
//# sourceMappingURL=PrismaUserRepository.d.ts.map