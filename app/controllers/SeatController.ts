import DB from "../services/DB";
import { Request, Response } from "../../type";
import { randomUUID } from "crypto";

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

class SeatController {
  public async index(request: Request, response: Response) {
    const eventId = request.params.eventId as string;

    const event = await ensureEventAccess(eventId, request, response);
    if (!event) return;

    const seats = await DB("seats")
      .where("event_id", eventId)
      .orderBy("price", "asc");

    return response.inertia("seats/index", { event, seats });
  }

  public async create(request: Request, response: Response) {
    const eventId = request.params.eventId as string;

    const event = await ensureEventAccess(eventId, request, response);
    if (!event) return;

    return response.inertia("seats/create", { event });
  }

  public async store(request: Request, response: Response) {
    const eventId = request.params.eventId as string;

    const event = await ensureEventAccess(eventId, request, response);
    if (!event) return;

    const body = await request.json();
    const rawName = body.name as string | undefined;
    const rawPrice = body.price as number | string | undefined;

    const name = rawName ? rawName.trim() : "";
    const priceNumber = typeof rawPrice === "string" ? Number(rawPrice) : rawPrice;
    const price = typeof priceNumber === "number" ? priceNumber : NaN;

    if (!name || Number.isNaN(price) || price < 0) {
      return response.status(422).json({ error: "Invalid seat data" });
    }

    const now = Date.now();
    const seatId = randomUUID();

    try {
      await DB("seats")
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
    } catch (error) {
      console.error("[SeatController.store] insert error", error);
    }

    return response.redirect(`/events/${eventId}/seats`);
  }

  public async edit(request: Request, response: Response) {
    const eventId = request.params.eventId as string;
    const seatId = request.params.seatId as string;

    const event = await ensureEventAccess(eventId, request, response);
    if (!event) return;

    const seat = await DB("seats")
      .where({ id: seatId, event_id: eventId })
      .first();

    if (!seat) {
      return response.status(404).json({ error: "Seat not found" });
    }

    return response.inertia("seats/edit", { event, seat });
  }

  public async update(request: Request, response: Response) {
    const eventId = request.params.eventId as string;
    const seatId = request.params.seatId as string;

    const event = await ensureEventAccess(eventId, request, response);
    if (!event) return;

    const body = await request.json();
    const rawName = body.name as string | undefined;
    const rawPrice = body.price as number | string | undefined;

    const name = rawName ? rawName.trim() : "";
    const priceNumber = typeof rawPrice === "string" ? Number(rawPrice) : rawPrice;
    const price = typeof priceNumber === "number" ? priceNumber : NaN;

    if (!name || Number.isNaN(price) || price < 0) {
      return response.status(422).json({ error: "Invalid seat data" });
    }

    const now = Date.now();

    try {
      await DB("seats")
        .where({ id: seatId, event_id: eventId })
        .update({
          name,
          price,
          updated_at: now,
        });
    } catch (error: any) {
      const code = error?.code as string | undefined;
      if ((code && code.startsWith("SQLITE_CONSTRAINT")) || code === "23505") {
        return response.status(422).json({ error: "Seat with the same name already exists for this event" });
      }

      console.error("[SeatController.update] update error", error);
      throw error;
    }

    return response.redirect(`/events/${eventId}/seats`);
  }

  public async destroy(request: Request, response: Response) {
    const eventId = request.params.eventId as string;
    const seatId = request.params.seatId as string;

    const event = await ensureEventAccess(eventId, request, response);
    if (!event) return;

    const seat = await DB("seats")
      .where({ id: seatId, event_id: eventId })
      .first();

    if (!seat) {
      return response.status(404).json({ error: "Seat not found" });
    }

    await DB("seats").where({ id: seatId }).delete();

    if ((request as any).header && request.header("X-Inertia")) {
      return response.status(204).send();
    }

    return response.redirect(`/events/${eventId}/seats`);
  }
}

export default new SeatController();
