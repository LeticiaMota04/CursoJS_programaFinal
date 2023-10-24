import { prismaConnect } from "prismaConn";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
//enum
import { EStatusErros } from "enum/status_erros.enum";
//utils
import { UtilsTokenAuth } from "../utils/token_utils";


class AuthService {
    public async login(email: string, password: string) {
        const findUser = await prismaConnect.user.findUnique({
            where: {
                email,
            },
            select: {
                id: true,
                name: true,
                email: true,
                password: true,
            }
        });

        if (!findUser) {
            throw new Error(EStatusErros.E404);
        }
        if (!bcrypt.compareSync(password, findUser.password)) {
            throw new Error(EStatusErros.E401);
        }
        return UtilsTokenAuth.jwtGenerate(findUser);
    }
    public async token(refresherToken: string) {
        try {
            await jwt.verify(
                refresherToken,
                `${process.env.JWT_REFRESH_TOKEN_SECRET}`
            );
            const decoded = (
                (await jwt.decode(refresherToken)) as { payload: { id: string } }
            ).payload;

            const findUser = await prismaConnect.user.findUnique({
                where: {
                    id: decoded.id,
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    password: true,
                }
            });

            if (!findUser) {
                throw new Error(EStatusErros.E404);
            }
            return UtilsTokenAuth.jwtGenerate(findUser);
        } catch (err: any) {
            throw new Error(EStatusErros.E401);
        }
    }
}

export const authService = new AuthService();