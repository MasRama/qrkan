import DB from "../services/DB";
import { Request, Response } from "../../type";
import { randomUUID } from "crypto";
import { uuidv7 } from "uuidv7";
import QRCodeService from "../services/QRCode";

class ParticipantController {
  private async ensureEventAccess(eventId: string, request: Request, response: Response) {
    const user = request.user;

    if (!user || (user.role !== "super_admin" && user.role !== "organizer")) {
      response.status(403).json({ error: "Unauthorized" });
      return null;
    }

    const event = await DB("events").where("id", eventId).first();

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

  public async index(request: Request, response: Response) {
    const eventId = request.params.eventId as string;

    const event = await this.ensureEventAccess(eventId, request, response);
    if (!event) return;

    const participants = await DB("participants")
      .where("event_id", eventId)
      .orderBy("created_at", "asc");

    const tickets = await DB("tickets").where("event_id", eventId);

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

  public async create(request: Request, response: Response) {
    const eventId = request.params.eventId as string;

    const event = await this.ensureEventAccess(eventId, request, response);
    if (!event) return;

    return response.inertia("participants/create", { event });
  }

  public async store(request: Request, response: Response) {
    const eventId = request.params.eventId as string;

    const event = await this.ensureEventAccess(eventId, request, response);
    if (!event) return;

    const body = await request.json();
    const { name, email, phone } = body;

    if (!name || (!email && !phone)) {
      return response.status(422).json({ error: "Name and at least one contact (email/phone) are required" });
    }

    const now = Date.now();
    const participantId = randomUUID();

    await DB("participants").insert({
      id: participantId,
      event_id: eventId,
      name,
      email: email || null,
      phone: phone || null,
      created_at: now,
      updated_at: now,
    });

    const ticketId = randomUUID();
    const token = uuidv7();

    await DB("tickets").insert({
      id: ticketId,
      event_id: eventId,
      participant_id: participantId,
      token,
      status: "pending",
      created_at: now,
      updated_at: now,
    });

    await QRCodeService.generateForToken(token);

    return response.redirect(`/events/${eventId}/participants`);
  }
}

export default new ParticipantController();
