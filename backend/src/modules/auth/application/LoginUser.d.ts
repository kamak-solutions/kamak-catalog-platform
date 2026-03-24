import type { UserRepository } from "../../user/domain/UserRepository.js";
interface LoginUserInput {
    email: string;
    password: string;
}
export declare class LoginUser {
    private readonly userRepository;
    constructor(userRepository: UserRepository);
    execute(input: LoginUserInput): Promise<{
        token: string;
        user: {
            id: string;
            name: string;
            email: string;
            role: import("../../user/domain/User.js").UserRole;
            tenantId: string;
            createdAt: Date;
        };
    }>;
}
export {};
//# sourceMappingURL=LoginUser.d.ts.map