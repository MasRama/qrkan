"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DB_1 = __importDefault(require("../services/DB"));
const crypto_1 = require("crypto");
class EventController {
    async index(request, response) {
        const user = request.user;
        if (!user || (user.role !== "super_admin" && user.role !== "organizer")) {
            return response.status(403).json({ error: "Unauthorized" });
        }
        const status = request.query.status || "all";
        let query = DB_1.default.from("events");
        if (user.role === "organizer") {
            query = query.where("organizer_id", user.id);
        }
        if (status && status !== "all") {
            query = query.where("status", status);
        }
        const events = await query.orderBy("start_at", "asc");
        return response.inertia("events/index", { events, status });
    }
    async create(request, response) {
        const user = request.user;
        if (!user || (user.role !== "super_admin" && user.role !== "organizer")) {
            return response.status(403).json({ error: "Unauthorized" });
        }
        return response.inertia("events/create");
    }
    async store(request, response) {
        const user = request.user;
        if (!user || (user.role !== "super_admin" && user.role !== "organizer")) {
            return response.status(403).json({ error: "Unauthorized" });
        }
        const body = await request.json();
        const providedId = body.id || undefined;
        const eventId = providedId || (0, crypto_1.randomUUID)();
        const start_at = Number(body.start_at);
        const end_at = Number(body.end_at);
        if (!start_at || !end_at || start_at > end_at) {
            return response.status(422).json({ error: "Invalid event date range" });
        }
        console.log("[EventController.store] create event", {
            eventId,
            providedId,
            organizer_id: user.id,
            name: body.name,
            start_at,
            end_at,
        });
        const existingById = await (0, DB_1.default)("events").where("id", eventId).first();
        if (existingById) {
            return response.redirect("/events");
        }
        const existing = await (0, DB_1.default)("events")
            .where("organizer_id", user.id)
            .where("name", body.name)
            .where("start_at", start_at)
            .where("end_at", end_at)
            .first();
        if (existing) {
            return response.redirect("/events");
        }
        const now = Date.now();
        try {
            await (0, DB_1.default)("events")
                .insert({
                id: eventId,
                organizer_id: user.id,
                name: body.name,
                description: body.description || null,
                location: body.location || null,
                start_at,
                end_at,
                capacity: body.capacity || null,
                status: "draft",
                created_at: now,
                updated_at: now,
            })
                .onConflict("id")
                .ignore();
        }
        catch (error) {
            const code = error?.code;
            if ((code && code.startsWith("SQLITE_CONSTRAINT")) || code === "23505") {
                console.log("[EventController.store] duplicate insert ignored", { eventId, code });
                return response.redirect("/events");
            }
            console.error("[EventController.store] insert error", error);
            throw error;
        }
        return response.redirect("/events");
    }
    async edit(request, response) {
        const user = request.user;
        if (!user || (user.role !== "super_admin" && user.role !== "organizer")) {
            return response.status(403).json({ error: "Unauthorized" });
        }
        const id = request.params.id;
        const event = await (0, DB_1.default)("events").where("id", id).first();
        if (!event) {
            return response.status(404).json({ error: "Event not found" });
        }
        if (user.role === "organizer" && event.organizer_id !== user.id) {
            return response.status(403).json({ error: "Unauthorized" });
        }
        return response.inertia("events/edit", { event });
    }
    async update(request, response) {
        const user = request.user;
        if (!user || (user.role !== "super_admin" && user.role !== "organizer")) {
            return response.status(403).json({ error: "Unauthorized" });
        }
        const id = request.params.id;
        const event = await (0, DB_1.default)("events").where("id", id).first();
        if (!event) {
            return response.status(404).json({ error: "Event not found" });
        }
        if (event.status === "closed") {
            return response.status(400).json({ error: "Closed event cannot be updated" });
        }
        if (user.role === "organizer" && event.organizer_id !== user.id) {
            return response.status(403).json({ error: "Unauthorized" });
        }
        const body = await request.json();
        const start_at = Number(body.start_at);
        const end_at = Number(body.end_at);
        if (!start_at || !end_at || start_at > end_at) {
            return response.status(422).json({ error: "Invalid event date range" });
        }
        const now = Date.now();
        await (0, DB_1.default)("events")
            .where("id", id)
            .update({
            name: body.name,
            description: body.description || null,
            location: body.location || null,
            start_at,
            end_at,
            capacity: body.capacity || null,
            updated_at: now,
        });
        return response.redirect("/events");
    }
    async changeStatus(request, response) {
        const user = request.user;
        if (!user || (user.role !== "super_admin" && user.role !== "organizer")) {
            return response.status(403).json({ error: "Unauthorized" });
        }
        const id = request.params.id;
        const event = await (0, DB_1.default)("events").where("id", id).first();
        if (!event) {
            return response.status(404).json({ error: "Event not found" });
        }
        if (user.role === "organizer" && event.organizer_id !== user.id) {
            return response.status(403).json({ error: "Unauthorized" });
        }
        if (event.status === "closed") {
            return response.status(400).json({ error: "Closed event cannot change status" });
        }
        const body = await request.json();
        const nextStatus = body.status;
        const allowed = ["draft", "published", "closed"];
        if (!allowed.includes(nextStatus)) {
            return response.status(422).json({ error: "Invalid status" });
        }
        await (0, DB_1.default)("events")
            .where("id", id)
            .update({ status: nextStatus, updated_at: Date.now() });
        return response.redirect("/events");
    }
    async destroy(request, response) {
        const user = request.user;
        if (!user || (user.role !== "super_admin" && user.role !== "organizer")) {
            return response.status(403).json({ error: "Unauthorized" });
        }
        const id = request.params.id;
        const event = await (0, DB_1.default)("events").where("id", id).first();
        if (!event) {
            return response.status(404).json({ error: "Event not found" });
        }
        if (user.role === "organizer" && event.organizer_id !== user.id) {
            return response.status(403).json({ error: "Unauthorized" });
        }
        await (0, DB_1.default)("events").where("id", id).delete();
        if (request.header && request.header("X-Inertia")) {
            return response.status(204).send();
        }
        return response.redirect("/events");
    }
    async report(request, response) {
        const user = request.user;
        if (!user || (user.role !== "super_admin" && user.role !== "organizer")) {
            return response.status(403).json({ error: "Unauthorized" });
        }
        const id = request.params.id;
        const event = await (0, DB_1.default)("events").where("id", id).first();
        if (!event) {
            return response.status(404).json({ error: "Event not found" });
        }
        if (user.role === "organizer" && event.organizer_id !== user.id) {
            return response.status(403).json({ error: "Unauthorized" });
        }
        const totalTicketsRow = await (0, DB_1.default)("tickets")
            .where("event_id", id)
            .count("id as count")
            .first();
        const totalCheckedRow = await (0, DB_1.default)("tickets")
            .where({ event_id: id, status: "checked_in" })
            .count("id as count")
            .first();
        const totalTickets = Number(totalTicketsRow?.count || 0);
        const totalChecked = Number(totalCheckedRow?.count || 0);
        const attendancePercent = totalTickets > 0 ? (totalChecked / totalTickets) * 100 : 0;
        const present = await (0, DB_1.default)("participants")
            .join("tickets", "participants.id", "tickets.participant_id")
            .where("tickets.event_id", id)
            .where("tickets.status", "checked_in")
            .select("participants.id", "participants.name", "participants.email", "participants.phone", "tickets.status as ticket_status", "tickets.token as ticket_token");
        const absent = await (0, DB_1.default)("participants")
            .join("tickets", "participants.id", "tickets.participant_id")
            .where("tickets.event_id", id)
            .whereNot("tickets.status", "checked_in")
            .select("participants.id", "participants.name", "participants.email", "participants.phone", "tickets.status as ticket_status", "tickets.token as ticket_token");
        return response.inertia("events/report", {
            event,
            totalTickets,
            totalChecked,
            attendancePercent,
            present,
            absent,
        });
    }
}
exports.default = new EventController();
//# sourceMappingURL=EventController.js.map