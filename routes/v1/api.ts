import { Router } from "express";
import { passportJWT } from "../../app/http/middleware/passport";
import AuthController from "../../app/http/controllers/v1/AuthController";
import BondController from "../../app/http/controllers/v1/BondController";
import ReminderController from "../../app/http/controllers/v1/ReminderController";
import NotificationController from "../../app/http/controllers/v1/NotificationController";
import MailController from "../../app/http/controllers/v1/MailController";

const router: Router = Router();
const apiContext: string = "api/v1";

//Email
router.get('/users/email/verify/:emailToken', MailController.verify);

//Auth
router.post('/auth/register', AuthController.register);
router.post('/auth/login', AuthController.login)

router.all("*", passportJWT);

//Auth
router.delete('/auth/logout', AuthController.logout)
router.post('/auth/teste', AuthController.teste)

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