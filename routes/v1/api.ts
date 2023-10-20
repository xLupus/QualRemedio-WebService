import { Router } from "express";
//import { passportJWT } from "../../app/http/middleware/passport";
import ExampleController from "../../app/http/controllers/v1/ExampleController";

const router: Router = Router();
const apiContext: string = "api/v1";

//router.all("*", passportJWT);
router.get(`/${apiContext}/test`, ExampleController.index);

export { router as routerApi_V1, apiContext }