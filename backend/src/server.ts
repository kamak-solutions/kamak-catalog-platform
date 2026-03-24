import Fastify from "fastify";
import { authRoutes } from "./modules/auth/interfaces/auth.routes.js";
import { tenantRoutes } from "./modules/tenant/interfaces/tenat.routes.js";
import { userRoutes } from "./modules/user/interfaces/user.routes.js";

const app = Fastify({
  logger: {
    transport:{
      target:"pino-pretty"
    }
  }
});

app.get("/", async () => {
  return {
    status: "ok",
    service: "kamak-catalog-platform-backend"
  };
});

app.register(tenantRoutes);
app.register(userRoutes);
app.register(authRoutes);

const start = async (): Promise<void> => {
  try {
    await app.listen({
      host: "0.0.0.0",
      port: 3000
    });

    app.log.info("Servidor rodando na porta http://localhost:3000");
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
};

start();