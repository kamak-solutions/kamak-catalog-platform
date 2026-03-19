import type { User, UserRole } from "./User.js";
export interface UserRepository {
    create(data: {
        name: string;
        email: string;
        passwordHash: string;
        tenantId: string;
        role?: UserRole;
    }): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
}
//# sourceMappingURL=UserRepository.d.ts.map