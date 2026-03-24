import jwt from "jsonwebtoken";
interface JwtPayload {
    sub: string;
    tenantId: string;
    role: string;
}
export declare function signToken(payload: JwtPayload): string;
export declare function verifyToken(token: string): string | jwt.JwtPayload;
export {};
//# sourceMappingURL=jwt.d.ts.map