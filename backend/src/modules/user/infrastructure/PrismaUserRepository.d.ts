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
        tenantId: string;
        role: import("../../../generated/prisma/enums.js").UserRole;
        id: string;
        name: string;
        createdAt: Date;
        email: string;
        passwordHash: string;
    }>;
    findByEmail(email: string): Promise<{
        tenantId: string;
        role: import("../../../generated/prisma/enums.js").UserRole;
        id: string;
        name: string;
        createdAt: Date;
        email: string;
        passwordHash: string;
    } | null>;
}
//# sourceMappingURL=PrismaUserRepository.d.ts.map