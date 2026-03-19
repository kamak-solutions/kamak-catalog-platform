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
        email: string;
        passwordHash: string;
        role: import("../../../generated/prisma/enums.js").UserRole;
        tenantId: string;
    }>;
    findByEmail(email: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        email: string;
        passwordHash: string;
        role: import("../../../generated/prisma/enums.js").UserRole;
        tenantId: string;
    } | null>;
}
//# sourceMappingURL=PrismaUserRepository.d.ts.map