import { z } from "zod";
import { LoginUser } from "../application/LoginUser.js";
import { PrismaUserRepository } from "../../user/infrastructure/PrismaUserRepository.js";
const loginBodySchema = z.object({
    email: z.email(),
    password: z.string().min(6)
});
export class AuthController {
    async login(request, reply) {
        try {
            const body = loginBodySchema.parse(request.body);
            const userRepository = new PrismaUserRepository();
            const loginUser = new LoginUser(userRepository);
            const result = await loginUser.execute({
                email: body.email,
                password: body.password
            });
            return reply.status(200).send(result);
        }
        catch (error) {
            return reply.status(401).send({
                message: error instanceof Error ? error.message : "Invalid request"
            });
        }
    }
}
//# sourceMappingURL=AuthController.js.map