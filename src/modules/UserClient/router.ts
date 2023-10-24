import { Router } from "express";
import { MiddlewareAuth } from "middleware/auth_middleware";
import { userClientController } from "./controller/user_client.controller";

const router: Router = Router();
const baseUrl = '/user_client';

router.use(MiddlewareAuth.authenticate);
router.post(`${baseUrl}`, userClientController.create);
router.get(`${baseUrl}`, userClientController.listAll);
router.get(`${baseUrl}/:id`, userClientController.read);
router.patch(`${baseUrl}/:id`, userClientController.update);
router.delete(`${baseUrl}/:id`, userClientController.delete);

export const userClientRouter = router;
