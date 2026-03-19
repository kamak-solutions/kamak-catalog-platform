import type { UserRepository } from "../domain/UserRepository.js";
interface CreateUserInput {
    name: string;
    email: string;
    password: string;
    tenantId: string;
    role?: "OWNER" | "ADMIN" | "MEMBER";
}
export declare class CreateUser {
    private readonly userRepository;
    constructor(userRepository: UserRepository);
    execute(input: CreateUserInput): Promise<import("../domain/User.js").User>;
}
export {};
//# sourceMappingURL=CreateUser.d.ts.map