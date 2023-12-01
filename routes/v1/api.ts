import { Router } from "express";
import { passportJWT } from "../../app/http/middleware/passport";
import AuthController from "../../app/http/controllers/v1/AuthController";
import UserController from "../../app/http/controllers/v1/UserController";
import ConsultationController from "../../app/http/controllers/v1/ConsultationController";
import BondController from "../../app/http/controllers/v1/BondController";
import ReminderController from "../../app/http/controllers/v1/ReminderController";
import NotificationController from "../../app/http/controllers/v1/NotificationController";
import MailController from "../../app/http/controllers/v1/MailController";
import PasswordController from "../../app/http/controllers/v1/PasswordController";

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

//Email
router.post('/users/email/send', MailController.send);
router.post('/users/email/resend', MailController.resend);
router.get('/users/email/verify/:emailToken', MailController.verify);

//Recover password
router.post('/users/password/reset', PasswordController.reset);

//Auth
router.post('/auth/register', AuthController.register);
router.post('/auth/login', AuthController.login)

router.all("*", passportJWT);

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

/*
router.get(
  '/bond/:bond_id/consultations',
  ConsultationController.index
)
*/

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

//Bond
router.route('/user/bond')
    .get(BondController.index)
    .post(BondController.store)

router.route('/user/bond/:id')
    .get(BondController.show)
    .patch(BondController.update)
    .delete(BondController.destroy);

//Reminder
router.route('/user/reminder')
    .get(ReminderController.index)
    .post(ReminderController.store)

router.route('/user/reminder/:id')
    .get(ReminderController.show)
    .patch(ReminderController.update)
    .delete(ReminderController.destroy);

//Notification
router.route('/users/notifications')
    .get(NotificationController.index)
    .post(NotificationController.store)

router.route('/users/notifications/:id')
    .get(NotificationController.show)
    .patch(NotificationController.update)
    .delete(NotificationController.destroy);

export { router as routerApiV1, apiContext }