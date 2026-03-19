import { UserController } from "./UserController.js";
export async function userRoutes(app) {
    const userController = new UserController();
    app.post("/users", userController.create.bind(userController));
}
//# sourceMappingURL=user.routes.js.map