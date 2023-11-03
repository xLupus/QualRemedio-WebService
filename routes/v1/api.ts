import { Router } from "express";
//import { passportJWT } from "../../app/http/middleware/passport";
import ExampleController from "../../app/http/controllers/v1/ExampleController";
import AuthController from "../../app/http/controllers/v1/AuthController";

const router: Router = Router();
const apiContext: string = "api/v1";

//router.all("*", passportJWT);
router.get(`/test`, ExampleController.index);
router.post('/auth/user', AuthController.login)

export { router as routerApi_V1, apiContext }