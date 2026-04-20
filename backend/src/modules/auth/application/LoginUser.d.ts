interface LoginUserInput {
    email: string;
    password: string;
}
export declare class LoginUser {
    execute(input: LoginUserInput): Promise<{
        token: string;
        user: {
            id: string;
            name: string;
            email: string;
            role: import("../../../generated/prisma/enums.js").UserRole;
            tenantId: string;
            createdAt: Date;
        };
        tenant: {
            id: string;
            name: string;
            slug: string;
            createdAt: Date;
        };
    }>;
}
export {};
//# sourceMappingURL=LoginUser.d.ts.map