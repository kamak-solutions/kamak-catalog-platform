import type { FastifyInstance } from "fastify";
import { RegisterController } from "./RegisterController.js";

export async function registerRoutes(app: FastifyInstance) {
  const registerController = new RegisterController();

  app.post("/auth/register", registerController.handle.bind(registerController));
}