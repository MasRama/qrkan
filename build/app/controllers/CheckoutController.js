"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DB_1 = __importDefault(require("../services/DB"));
const crypto_1 = require("crypto");
const uuidv7_1 = require("uuidv7");
const QRCode_1 = __importDefault(require("../services/QRCode"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class CheckoutController {
    async form(request, response) {
        const eventId = request.params.id;
        const event = await (0, DB_1.default)("events").where("id", eventId).first();
        if (!event) {
            return response.status(404).send("Event not found");
        }
        const seats = await (0, DB_1.default)("seats")
            .where("event_id", eventId)
            .orderBy("price", "asc");
        return response.inertia("events/checkout", { event, seats });
    }
    async submit(request, response) {
        const eventId = request.params.id;
        const event = await (0, DB_1.default)("events").where("id", eventId).first();
        if (!event) {
            return response.status(404).send("Event not found");
        }
        const body = await request.json();
        const rawName = body.name;
        const rawEmail = body.email;
        const rawPhone = body.phone;
        const rawSeatId = body.seat_id;
        const name = rawName ? rawName.trim() : "";
        const email = rawEmail ? rawEmail.trim().toLowerCase() : "";
        const phone = rawPhone ? rawPhone.trim() : "";
        const seatId = rawSeatId ? rawSeatId.trim() : "";
        if (!name || (!email && !phone) || !seatId) {
            return response
                .status(422)
                .json({ error: "Name, seat, and at least one contact (email/phone) are required" });
        }
        const seat = await (0, DB_1.default)("seats")
            .where({ id: seatId, event_id: eventId })
            .first();
        if (!seat) {
            return response.status(422).json({ error: "Invalid seat" });
        }
        const now = Date.now();
        const participantId = (0, crypto_1.randomUUID)();
        if (phone) {
            await (0, DB_1.default)("participants")
                .insert({
                id: participantId,
                event_id: eventId,
                name,
                email: email || null,
                phone,
                seat_id: seatId,
                created_at: now,
                updated_at: now,
            })
                .onConflict(["event_id", "phone"])
                .ignore();
        }
        else {
            const existingByEmail = email
                ? await (0, DB_1.default)("participants")
                    .where({ event_id: eventId, email })
                    .first()
                : null;
            if (existingByEmail) {
                return response.redirect(`/events/${eventId}/checkout`);
            }
            await (0, DB_1.default)("participants").insert({
                id: participantId,
                event_id: eventId,
                name,
                email: email || null,
                phone: null,
                seat_id: seatId,
                created_at: now,
                updated_at: now,
            });
        }
        const participant = await (0, DB_1.default)("participants")
            .where("event_id", eventId)
            .andWhere((qb) => {
            if (phone) {
                qb.andWhere("phone", phone);
            }
            else if (email) {
                qb.andWhere("email", email);
            }
        })
            .first();
        if (!participant) {
            return response.redirect(`/events/${eventId}/checkout`);
        }
        let ticket = await (0, DB_1.default)("tickets")
            .where({ event_id: eventId, participant_id: participant.id })
            .first();
        if (!ticket) {
            const ticketId = (0, crypto_1.randomUUID)();
            const token = (0, uuidv7_1.uuidv7)();
            await (0, DB_1.default)("tickets").insert({
                id: ticketId,
                event_id: eventId,
                participant_id: participant.id,
                token,
                status: "pending",
                created_at: now,
                updated_at: now,
            });
            await QRCode_1.default.generateForToken(token);
            ticket = await (0, DB_1.default)("tickets").where({ id: ticketId }).first();
        }
        if (!ticket) {
            return response.redirect(`/events/${eventId}/checkout`);
        }
        return response.redirect(`/checkout/${ticket.token}/success`);
    }
    async success(request, response) {
        const token = request.params.token;
        const ticket = await (0, DB_1.default)("tickets").where("token", token).first();
        if (!ticket) {
            return response.status(404).send("Ticket not found");
        }
        const event = await (0, DB_1.default)("events").where("id", ticket.event_id).first();
        const participant = await (0, DB_1.default)("participants").where("id", ticket.participant_id).first();
        let seat = null;
        if (participant && participant.seat_id) {
            seat = await (0, DB_1.default)("seats").where("id", participant.seat_id).first();
        }
        const fileName = `${token}.png`;
        const filePath = path_1.default.join(process.cwd(), "public", "tickets", fileName);
        if (!fs_1.default.existsSync(filePath)) {
            await QRCode_1.default.generateForToken(token);
        }
        const qr_image_url = `/public/tickets/${fileName}`;
        const qr_download_url = `/tickets/${token}`;
        return response.inertia("events/checkout_success", {
            event,
            participant,
            ticket,
            seat,
            qr_image_url,
            qr_download_url,
        });
    }
}
exports.default = new CheckoutController();
//# sourceMappingURL=CheckoutController.js.map