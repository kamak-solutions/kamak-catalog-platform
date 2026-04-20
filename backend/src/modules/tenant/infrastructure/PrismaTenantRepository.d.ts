export declare class PrismaTenantRepository {
    create(name: string): Promise<{
        id: string;
        name: string;
        slug: string;
        createdAt: Date;
    }>;
    findById(id: string): Promise<{
        id: string;
        name: string;
        slug: string;
        createdAt: Date;
    } | null>;
    findAll(): Promise<{
        id: string;
        name: string;
        slug: string;
        createdAt: Date;
    }[]>;
}
//# sourceMappingURL=PrismaTenantRepository.d.ts.map