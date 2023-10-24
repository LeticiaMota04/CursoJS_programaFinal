import { prismaConnect } from "prismaConn";
import { UtilsSendEmail } from "../utils/send_email.utils";
import bcrypt from 'bcrypt';
//enum
import { EStatusErros } from "enum/status_erros.enum";

class ResetPasswordService {
    public async validateUser(email: string) {
        const findUser = await prismaConnect.user.findUnique({
            where: {
                email,
            },
            include: {
                resetPasswordScret: true,
            },
        });

        if (!findUser) {
            throw new Error(EStatusErros.E404);
        }

        if (!findUser.resetPasswordScret) {
            const generateSecret = Number(
                Array.from({ length: 6 }, () => Math.floor(Math.random() * 9)).join(''),
            );

            const { secret } = await prismaConnect.resetPasswordSecret.create({
                data: {
                    secret: generateSecret,
                    userId: findUser.id
                }
            });
            UtilsSendEmail.send(email, secret);
            return { email, secret };
        }
        UtilsSendEmail.send(email, findUser.resetPasswordScret.secret);
        return { email, secret: findUser.resetPasswordScret.secret };
    }

    public async validateSecurityCode(email: string, secret: number) {
        const findUser = await prismaConnect.user.findUnique({
            where: {
                email,
            },
            include: {
                resetPasswordScret: true,
            },
        });

        if (
            !findUser ||
            !findUser.resetPasswordScret ||
            findUser.resetPasswordScret.secret !== secret
        ) {
            throw new Error(EStatusErros.E404);
        }

        return { email, secret };
    }

    public async resetPassword(email: string, secret: number, newPassword: string) {
        const findUser = await prismaConnect.user.findUnique({
            where: {
                email,
            },
            include: {
                resetPasswordScret: true,
            },
        });

        if (
            !findUser ||
            !findUser.resetPasswordScret ||
            findUser.resetPasswordScret.secret !== secret
        ) {
            throw new Error(EStatusErros.E404);
        }

        const update = await prismaConnect.user.update({
            where: {
                email,
            },
            data: {
                password: bcrypt.hashSync(newPassword, 6),
            },
            select: {
                name: true,
                email: true,
            }
        });

        await prismaConnect.resetPasswordSecret.delete({
            where: {
                userId: findUser.id
            }
        });

        return update;
    }
}
export const resetPasswordService = new ResetPasswordService();