"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const role = (allowedRoles) => {
    return async (request, response, next) => {
        const user = request.user;
        if (!user || !user.role || !allowedRoles.includes(user.role)) {
            return response.status(403).json({ error: "Unauthorized" });
        }
        return next();
    };
};
exports.default = role;
//# sourceMappingURL=role.js.map