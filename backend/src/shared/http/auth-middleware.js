import jwt from "jsonwebtoken";
function getJwtSecret() {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("JWT_SECRET is not defined");
    }
    return secret;
}
function isAuthTokenPayload(payload) {
    if (!payload || typeof payload !== "object") {
        return false;
    }
    const value = payload;
    return (typeof value.sub === "string" &&
        typeof value.tenantId === "string" &&
        typeof value.role === "string");
}
export async function authMiddleware(request, reply) {
    const authHeader = request.headers.authorization;
    if (!authHeader) {
        return reply.status(401).send({
            message: "Authorization header is missing"
        });
    }
    const [scheme, token] = authHeader.split(" ");
    if (scheme !== "Bearer" || !token) {
        return reply.status(401).send({
            message: "Invalid authorization format"
        });
    }
    try {
        const decoded = jwt.verify(token, getJwtSecret());
        if (!isAuthTokenPayload(decoded)) {
            return reply.status(401).send({
                message: "Invalid token payload"
            });
        }
        request.user = {
            id: decoded.sub,
            tenantId: decoded.tenantId,
            role: decoded.role
        };
    }
    catch {
        return reply.status(401).send({
            message: "Invalid or expired token"
        });
    }
}
//# sourceMappingURL=auth-middleware.js.map