import { Response, Request } from "../../type"; 

class Controller {
    
    public async index (request : Request,response : Response) { 
        return response.inertia("home");
    }
}

export default new Controller()
