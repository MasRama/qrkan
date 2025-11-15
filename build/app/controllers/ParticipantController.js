"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DB_1 = __importDefault(require("../services/DB"));
const crypto_1 = require("crypto");
const uuidv7_1 = require("uuidv7");
const QRCode_1 = __importDefault(require("../services/QRCode"));
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
class ParticipantController {
    async index(request, response) {
        const eventId = request.params.eventId;
        const event = await ensureEventAccess(eventId, request, response);
        if (!event)
            return;
        const participants = await (0, DB_1.default)("participants")
            .where("event_id", eventId)
            .orderBy("created_at", "asc");
        const tickets = await (0, DB_1.default)("tickets").where("event_id", eventId);
        const participantsWithTicket = participants.map((p) => {
            const ticket = tickets.find((t) => t.participant_id === p.id);
            return {
                ...p,
                ticket_status: ticket?.status || null,
                ticket_token: ticket?.token || null,
            };
        });
        return response.inertia("participants/index", {
            event,
            participants: participantsWithTicket,
        });
    }
    async create(request, response) {
        const eventId = request.params.eventId;
        const event = await ensureEventAccess(eventId, request, response);
        if (!event)
            return;
        return response.inertia("participants/create", { event });
    }
    async store(request, response) {
        const eventId = request.params.eventId;
        const event = await ensureEventAccess(eventId, request, response);
        if (!event)
            return;
        const body = await request.json();
        const rawName = body.name;
        const rawEmail = body.email;
        const rawPhone = body.phone;
        const name = rawName ? rawName.trim() : "";
        const email = rawEmail ? rawEmail.trim().toLowerCase() : "";
        const phone = rawPhone ? rawPhone.trim() : "";
        console.log("[ParticipantController.store] incoming", {
            eventId,
            name,
            email,
            phone,
        });
        if (!name || (!email && !phone)) {
            return response.status(422).json({ error: "Name and at least one contact (email/phone) are required" });
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
                console.log("[ParticipantController.store] duplicate (email-only) detected, skipping insert", {
                    eventId,
                    existingId: existingByEmail.id,
                });
                return response.redirect(`/events/${eventId}/participants`);
            }
            await (0, DB_1.default)("participants").insert({
                id: participantId,
                event_id: eventId,
                name,
                email: email || null,
                phone: null,
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
            console.log("[ParticipantController.store] no participant found after insert/ignore", {
                eventId,
                name,
                email,
                phone,
            });
            return response.redirect(`/events/${eventId}/participants`);
        }
        const existingTicket = await (0, DB_1.default)("tickets")
            .where({ event_id: eventId, participant_id: participant.id })
            .first();
        if (!existingTicket) {
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
            console.log("[ParticipantController.store] inserted participant & ticket", {
                eventId,
                participantId: participant.id,
                ticketId,
            });
        }
        else {
            console.log("[ParticipantController.store] existing ticket found, not creating new one", {
                eventId,
                participantId: participant.id,
                ticketId: existingTicket.id,
            });
        }
        return response.redirect(`/events/${eventId}/participants`);
    }
    async destroy(request, response) {
        const eventId = request.params.eventId;
        const participantId = request.params.participantId;
        const event = await ensureEventAccess(eventId, request, response);
        if (!event)
            return;
        const participant = await (0, DB_1.default)("participants")
            .where({ id: participantId, event_id: eventId })
            .first();
        if (!participant) {
            return response.status(404).json({ error: "Participant not found" });
        }
        const tickets = await (0, DB_1.default)("tickets")
            .where({ event_id: eventId, participant_id: participantId });
        const ticketIds = tickets.map((t) => t.id);
        if (ticketIds.length > 0) {
            await (0, DB_1.default)("checkin_logs").whereIn("ticket_id", ticketIds).delete();
            await (0, DB_1.default)("tickets").whereIn("id", ticketIds).delete();
        }
        await (0, DB_1.default)("participants").where({ id: participantId }).delete();
        if (request.header && request.header("X-Inertia")) {
            return response.status(204).send();
        }
        return response.redirect(`/events/${eventId}/participants`);
    }
}
exports.default = new ParticipantController();
//# sourceMappingURL=ParticipantController.js.map