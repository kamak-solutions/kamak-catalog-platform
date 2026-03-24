import type { FastifyInstance } from "fastify";
import { AuthController } from "./AuthController.js";

export async function authRoutes(app: FastifyInstance) {
  const authController = new AuthController();

  app.post("/auth/login", authController.login.bind(authController));
}