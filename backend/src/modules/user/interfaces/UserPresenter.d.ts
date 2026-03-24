import type { User } from "../domain/User.js";
export declare function presentUser(user: User): {
    id: string;
    name: string;
    email: string;
    role: import("../domain/User.js").UserRole;
    tenantId: string;
    createdAt: Date;
};
//# sourceMappingURL=UserPresenter.d.ts.map