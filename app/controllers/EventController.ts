import DB from "../services/DB";
import { Request, Response } from "../../type";
import { randomUUID } from "crypto";

class EventController {
  public async index(request: Request, response: Response) {
    const user = request.user;

    if (!user || (user.role !== "super_admin" && user.role !== "organizer")) {
      return response.status(403).json({ error: "Unauthorized" });
    }

    const status = (request.query.status as string) || "all";

    let query = DB.from("events");

    if (user.role === "organizer") {
      query = query.where("organizer_id", user.id);
    }

    if (status && status !== "all") {
      query = query.where("status", status);
    }

    const events = await query.orderBy("start_at", "asc");

    return response.inertia("events/index", { events, status });
  }

  public async create(request: Request, response: Response) {
    const user = request.user;

    if (!user || (user.role !== "super_admin" && user.role !== "organizer")) {
      return response.status(403).json({ error: "Unauthorized" });
    }

    return response.inertia("events/create");
  }

  public async store(request: Request, response: Response) {
    const user = request.user;

    if (!user || (user.role !== "super_admin" && user.role !== "organizer")) {
      return response.status(403).json({ error: "Unauthorized" });
    }

    const body = await request.json();

    const start_at = Number(body.start_at);
    const end_at = Number(body.end_at);

    if (!start_at || !end_at || start_at > end_at) {
      return response.status(422).json({ error: "Invalid event date range" });
    }

    // Idempotency guard: if an event with the same organizer, name, and time range
    // already exists, don't create a duplicate. This protects against accidental
    // double submissions.
    const existing = await DB("events")
      .where("organizer_id", user.id)
      .where("name", body.name)
      .where("start_at", start_at)
      .where("end_at", end_at)
      .first();

    if (existing) {
      return response.redirect("/events");
    }

    const now = Date.now();

    await DB("events").insert({
      id: randomUUID(),
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
    });

    return response.redirect("/events");
  }

  public async edit(request: Request, response: Response) {
    const user = request.user;

    if (!user || (user.role !== "super_admin" && user.role !== "organizer")) {
      return response.status(403).json({ error: "Unauthorized" });
    }

    const id = request.params.id as string;

    const event = await DB("events").where("id", id).first();

    if (!event) {
      return response.status(404).json({ error: "Event not found" });
    }

    if (user.role === "organizer" && event.organizer_id !== user.id) {
      return response.status(403).json({ error: "Unauthorized" });
    }

    return response.inertia("events/edit", { event });
  }

  public async update(request: Request, response: Response) {
    const user = request.user;

    if (!user || (user.role !== "super_admin" && user.role !== "organizer")) {
      return response.status(403).json({ error: "Unauthorized" });
    }

    const id = request.params.id as string;

    const event = await DB("events").where("id", id).first();

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

    await DB("events")
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

  public async changeStatus(request: Request, response: Response) {
    const user = request.user;

    if (!user || (user.role !== "super_admin" && user.role !== "organizer")) {
      return response.status(403).json({ error: "Unauthorized" });
    }

    const id = request.params.id as string;

    const event = await DB("events").where("id", id).first();

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
    const nextStatus = body.status as string;

    const allowed = ["draft", "published", "closed"];

    if (!allowed.includes(nextStatus)) {
      return response.status(422).json({ error: "Invalid status" });
    }

    await DB("events")
      .where("id", id)
      .update({ status: nextStatus, updated_at: Date.now() });

    return response.redirect("/events");
  }

  public async destroy(request: Request, response: Response) {
    const user = request.user;

    if (!user || (user.role !== "super_admin" && user.role !== "organizer")) {
      return response.status(403).json({ error: "Unauthorized" });
    }

    const id = request.params.id as string;

    const event = await DB("events").where("id", id).first();

    if (!event) {
      return response.status(404).json({ error: "Event not found" });
    }

    if (user.role === "organizer" && event.organizer_id !== user.id) {
      return response.status(403).json({ error: "Unauthorized" });
    }

    await DB("events").where("id", id).delete();

    // When called via Inertia (XHR with X-Inertia header), return 204 so
    // the frontend can update the list and show a toast without a full reload.
    if ((request as any).header && request.header("X-Inertia")) {
      return response.status(204).send();
    }

    return response.redirect("/events");
  }

  public async report(request: Request, response: Response) {
    const user = request.user;

    if (!user || (user.role !== "super_admin" && user.role !== "organizer")) {
      return response.status(403).json({ error: "Unauthorized" });
    }

    const id = request.params.id as string;

    const event = await DB("events").where("id", id).first();

    if (!event) {
      return response.status(404).json({ error: "Event not found" });
    }

    if (user.role === "organizer" && event.organizer_id !== user.id) {
      return response.status(403).json({ error: "Unauthorized" });
    }

    const totalTicketsRow = await DB("tickets")
      .where("event_id", id)
      .count<{ count: number }>("id as count")
      .first();

    const totalCheckedRow = await DB("tickets")
      .where({ event_id: id, status: "checked_in" })
      .count<{ count: number }>("id as count")
      .first();

    const totalTickets = Number(totalTicketsRow?.count || 0);
    const totalChecked = Number(totalCheckedRow?.count || 0);
    const attendancePercent = totalTickets > 0 ? (totalChecked / totalTickets) * 100 : 0;

    const present = await DB("participants")
      .join("tickets", "participants.id", "tickets.participant_id")
      .where("tickets.event_id", id)
      .where("tickets.status", "checked_in")
      .select(
        "participants.id",
        "participants.name",
        "participants.email",
        "participants.phone",
        "tickets.status as ticket_status",
        "tickets.token as ticket_token"
      );

    const absent = await DB("participants")
      .join("tickets", "participants.id", "tickets.participant_id")
      .where("tickets.event_id", id)
      .whereNot("tickets.status", "checked_in")
      .select(
        "participants.id",
        "participants.name",
        "participants.email",
        "participants.phone",
        "tickets.status as ticket_status",
        "tickets.token as ticket_token"
      );

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

export default new EventController();
