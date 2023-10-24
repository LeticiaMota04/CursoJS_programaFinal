import { Router } from "express";
import { MiddlewareAuth } from "middleware/auth_middleware";
import { userClientFilesController } from "./controller/user_client_file.controller";
import multer from "multer";
import { uploadMiddleware } from "middleware/upload_middleware";


const router: Router = Router();
const baseUrl = '/user_client_files';

router.use(MiddlewareAuth.authenticate);
router.post(`${baseUrl}/:id`, multer(uploadMiddleware.getConfig).single('file'), userClientFilesController.create);

router.get(`${baseUrl}/:id`, userClientFilesController.read);
router.get(`${baseUrl}/list/:year/:id`, userClientFilesController.listAll);

router.patch(`${baseUrl}/:id`, multer(uploadMiddleware.getConfig).single('file'), userClientFilesController.update);
router.delete(`${baseUrl}/:id`, userClientFilesController.delete);

export const userClientFilesRouter = router;
