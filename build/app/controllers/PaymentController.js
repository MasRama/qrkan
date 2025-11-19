"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DB_1 = __importDefault(require("../services/DB"));
class PaymentController {
    async tripayCallback(request, response) {
        let body = null;
        try {
            body = await request.json();
        }
        catch (_err) {
            return response.status(400).json({ success: false, message: "Invalid JSON" });
        }
        try {
            const status = body?.status || body?.payment_status;
            const merchantRef = body?.merchant_ref;
            const reference = body?.reference;
            if (merchantRef) {
                const ticket = await (0, DB_1.default)("tickets").where("id", merchantRef).first();
                if (ticket) {
                    await (0, DB_1.default)("tickets")
                        .where("id", merchantRef)
                        .update({
                        updated_at: Date.now(),
                    });
                }
            }
            console.log("[Tripay] Callback received", {
                status,
                merchantRef,
                reference,
            });
        }
        catch (err) {
            console.error("[Tripay] Error handling callback", err);
        }
        return response.json({ success: true });
    }
}
exports.default = new PaymentController();
//# sourceMappingURL=PaymentController.js.map