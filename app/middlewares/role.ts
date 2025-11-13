import { Request, Response } from "../../type";

const role = (allowedRoles: string[]) => {
  return async (request: Request, response: Response) => {
    const user = request.user;

    if (!user || !user.role || !allowedRoles.includes(user.role)) {
      return response.status(403).json({ error: "Unauthorized" });
    }
  };
};

export default role;
