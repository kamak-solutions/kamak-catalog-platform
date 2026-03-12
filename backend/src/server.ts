import Fastify from "fastify";
import { tenantRoutes } from "./modules/tenant/interfaces/tenat.routes.js";

const app = Fastify({
  logger: {
    transport: {
      target: "pino-pretty",
    },
  },
});

app.get("/health", (request, reply) => {
  return reply.status(200).send({ message: "Ok" });
});

app.register(tenantRoutes);

const start = async () => {
  try {
    await app.listen({
      host: "0.0.0.0",
      port: 3000,
    });

    app.log.info("Servidor rodando na porta http://localhost:3000");
  } catch (err) {
    app.log.error({ err: "Falha no subir servidor" });
  }
};

start();
