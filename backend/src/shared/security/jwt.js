import jwt from "jsonwebtoken";
function getJwtSecret() {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("JWT_SECRET is not defined");
    }
    return secret;
}
export function signToken(payload) {
    return jwt.sign(payload, getJwtSecret(), {
        expiresIn: "1d"
    });
}
export function verifyToken(token) {
    return jwt.verify(token, getJwtSecret());
}
//# sourceMappingURL=jwt.js.map