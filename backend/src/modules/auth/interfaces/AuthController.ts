import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { LoginUser } from "../application/LoginUser.js";

const loginBodySchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});

export class AuthController {
  async login(request: FastifyRequest, reply: FastifyReply) {
    try {
      const body = loginBodySchema.parse(request.body);
      const loginUser = new LoginUser();

      const result = await loginUser.execute({
        email: body.email,
        password: body.password,
      });

      return reply.status(200).send(result);
    } catch (error) {
      return reply.status(401).send({
        message: error instanceof Error ? error.message : "Invalid request",
      });
    }
  }
}