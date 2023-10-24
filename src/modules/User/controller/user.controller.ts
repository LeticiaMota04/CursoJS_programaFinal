import { Request, Response } from "express";
import { userService } from "../service/user_service";
import { z } from 'zod';
import { EZod } from 'enum/zod.enum';
import { ECrud } from "enum/crud.enum";
import { EStatusErros } from "enum/status_erros.enum";

class UserController {
    public async create(req: Request, res: Response) {
        const { name, email, password } = req.body;

        try {
            const ZUserShema = z.object({
                name: z.string().optional(),
                email: z.string().email({ message: `Email ${EZod.REQUIRED}` }),
                password: z.string().min(8, { message: `Senha ${EZod.REQUIRED}` }),
            });
            ZUserShema.parse({ name, email, password });
        } catch (err: any) {
            return res.status(400).json({
                message: EStatusErros.E400,
                error: err.errors
            })
        }

        try {
            return res.json({
                message: ECrud.CREATE,
                data: await userService.create(name, email, password),
            })

        } catch (err: any) {
            return res.status(409).json({
                message: err.message,
            })
        }

    }

    public async read(req: Request, res: Response) {
        const paramsId = req.params.id;

        try {
            const ZUserShema = z.string().min(30, { message: `ID ${EZod.REQUIRED}` });
            ZUserShema.parse(paramsId);
        } catch (err: any) {
            return res.status(400).json({
                message: EStatusErros.E400,
                error: err.errors
            })
        }
        try {
            return res.json({
                message: ECrud.READ,
                data: await userService.read(paramsId),
            });
        } catch (err: any) {
            return res.status(404).json({
                error: err.message,
            })
        }
    }

    public async update(req: Request, res: Response) {
        const paramsId = req.params.id;
        const { name } = req.body;

        try {
            const ZUserShema = z.object({
                paramsId: z.string().min(30, { message: `ID ${EZod.REQUIRED}` }),
                name: z.string().min(1, { message: `Nome ${EZod.REQUIRED}` }),
            });
            ZUserShema.parse({ paramsId, name });
        } catch (err: any) {
            return res.status(400).json({
                message: EStatusErros.E400,
                error: err.errors,
            })
        }
        try {
            return res.json({
                message: ECrud.UPDATE,
                data: await userService.update(paramsId, name),
            })
        } catch (err: any) {
            return res.status(404).json({
                error: err.message,
            })
        }
    }

    public async delete(req: Request, res: Response) {
        const paramsId = req.params.id;
        try {
            const ZUserShema = z.string().min(30, { message: `ID ${EZod.REQUIRED}` });
            ZUserShema.parse(paramsId);
        } catch (err: any) {
            return res.status(400).json({
                message: EStatusErros.E400,
                error: err.errors,
            })
        }
        try {
            await userService.delete(paramsId);
            return res.json({
                message: ECrud.DELETE,
            })
        } catch (err: any) {
            return res.status(404).json({
                error: err.message,
            })
        }
    }
}

export const userController = new UserController();