import { hashPassword } from "../../../shared/security/password.js";
import type { UserRepository } from "../domain/UserRepository.js";

interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  tenantId: string;
  role?: "OWNER" | "ADMIN" | "MEMBER";
}

export class CreateUser {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(input: CreateUserInput) {
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