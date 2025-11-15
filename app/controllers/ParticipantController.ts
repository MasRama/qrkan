import DB from "../services/DB";
import { Request, Response } from "../../type";
import { randomUUID } from "crypto";
import { uuidv7 } from "uuidv7";
import QRCodeService from "../services/QRCode";

async function ensureEventAccess(eventId: string, request: Request, response: Response) {
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

class ParticipantController {
  public async index(request: Request, response: Response) {
    const eventId = request.params.eventId as string;

    const event = await ensureEventAccess(eventId, request, response);
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

    const event = await ensureEventAccess(eventId, request, response);
    if (!event) return;

    return response.inertia("participants/create", { event });
  }

  public async store(request: Request, response: Response) {
    const eventId = request.params.eventId as string;

    const event = await ensureEventAccess(eventId, request, response);
    if (!event) return;

    const body = await request.json();
    const rawName = body.name as string | undefined;
    const rawEmail = body.email as string | undefined;
    const rawPhone = body.phone as string | undefined;

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
    const participantId = randomUUID();

    // Strategy:
    // - If phone is present, rely on DB-level UNIQUE(event_id, phone) and
    //   use onConflict().ignore() to get idempotent behavior even under
    //   concurrent requests.
    // - If phone is empty but email exists, fall back to an application-level
    //   dedup based on (event_id, email).

    if (phone) {
      await DB("participants")
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
    } else {
      // Email-only dedup (no phone) – check before inserting
      const existingByEmail = email
        ? await DB("participants")
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

      await DB("participants").insert({
        id: participantId,
        event_id: eventId,
        name,
        email: email || null,
        phone: null,
        created_at: now,
        updated_at: now,
      });
    }

    // Resolve the participant row we should use going forward. Because of the
    // UNIQUE(event_id, phone) constraint, at most one row will match (event, phone).
    const participant = await DB("participants")
      .where("event_id", eventId)
      .andWhere((qb) => {
        if (phone) {
          qb.andWhere("phone", phone);
        } else if (email) {
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

    // Prevent duplicate tickets for the same (event, participant).
    const existingTicket = await DB("tickets")
      .where({ event_id: eventId, participant_id: participant.id })
      .first();

    if (!existingTicket) {
      const ticketId = randomUUID();
      const token = uuidv7();

      await DB("tickets").insert({
        id: ticketId,
        event_id: eventId,
        participant_id: participant.id,
        token,
        status: "pending",
        created_at: now,
        updated_at: now,
      });

      await QRCodeService.generateForToken(token);

      console.log("[ParticipantController.store] inserted participant & ticket", {
        eventId,
        participantId: participant.id,
        ticketId,
      });
    } else {
      console.log("[ParticipantController.store] existing ticket found, not creating new one", {
        eventId,
        participantId: participant.id,
        ticketId: existingTicket.id,
      });
    }

    return response.redirect(`/events/${eventId}/participants`);
  }

  public async destroy(request: Request, response: Response) {
    const eventId = request.params.eventId as string;
    const participantId = request.params.participantId as string;

    const event = await ensureEventAccess(eventId, request, response);
    if (!event) return;

    const participant = await DB("participants")
      .where({ id: participantId, event_id: eventId })
      .first();

    if (!participant) {
      return response.status(404).json({ error: "Participant not found" });
    }

    const tickets = await DB("tickets")
      .where({ event_id: eventId, participant_id: participantId });

    const ticketIds = tickets.map((t) => t.id);

    if (ticketIds.length > 0) {
      await DB("checkin_logs").whereIn("ticket_id", ticketIds).delete();
      await DB("tickets").whereIn("id", ticketIds).delete();
    }

    await DB("participants").where({ id: participantId }).delete();

    if ((request as any).header && request.header("X-Inertia")) {
      return response.status(204).send();
    }

    return response.redirect(`/events/${eventId}/participants`);
  }
}

export default new ParticipantController();
