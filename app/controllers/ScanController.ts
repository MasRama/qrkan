import DB from "../services/DB";
import { Request, Response } from "../../type";

class ScanController {
  public async page(request: Request, response: Response) {
    const eventId = request.params.eventId as string;

    const event = await DB("events").where("id", eventId).first();

    if (!event) {
      return response.status(404).send("Event not found");
    }

    return response.inertia("scan/index", { event });
  }
}

export default new ScanController();
