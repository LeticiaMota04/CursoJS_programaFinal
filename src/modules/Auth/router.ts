import { Router } from "express";
import { authController } from "./controller/auth.controller";

const router: Router = Router();
const baseUrl = '/auth';

router.post(`${baseUrl}/login`, authController.login);
router.post(`${baseUrl}/token`, authController.token);

export const authRouter = router;