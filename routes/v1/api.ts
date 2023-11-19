import { Router } from "express";
import { passportJWT } from "../../app/http/middleware/passport";
import AuthController from "../../app/http/controllers/v1/AuthController";
import UserController from "../../app/http/controllers/v1/UserController";
import ConsultationController from "../../app/http/controllers/v1/ConsultationController";

const router: Router = Router();
const apiContext: string = "api/v1";

router.post(
  '/auth/login',
  AuthController.login
)

router.delete(
  '/auth/logout',
  AuthController.logout
)

router.all(
  "*",
  passportJWT
);

//Auth
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


//Consultation
router.post(
  '/bond/:bond_id/consultations',
  ConsultationController.store
)

router.get(
  '/bond/:bond_id/consultations',
  ConsultationController.index
)

router.get(
  '/consultations',
  ConsultationController.index
)

router.get(
  '/consultations/:consultation_id',
  ConsultationController.show
)

router.patch(
  '/consultations/:consultation_id',
  ConsultationController.update
)

router.get(
  '/consultations/:consultation_id/prescriptions',
  ConsultationController.prescriptions
)

router.delete(
  '/consultations/:consultation_id',
  ConsultationController.destroy
)

export { router as routerApiV1, apiContext }