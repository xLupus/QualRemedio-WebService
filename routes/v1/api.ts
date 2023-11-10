import { Router } from "express";
//import { passportJWT } from "../../app/http/middleware/passport";

import AuthController from "../../app/http/controllers/v1/AuthController";
import { passportJWT } from "../../app/http/middleware/passport";
import UserController from "../../app/http/controllers/v1/UserController";

const router: Router = Router();
const apiContext: string = "api/v1";

//router.all("*", passportJWT);
//Auth
router.post('/auth/login', AuthController.login)
  .delete('/auth/logout', AuthController.logout)

//User
router.get('/users', UserController.index)
  .get('/users/:user_id', UserController.show)


export { router as routerApi_V1, apiContext }