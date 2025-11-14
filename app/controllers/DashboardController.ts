import DB from "../services/DB";
import { Request, Response } from "../../type";

class DashboardController {
  public async index(request: Request, response: Response) {
    const user = request.user;

    if (!user || (user.role !== "super_admin" && user.role !== "organizer")) {
      return response.status(403).json({ error: "Unauthorized" });
    }

    let eventsQuery = DB("events");

    if (user.role === "organizer") {
      eventsQuery = eventsQuery.where("organizer_id", user.id);
    }

    const now = Date.now();

    const totalEventsRow = await eventsQuery.clone().count<{ count: number }>("id as count").first();
    const draftEventsRow = await eventsQuery.clone().where("status", "draft").count<{ count: number }>("id as count").first();
    const publishedEventsRow = await eventsQuery.clone().where("status", "published").count<{ count: number }>("id as count").first();
    const closedEventsRow = await eventsQuery.clone().where("status", "closed").count<{ count: number }>("id as count").first();

    const scopedEventIdsQuery = eventsQuery.clone().select("id");

    const totalParticipantsRow = await DB("participants")
      .whereIn("event_id", scopedEventIdsQuery)
      .count<{ count: number }>("id as count")
      .first();

    const totalTicketsRow = await DB("tickets")
      .whereIn("event_id", scopedEventIdsQuery)
      .count<{ count: number }>("id as count")
      .first();

    const checkedInTicketsRow = await DB("tickets")
      .whereIn("event_id", scopedEventIdsQuery)
      .where("status", "checked_in")
      .count<{ count: number }>("id as count")
      .first();

    const totalEvents = Number(totalEventsRow?.count || 0);
    const draftEvents = Number(draftEventsRow?.count || 0);
    const publishedEvents = Number(publishedEventsRow?.count || 0);
    const closedEvents = Number(closedEventsRow?.count || 0);
    const totalParticipants = Number(totalParticipantsRow?.count || 0);
    const totalTickets = Number(totalTicketsRow?.count || 0);
    const checkedInTickets = Number(checkedInTicketsRow?.count || 0);
    const attendanceRate = totalTickets > 0 ? (checkedInTickets / totalTickets) * 100 : 0;

    const upcomingEvents = await eventsQuery
      .clone()
      .where("start_at", ">", now)
      .orderBy("start_at", "asc")
      .limit(3);

    const recentEvents = await eventsQuery
      .clone()
      .orderBy("created_at", "desc")
      .limit(5);

    return response.inertia("dashboard", {
      overview: {
        total_events: totalEvents,
        draft_events: draftEvents,
        published_events: publishedEvents,
        closed_events: closedEvents,
        total_participants: totalParticipants,
        total_tickets: totalTickets,
        checked_in_tickets: checkedInTickets,
        attendance_rate: attendanceRate,
      },
      upcoming_events: upcomingEvents,
      recent_events: recentEvents,
    });
  }
}

export default new DashboardController();
