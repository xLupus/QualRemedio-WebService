import { Router } from "express"
import { passportJWT } from "../../app/http/middlewares/passport";

const router = Router();
const api_context = "api/v1";

router.all("*", passportJWT);


export { router as router_api_v1 }
export { api_context };