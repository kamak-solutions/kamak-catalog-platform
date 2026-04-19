import { z } from "zod";
import { RegisterTenantOwner } from "../application/RegisterTenantOwner.js";
const registerBodySchema = z.object({
    userName: z.string().min(2),
    email: z.email(),
    password: z.string().min(6),
    tenantName: z.string().min(2)
});
export class RegisterController {
    async handle(request, reply) {
        try {
            const body = registerBodySchema.parse(request.body);
            const registerTenantOwner = new RegisterTenantOwner();
            const result = await registerTenantOwner.execute({
                userName: body.userName,
                email: body.email,
                password: body.password,
                tenantName: body.tenantName
            });
            return reply.status(201).send(result);
        }
        catch (error) {
            return reply.status(400).send({
                message: error instanceof Error ? error.message : "Invalid request"
            });
        }
    }
}
//# sourceMappingURL=RegisterController.js.map