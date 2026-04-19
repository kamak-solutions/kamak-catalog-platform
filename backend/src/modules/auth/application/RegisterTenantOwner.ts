import { prisma } from "../../../lib/prisma.js";
import { hashPassword } from "../../../shared/security/password.js";
import { signToken } from "../../../shared/security/jwt.js";

interface RegisterTenantOwnerInput {
  userName: string;
  email: string;
  password: string;
  tenantName: string;
}

export class RegisterTenantOwner {
  async execute(input: RegisterTenantOwnerInput) {
    if (!input.userName || input.userName.trim().length < 2) {
      throw new Error("User name must have at least 2 characters");
    }

    if (!input.tenantName || input.tenantName.trim().length < 2) {
      throw new Error("Tenant name must have at least 2 characters");
    }

    if (!input.email || !input.email.includes("@")) {
      throw new Error("Invalid email");
    }

    if (!input.password || input.password.length < 6) {
      throw new Error("Password must have at least 6 characters");
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        email: input.email
      }
    });

    if (existingUser) {
      throw new Error("Email already in use");
    }

    const passwordHash = await hashPassword(input.password);

    const result = await prisma.$transaction(async (tx) => {
      const tenant = await tx.tenant.create({
        data: {
          name: input.tenantName.trim()
        }
      });

      const user = await tx.user.create({
        data: {
          name: input.userName.trim(),
          email: input.email.toLowerCase().trim(),
          passwordHash,
          role: "OWNER",
          tenantId: tenant.id
        }
      });

      return { tenant, user };
    });

    const token = signToken({
      sub: result.user.id,
      tenantId: result.user.tenantId,
      role: result.user.role
    });

    return {
      token,
      user: {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        role: result.user.role,
        tenantId: result.user.tenantId,
        createdAt: result.user.createdAt
      },
      tenant: {
        id: result.tenant.id,
        name: result.tenant.name,
        createdAt: result.tenant.createdAt
      }
    };
  }
}