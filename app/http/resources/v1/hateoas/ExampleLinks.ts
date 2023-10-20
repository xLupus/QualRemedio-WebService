import "dotenv/config";
import { port } from "../../../../../config/server";
import { apiContext } from "../../../../../routes/v1/api";

class ExampleLinks {
    _links(): object[] {
        const HATEOAS = [];
        
        return HATEOAS
    }
}

export default new ExampleLinks();