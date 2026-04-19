interface RegisterTenantOwnerInput {
    userName: string;
    email: string;
    password: string;
    tenantName: string;
}
export declare class RegisterTenantOwner {
    execute(input: RegisterTenantOwnerInput): Promise<{
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
            createdAt: Date;
        };
    }>;
}
export {};
//# sourceMappingURL=RegisterTenantOwner.d.ts.map