import { Router } from "express";
import { resetPasswordController } from "./controller/reset_password.controller";


const router: Router = Router();
const baseUrl = '/reset_password';

router.post(`${baseUrl}`, resetPasswordController.validateUser);
router.patch(`${baseUrl}`, resetPasswordController.resetPassword);
router.post(`${baseUrl}/validate`, resetPasswordController.validateSecurityCode);

export const resetPasswordRouter = router;

