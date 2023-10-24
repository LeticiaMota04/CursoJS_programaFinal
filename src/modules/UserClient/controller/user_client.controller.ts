import { Request, Response } from "express";
import { z } from "zod";
//enum
import { EStatusErros } from "enum/status_erros.enum";
import { EZod } from "enum/zod.enum";
import { ECrud } from "enum/crud.enum";
import { userClientService } from "../service/user_client.service";

class UserClientController {
    public async create(req: Request, res: Response) {
        const { name, email, phone } = req.body;
        const tokenUserId = req.tokenUserId;

        try {
            const ZClientSchema = z.string().min(1, { message: `Nome ${EZod.REQUIRED}` });
            ZClientSchema.parse(name);
        } catch (err: any) {
            return res.status(400).json({
                message: EStatusErros.E400,
                error: err.errors
            })
        }

        try {
            return res.json({
                message: ECrud.CREATE,
                data: await userClientService.create(tokenUserId, name, email, phone),
            })
        } catch (err: any) {
            return res.status(404).json({
                message: err.message,
            })
        }
    }

    public async read(req: Request, res: Response) {
        const paramsId = req.params.id;
        const tokenUserId = req.tokenUserId;

        try {
            const ZClientSchema = z.string().min(30, { message: `Id ${EZod.REQUIRED}` });
            ZClientSchema.parse(paramsId);
        } catch (err: any) {
            return res.status(400).json({
                message: EStatusErros.E400,
                error: err.errors
            })
        }

        try {
            return res.json({
                message: ECrud.READ,
                data: await userClientService.read(paramsId, tokenUserId),
            })
        } catch (err: any) {
            return res.status(404).json({
                message: err.message,
            })
        }
    }
    public async listAll(req: Request, res: Response) {
        const tokenUserId = req.tokenUserId;
        let page = Number(req.query.page);
        const search = req.query.search ? String(req.query.search) : undefined;

        if (!page || page <= 0 || isNaN(page)) {
            page = 1;
        }

        try {
            return res.json({
                message: ECrud.READ,
                data: await userClientService.listAll(tokenUserId, page, search),
            })
        } catch (err: any) {
            return res.status(404).json({
                message: err.message,
            })
        }
    }
    public async update(req: Request, res: Response) {
        const { name, email, phone } = req.body;
        const tokenUserId = req.tokenUserId;
        const paramsId = req.params.id;

        try {
            const ZClientSchema = z.object({
                name: z.string().min(1, { message: `Nome ${EZod.REQUIRED}` }),
                paramsId: z.string().min(30, { message: `Id ${EZod.REQUIRED}` }),
            })
            ZClientSchema.parse({ name, paramsId });
        } catch (err: any) {
            return res.status(400).json({
                message: EStatusErros.E400,
                error: err.errors
            })
        }

        try {
            return res.json({
                message: ECrud.UPDATE,
                data: await userClientService.update(name, email, phone, paramsId, tokenUserId),
            })
        } catch (err: any) {
            return res.status(404).json({
                message: err.message,
            })
        }
    }
    public async delete(req: Request, res: Response) {
        const paramsId = req.params.id;
        const tokenUserId = req.tokenUserId;

        try {
            const ZClientSchema = z.string().min(30, { message: `Id ${EZod.REQUIRED}` });
            ZClientSchema.parse(paramsId);
        } catch (err: any) {
            return res.status(400).json({
                message: EStatusErros.E400,
                error: err.errors
            })
        }

        try {
            await userClientService.delete(paramsId, tokenUserId);
            return res.json({
                message: ECrud.DELETE,
            })
        } catch (err: any) {
            return res.status(404).json({
                message: err.message,
            })
        }
    }
}

export const userClientController = new UserClientController();