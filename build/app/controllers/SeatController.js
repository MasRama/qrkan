"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DB_1 = __importDefault(require("../services/DB"));
const crypto_1 = require("crypto");
async function ensureEventAccess(eventId, request, response) {
    const user = request.user;
    if (!user || (user.role !== "super_admin" && user.role !== "organizer")) {
        response.status(403).json({ error: "Unauthorized" });
        return null;
    }
    const event = await (0, DB_1.default)("events").where("id", eventId).first();
    if (!event) {
        response.status(404).json({ error: "Event not found" });
        return null;
    }
    if (user.role === "organizer" && event.organizer_id !== user.id) {
        response.status(403).json({ error: "Unauthorized" });
        return null;
    }
    return event;
}
class SeatController {
    async index(request, response) {
        const eventId = request.params.eventId;
        const event = await ensureEventAccess(eventId, request, response);
        if (!event)
            return;
        const seats = await (0, DB_1.default)("seats")
            .where("event_id", eventId)
            .orderBy("price", "asc");
        return response.inertia("seats/index", { event, seats });
    }
    async create(request, response) {
        const eventId = request.params.eventId;
        const event = await ensureEventAccess(eventId, request, response);
        if (!event)
            return;
        return response.inertia("seats/create", { event });
    }
    async store(request, response) {
        const eventId = request.params.eventId;
        const event = await ensureEventAccess(eventId, request, response);
        if (!event)
            return;
        const body = await request.json();
        const rawName = body.name;
        const rawPrice = body.price;
        const name = rawName ? rawName.trim() : "";
        const priceNumber = typeof rawPrice === "string" ? Number(rawPrice) : rawPrice;
        const price = typeof priceNumber === "number" ? priceNumber : NaN;
        if (!name || Number.isNaN(price) || price < 0) {
            return response.status(422).json({ error: "Invalid seat data" });
        }
        const now = Date.now();
        const seatId = (0, crypto_1.randomUUID)();
        try {
            await (0, DB_1.default)("seats")
                .insert({
                id: seatId,
                event_id: eventId,
                name,
                price,
                created_at: now,
                updated_at: now,
            })
                .onConflict(["event_id", "name"])
                .ignore();
        }
        catch (error) {
            console.error("[SeatController.store] insert error", error);
        }
        return response.redirect(`/events/${eventId}/seats`);
    }
    async edit(request, response) {
        const eventId = request.params.eventId;
        const seatId = request.params.seatId;
        const event = await ensureEventAccess(eventId, request, response);
        if (!event)
            return;
        const seat = await (0, DB_1.default)("seats")
            .where({ id: seatId, event_id: eventId })
            .first();
        if (!seat) {
            return response.status(404).json({ error: "Seat not found" });
        }
        return response.inertia("seats/edit", { event, seat });
    }
    async update(request, response) {
        const eventId = request.params.eventId;
        const seatId = request.params.seatId;
        const event = await ensureEventAccess(eventId, request, response);
        if (!event)
            return;
        const body = await request.json();
        const rawName = body.name;
        const rawPrice = body.price;
        const name = rawName ? rawName.trim() : "";
        const priceNumber = typeof rawPrice === "string" ? Number(rawPrice) : rawPrice;
        const price = typeof priceNumber === "number" ? priceNumber : NaN;
        if (!name || Number.isNaN(price) || price < 0) {
            return response.status(422).json({ error: "Invalid seat data" });
        }
        const now = Date.now();
        try {
            await (0, DB_1.default)("seats")
                .where({ id: seatId, event_id: eventId })
                .update({
                name,
                price,
                updated_at: now,
            });
        }
        catch (error) {
            const code = error?.code;
            if ((code && code.startsWith("SQLITE_CONSTRAINT")) || code === "23505") {
                return response.status(422).json({ error: "Seat with the same name already exists for this event" });
            }
            console.error("[SeatController.update] update error", error);
            throw error;
        }
        return response.redirect(`/events/${eventId}/seats`);
    }
    async destroy(request, response) {
        const eventId = request.params.eventId;
        const seatId = request.params.seatId;
        const event = await ensureEventAccess(eventId, request, response);
        if (!event)
            return;
        const seat = await (0, DB_1.default)("seats")
            .where({ id: seatId, event_id: eventId })
            .first();
        if (!seat) {
            return response.status(404).json({ error: "Seat not found" });
        }
        await (0, DB_1.default)("seats").where({ id: seatId }).delete();
        if (request.header && request.header("X-Inertia")) {
            return response.status(204).send();
        }
        return response.redirect(`/events/${eventId}/seats`);
    }
}
exports.default = new SeatController();
//# sourceMappingURL=SeatController.js.map