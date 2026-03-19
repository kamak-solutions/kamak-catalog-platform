import { hashPassword } from "../../../shared/security/password.js";
export class CreateUser {
    userRepository;
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async execute(input) {
        if (!input.name || input.name.trim().length < 2) {
            throw new Error("User name must have at least 2 characters");
        }
        if (!input.email || input.email.trim().length < 5) {
            throw new Error("Email is required");
        }
        if (!input.password || input.password.length < 6) {
            throw new Error("Password must have at least 6 characters");
        }
        if (!input.tenantId) {
            throw new Error("Tenant id is required");
        }
        const existingUser = await this.userRepository.findByEmail(input.email);
        if (existingUser) {
            throw new Error("Email already in use");
        }
        const passwordHash = await hashPassword(input.password);
        return this.userRepository.create({
            name: input.name.trim(),
            email: input.email.trim().toLowerCase(),
            passwordHash,
            tenantId: input.tenantId,
            role: input.role ?? "OWNER"
        });
    }
}
//# sourceMappingURL=CreateUser.js.map