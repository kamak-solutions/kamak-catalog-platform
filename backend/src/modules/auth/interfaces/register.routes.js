import { RegisterController } from "./RegisterController.js";
export async function registerRoutes(app) {
    const registerController = new RegisterController();
    app.post("/auth/register", registerController.handle.bind(registerController));
}
//# sourceMappingURL=register.routes.js.map