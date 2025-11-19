"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class LegalController {
    async privacy(request, response) {
        return response.inertia("privacy-policy");
    }
    async terms(request, response) {
        return response.inertia("terms-of-service");
    }
}
exports.default = new LegalController();
//# sourceMappingURL=LegalController.js.map