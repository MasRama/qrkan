"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DB_1 = __importDefault(require("../services/DB"));
class ScanController {
    async page(request, response) {
        const eventId = request.params.eventId;
        const event = await (0, DB_1.default)("events").where("id", eventId).first();
        if (!event) {
            return response.status(404).send("Event not found");
        }
        return response.inertia("scan/index", { event });
    }
}
exports.default = new ScanController();
//# sourceMappingURL=ScanController.js.map