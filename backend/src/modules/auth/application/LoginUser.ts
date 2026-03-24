import { comparePassword } from "../../../shared/security/password.js";
import { signToken } from "../../../shared/security/jwt.js";
import type { UserRepository } from "../../user/domain/UserRepository.js";

interface LoginUserInput {
  email: string;
  password: string;
}

export class LoginUser {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(input: LoginUserInput) {
    if (!input.email || input.email.trim().length < 5) {
      throw new Error("Email is required");
    }

    if (!input.password || input.password.length < 6) {
      throw new Error("Password must have at least 6 characters");
    }

    const user = await this.userRepository.findByEmail(
      input.email.trim().toLowerCase()
    );

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const passwordMatches = await comparePassword(
      input.password,
      user.passwordHash
    );

    if (!passwordMatches) {
      throw new Error("Invalid credentials");
    }

    const token = signToken({
      sub: user.id,
      tenantId: user.tenantId,
      role: user.role
    });

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        tenantId: user.tenantId,
        createdAt: user.createdAt
      }
    };
  }
}