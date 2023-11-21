import { Router } from "express";
import { passportJWT } from "../../app/http/middleware/passport";
import AuthController from "../../app/http/controllers/v1/AuthController";
import BondController from "../../app/http/controllers/v1/BondController";
import ReminderController from "../../app/http/controllers/v1/ReminderController";

const router: Router = Router();
const apiContext: string = "api/v1";

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

export { router as routerApiV1, apiContext }