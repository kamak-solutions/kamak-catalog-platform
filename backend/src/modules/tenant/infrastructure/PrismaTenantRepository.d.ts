export declare class PrismaTenantRepository {
    create(name: string): Promise<{
        id: string;
        name: string;
        slug: string;
        description: string | null;
        whatsapp: string | null;
        createdAt: Date;
    }>;
    findById(id: string): Promise<{
        id: string;
        name: string;
        slug: string;
        description: string | null;
        whatsapp: string | null;
        createdAt: Date;
    } | null>;
    findAll(): Promise<{
        id: string;
        name: string;
        slug: string;
        description: string | null;
        whatsapp: string | null;
        createdAt: Date;
    }[]>;
}
//# sourceMappingURL=PrismaTenantRepository.d.ts.map