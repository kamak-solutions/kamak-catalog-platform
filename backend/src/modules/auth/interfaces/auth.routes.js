import { AuthController } from "./AuthController.js";
export async function authRoutes(app) {
    const authController = new AuthController();
    app.post("/auth/login", authController.login.bind(authController));
}
//# sourceMappingURL=auth.routes.js.map