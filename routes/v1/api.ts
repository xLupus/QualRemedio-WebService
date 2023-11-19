import { Router } from "express";
import { passportJWT } from "../../app/http/middleware/passport";
import AuthController from "../../app/http/controllers/v1/AuthController";
import ConsultationController from "../../app/http/controllers/v1/ConsultationController";

const router: Router = Router();
const apiContext: string = "api/v1";

router.post('/auth/register', AuthController.register);
router.post('/auth/login', AuthController.login)

router.all("*", passportJWT);
//Auth
router.delete('/auth/logout', AuthController.logout)
router.post('/auth/teste', AuthController.teste)

//Consultation
router.post('/bond/:bond_id/consultations', ConsultationController.store)
router.get('/bond/:bond_id/consultations', ConsultationController.index)

router.get('/consultations', ConsultationController.index)
router.get('/consultations/:consultation_id', ConsultationController.show)
router.patch('/consultations/:consultation_id', ConsultationController.update)
router.get('/consultations/:consultation_id/prescriptions', ConsultationController.prescriptions)
router.delete('/consultations/:consultation_id', ConsultationController.destroy)

export { router as routerApiV1, apiContext }