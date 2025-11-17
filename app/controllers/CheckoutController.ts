import DB from "../services/DB";
import { Request, Response } from "../../type";
import { randomUUID } from "crypto";
import { uuidv7 } from "uuidv7";
import QRCodeService from "../services/QRCode";
import fs from "fs";
import path from "path";

class CheckoutController {
  public async form(request: Request, response: Response) {
    const eventId = request.params.id as string;

    const event = await DB("events").where("id", eventId).first();

    if (!event) {
      return response.status(404).send("Event not found");
    }

    const seats = await DB("seats")
      .where("event_id", eventId)
      .orderBy("price", "asc");

    return response.inertia("events/checkout", { event, seats });
  }

  public async submit(request: Request, response: Response) {
    const eventId = request.params.id as string;

    const event = await DB("events").where("id", eventId).first();

    if (!event) {
      return response.status(404).send("Event not found");
    }

    const body = await request.json();
    const rawName = body.name as string | undefined;
    const rawEmail = body.email as string | undefined;
    const rawPhone = body.phone as string | undefined;
    const rawSeatId = body.seat_id as string | undefined;

    const name = rawName ? rawName.trim() : "";
    const email = rawEmail ? rawEmail.trim().toLowerCase() : "";
    const phone = rawPhone ? rawPhone.trim() : "";
    const seatId = rawSeatId ? rawSeatId.trim() : "";

    if (!name || (!email && !phone) || !seatId) {
      return response
        .status(422)
        .json({ error: "Name, seat, and at least one contact (email/phone) are required" });
    }

    const seat = await DB("seats")
      .where({ id: seatId, event_id: eventId })
      .first();

    if (!seat) {
      return response.status(422).json({ error: "Invalid seat" });
    }

    const now = Date.now();
    const participantId = randomUUID();

    if (phone) {
      await DB("participants")
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
    } else {
      const existingByEmail = email
        ? await DB("participants")
            .where({ event_id: eventId, email })
            .first()
        : null;

      if (existingByEmail) {
        return response.redirect(`/events/${eventId}/checkout`);
      }

      await DB("participants").insert({
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
      return response.redirect(`/events/${eventId}/checkout`);
    }

    let ticket = await DB("tickets")
      .where({ event_id: eventId, participant_id: participant.id })
      .first();

    if (!ticket) {
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

      ticket = await DB("tickets").where({ id: ticketId }).first();
    }

    if (!ticket) {
      return response.redirect(`/events/${eventId}/checkout`);
    }

    return response.redirect(`/checkout/${ticket.token}/success`);
  }

  public async success(request: Request, response: Response) {
    const token = request.params.token as string;

    const ticket = await DB("tickets").where("token", token).first();

    if (!ticket) {
      return response.status(404).send("Ticket not found");
    }

    const event = await DB("events").where("id", ticket.event_id).first();
    const participant = await DB("participants").where("id", ticket.participant_id).first();

    let seat: any = null;
    if (participant && (participant as any).seat_id) {
      seat = await DB("seats").where("id", (participant as any).seat_id).first();
    }

    const fileName = `${token}.png`;
    const filePath = path.join(process.cwd(), "public", "tickets", fileName);

    if (!fs.existsSync(filePath)) {
      await QRCodeService.generateForToken(token);
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

export default new CheckoutController();
