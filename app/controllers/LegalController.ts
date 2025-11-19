import { Request, Response } from "../../type";

class LegalController {
  public async privacy(request: Request, response: Response) {
    return response.inertia("privacy-policy");
  }

  public async terms(request: Request, response: Response) {
    return response.inertia("terms-of-service");
  }
}

export default new LegalController();
