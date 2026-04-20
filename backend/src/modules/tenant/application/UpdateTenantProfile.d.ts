interface UpdateTenantProfileInput {
    tenantId: string;
    name?: string;
    description?: string;
    whatsapp?: string;
}
export declare class UpdateTenantProfile {
    execute(input: UpdateTenantProfileInput): Promise<{
        id: string;
        name: string;
        slug: string;
        description: string | null;
        whatsapp: string | null;
        createdAt: Date;
    }>;
}
export {};
//# sourceMappingURL=UpdateTenantProfile.d.ts.map