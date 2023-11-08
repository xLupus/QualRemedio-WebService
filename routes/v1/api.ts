import { Router } from "express";
//import { passportJWT } from "../../app/http/middleware/passport";
import AuthController from "../../app/http/controllers/v1/AuthController";

const router: Router = Router();
const apiContext: string = "api/v1";

//Auth
router.post(`/${apiContext}/auth/register`, AuthController.register);

//router.all("*", passportJWT);

export { router as routerApiV1, apiContext }