import DB from "../services/DB";
import { Request, Response } from "../../type";
import QRCodeService from "../services/QRCode";
import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";

const SCAN_WINDOW_MS = 5000;
const SCAN_MAX_REQUESTS = 15;
const scanBuckets = new Map<string, { count: number; resetAt: number }>();

class TicketController {
  public async download(request: Request, response: Response) {
    const token = request.params.token as string;

    const ticket = await DB("tickets").where("token", token).first();

    if (!ticket) {
      return response.status(404).send("Ticket not found");
    }

    const fileName = `${token}.png`;
    const filePath = path.join(process.cwd(), "public", "tickets", fileName);

    if (!fs.existsSync(filePath)) {
      await QRCodeService.generateForToken(token);
    }

    return response.download(filePath);
  }

  public async verify(request: Request, response: Response) {
    const nowTs = Date.now();
    const ip = ((request as any).ip || request.headers["x-forwarded-for"] || "unknown") as string;
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
    const token = body.token as string;
    const gate_name = body.gate_name as string | undefined;
    const gate_id = body.gate_id as string | undefined;

    if (!token) {
      return response.status(400).json({ status: "invalid_request", message: "Token is required" });
    }

    // Find ticket with related event & participant
    const ticket = await DB("tickets").where("token", token).first();

    if (!ticket) {
      return response.status(404).json({ status: "not_found", message: "Ticket not found" });
    }

    const event = await DB("events").where("id", ticket.event_id).first();

    if (!event) {
      return response.status(404).json({ status: "event_not_found", message: "Event not found" });
    }

    if (event.status === "closed") {
      return response.status(400).json({ status: "event_closed", message: "Event is closed" });
    }

    // If already checked-in, return info & last checkin
    if (ticket.status === "checked_in") {
      const lastLog = await DB("checkin_logs")
        .where("ticket_id", ticket.id)
        .orderBy("checkin_at", "desc")
        .first();

      return response.status(409).json({
        status: "already_checked_in",
        message: "Ticket has already been checked in",
        checkin_at: lastLog?.checkin_at || null,
      });
    }

    const participant = await DB("participants")
      .where("id", ticket.participant_id)
      .first();

    const now = Date.now();

    // Atomic update: only update if still not checked_in
    const updated = await DB("tickets")
      .where({ id: ticket.id, status: "pending" })
      .update({ status: "checked_in", updated_at: now });

    // If no rows updated, someone else already checked in concurrently
    if (updated === 0) {
      const lastLog = await DB("checkin_logs")
        .where("ticket_id", ticket.id)
        .orderBy("checkin_at", "desc")
        .first();

      return response.status(409).json({
        status: "already_checked_in",
        message: "Ticket has already been checked in",
        checkin_at: lastLog?.checkin_at || null,
      });
    }

    // Insert check-in log
    await DB("checkin_logs").insert({
      id: randomUUID(),
      ticket_id: ticket.id,
      gate_name: gate_name || null,
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

export default new TicketController();
