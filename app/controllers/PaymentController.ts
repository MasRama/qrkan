import DB from "../services/DB";
import { Request, Response } from "../../type";

class PaymentController {
  public async tripayCallback(request: Request, response: Response) {
    let body: any = null;

    try {
      body = await request.json();
    } catch (_err) {
      return response.status(400).json({ success: false, message: "Invalid JSON" });
    }

    // NOTE: This callback handler is intentionally minimal for sandbox/testing purposes.
    // In production, you MUST validate Tripay's callback signature and update payment
    // status in the database based on the official Tripay documentation.

    try {
      const status = body?.status || body?.payment_status;
      const merchantRef = body?.merchant_ref;
      const reference = body?.reference;

      if (merchantRef) {
        // For now we only log mapping between merchant_ref and ticket for debugging.
        // In the future, you can extend this to update a dedicated payment status column.
        const ticket = await DB("tickets").where("id", merchantRef).first();
        if (ticket) {
          await DB("tickets")
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
    } catch (err) {
      console.error("[Tripay] Error handling callback", err);
    }

    return response.json({ success: true });
  }
}

export default new PaymentController();
