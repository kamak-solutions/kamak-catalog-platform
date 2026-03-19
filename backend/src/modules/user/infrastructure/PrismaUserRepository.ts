import { prisma } from "../../../lib/prisma.js";
import type { UserRole } from "../domain/User.js";
import type { UserRepository } from "../domain/UserRepository.js";

export class PrismaUserRepository implements UserRepository {
  async create(data: {
    name: string;
    email: string;
    passwordHash: string;
    tenantId: string;
    role?: UserRole;
  }) {
    return prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash: data.passwordHash,
        tenantId: data.tenantId,
        role: data.role ?? "OWNER"
      }
    });
  }

  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email }
    });
  }
}