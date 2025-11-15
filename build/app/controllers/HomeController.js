"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Controller {
    async index(request, response) {
        return response.inertia("home");
    }
}
exports.default = new Controller();
//# sourceMappingURL=HomeController.js.map