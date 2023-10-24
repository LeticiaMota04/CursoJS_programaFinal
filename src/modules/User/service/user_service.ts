import { prismaConnect } from "prismaConn";
import bcrypt from 'bcrypt';
import { UtilsFileUser } from "utils/file_utils";
import { EStatusErros } from "enum/status_erros.enum";

class UserService {
    public async create(name: string, email: string, password: string) {
        const findUser = await prismaConnect.user.findUnique({
            where: {
                email,
            },
        });
        if (findUser) {
            throw new Error(EStatusErros.E409);
        }

        const create = await prismaConnect.user.create({
            data: {
                name,
                email,
                password: bcrypt.hashSync(password, 6),
            },
            select: {
                id: true,
                name: true,
                email: true,
            },
        });

        UtilsFileUser.createFolderUser(create.id);
        return (create);
    }

    public async read(userId: string) {
        const findUser = await prismaConnect.user.findUnique({
            where: {
                id: userId,
            },
            select: {
                id: true,
                name: true,
                email: true,
            },
        });

        if (!findUser) {
            throw new Error(EStatusErros.E404);
        }
        return findUser;
    }

    public async update(userId: string, name: string) {
        const findUser = await prismaConnect.user.findUnique({
            where: {
                id: userId,
            },
        });

        if (!findUser) {
            throw new Error(EStatusErros.E404);
        }

        const update = await prismaConnect.user.update({
            where: {
                id: userId,
            },
            data: {
                name,
            },
            select: {
                id: true,
                name: true,
                email: true,
            },
        });

        return update;
    }
    public async delete(userId: string) {
        try {
            UtilsFileUser.deleteFolderUser(userId);
            return await prismaConnect.user.delete({
                where: {
                    id: userId
                }
            })
        } catch (err: any) {
            throw new Error(EStatusErros.E404);
        }
    }
}

export const userService = new UserService();