import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import jwt from "jsonwebtoken";
//Enum
import { EStatusErros } from "enum/status_erros.enum";
import { EZod } from "enum/zod.enum";

export class MiddlewareAuth {
    public static async authenticate(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        const token = req.headers['authorization'] || '';
        try {
            const ZAuthSchema = z.string().min(25, { message: `Token ${EZod.REQUIRED}` });
            ZAuthSchema.parse(token);
        } catch (err: any) {
            return res.status(400).json({
                message: EStatusErros.E400,
                erros: err.errors,
            });
        }

        try {
            await jwt.verify(token, `${process.env.JWT_SECRET}`)
        } catch (error) {
            return res.status(401).json({
                error: EStatusErros.E401,
            })
        }

        const paramsId = req.params.id;
        const decoded = (await jwt.decode(token) as { payload: { id: string } }).payload;

        if (paramsId && paramsId !== decoded.id) {
            return res.status(401).json({
                error: EStatusErros.E401,
            })
        }

        req.tokenUserId = decoded.id;
        next();
    }
}