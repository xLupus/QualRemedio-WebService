import { Router } from "express";
//import { passportJWT } from "../../app/http/middleware/passport";

import AuthController from "../../app/http/controllers/v1/AuthController";
import { passportJWT } from "../../app/http/middleware/passport";

const router: Router = Router();
const apiContext: string = "api/v1";

//router.all("*", passportJWT);
//Auth
router.post('/auth/login', AuthController.login)
router.delete('/auth/logout', AuthController.logout)
router.post('/auth/teste',passportJWT, AuthController.teste)

export { router as routerApi_V1, apiContext }