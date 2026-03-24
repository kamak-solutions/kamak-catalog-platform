import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { CreateUser } from "../application/CreateUser.js";
import { presentUser } from "./UserPresenter.js";
import { PrismaUserRepository } from "../infrastructure/PrismaUserRepository.js";

const createUserBodySchema = z.object({
  name: z.string().min(2),
  email: z.email(),
  password: z.string().min(6),
  tenantId: z.uuid(),
});

export class UserController {
  async create(request: FastifyRequest, reply: FastifyReply) {
    try {
      const body = createUserBodySchema.parse(request.body);

      const userRepository = new PrismaUserRepository();
      const createUser = new CreateUser(userRepository);

      const user = await createUser.execute({
        name: body.name,
        email: body.email,
        password: body.password,
        tenantId: body.tenantId,
        role: "OWNER",
      });

      return reply.status(201).send(presentUser(user));
    } catch (error) {
      return reply.status(400).send({
        message: error instanceof Error ? error.message : "Invalid request",
      });
    }
  }
}
