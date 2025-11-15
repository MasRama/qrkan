"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DB_1 = __importDefault(require("../services/DB"));
const QRCode_1 = __importDefault(require("../services/QRCode"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const crypto_1 = require("crypto");
const SCAN_WINDOW_MS = 5000;
const SCAN_MAX_REQUESTS = 15;
const scanBuckets = new Map();
class TicketController {
    async download(request, response) {
        const token = request.params.token;
        const ticket = await (0, DB_1.default)("tickets").where("token", token).first();
        if (!ticket) {
            return response.status(404).send("Ticket not found");
        }
        const fileName = `${token}.png`;
        const filePath = path_1.default.join(process.cwd(), "public", "tickets", fileName);
        if (!fs_1.default.existsSync(filePath)) {
            await QRCode_1.default.generateForToken(token);
        }
        return response.download(filePath);
    }
    async verify(request, response) {
        const nowTs = Date.now();
        const ip = (request.ip || request.headers["x-forwarded-for"] || "unknown");
        const bucket = scanBuckets.get(ip) || { count: 0, resetAt: nowTs + SCAN_WINDOW_MS };
        if (nowTs > bucket.resetAt) {
            bucket.count = 0;
            bucket.resetAt = nowTs + SCAN_WINDOW_MS;
        }
        if (bucket.count >= SCAN_MAX_REQUESTS) {
            scanBuckets.set(ip, bucket);
            return response
                .status(429)
                .json({ status: "rate_limited", message: "Terlalu banyak percobaan scan, coba lagi beberapa detik lagi." });
        }
        bucket.count++;
        scanBuckets.set(ip, bucket);
        const body = await request.json();
        const token = body.token;
        const gate_name = body.gate_name;
        const gate_id = body.gate_id;
        if (!token) {
            return response.status(400).json({ status: "invalid_request", message: "Token is required" });
        }
        const ticket = await (0, DB_1.default)("tickets").where("token", token).first();
        if (!ticket) {
            return response.status(404).json({ status: "not_found", message: "Ticket not found" });
        }
        const event = await (0, DB_1.default)("events").where("id", ticket.event_id).first();
        if (!event) {
            return response.status(404).json({ status: "event_not_found", message: "Event not found" });
        }
        if (event.status === "closed") {
            return response.status(400).json({ status: "event_closed", message: "Event is closed" });
        }
        if (ticket.status === "checked_in") {
            const lastLog = await (0, DB_1.default)("checkin_logs")
                .where("ticket_id", ticket.id)
                .orderBy("checkin_at", "desc")
                .first();
            return response.status(409).json({
                status: "already_checked_in",
                message: "Ticket has already been checked in",
                checkin_at: lastLog?.checkin_at || null,
            });
        }
        const participant = await (0, DB_1.default)("participants")
            .where("id", ticket.participant_id)
            .first();
        const now = Date.now();
        const updated = await (0, DB_1.default)("tickets")
            .where({ id: ticket.id, status: "pending" })
            .update({ status: "checked_in", updated_at: now });
        if (updated === 0) {
            const lastLog = await (0, DB_1.default)("checkin_logs")
                .where("ticket_id", ticket.id)
                .orderBy("checkin_at", "desc")
                .first();
            return response.status(409).json({
                status: "already_checked_in",
                message: "Ticket has already been checked in",
                checkin_at: lastLog?.checkin_at || null,
            });
        }
        await (0, DB_1.default)("checkin_logs").insert({
            id: (0, crypto_1.randomUUID)(),
            ticket_id: ticket.id,
            gate_name: gate_name || "default",
            gate_id: gate_id || null,
            operator_id: request.user.id,
            checkin_at: now,
        });
        return response.json({
            status: "ok",
            event: {
                id: event.id,
                name: event.name,
                location: event.location,
                start_at: event.start_at,
                end_at: event.end_at,
            },
            participant: participant
                ? {
                    id: participant.id,
                    name: participant.name,
                    email: participant.email,
                    phone: participant.phone,
                }
                : null,
            checkin_at: now,
        });
    }
}
exports.default = new TicketController();
//# sourceMappingURL=TicketController.js.map