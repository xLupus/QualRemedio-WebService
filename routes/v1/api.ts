import { Router } from "express";
//import { passportJWT } from "../../app/http/middleware/passport";

import AuthController from "../../app/http/controllers/v1/AuthController";
import { passportJWT } from "../../app/http/middleware/passport";
import UserController from "../../app/http/controllers/v1/UserController";

const router: Router = Router();
const apiContext: string = "api/v1";

//router.all("*", passportJWT);
//Auth
router.post(
  '/auth/login',
  AuthController.login
)

router.delete(
  '/auth/logout',
  AuthController.logout
)

//User
router.get(
  '/users',
  UserController.index
)

router.get(
  '/users/:user_id',
  UserController.show
)

router.patch(
  '/users/:user_id/password',
  UserController.change_password
)

router.delete(
  '/users/:user_id',
  UserController.destroy
)


export { router as routerApi_V1, apiContext }