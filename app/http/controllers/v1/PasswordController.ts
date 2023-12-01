import { Prisma, PrismaClient, User } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { Request, Response } from 'express';
import { JsonMessages } from '../../../functions/function';
import { i18n } from 'i18next';

import exceptions from '../../../errors/handler';
import { PasswordType } from '../../../types/type';
import PasswordRequest from '../../requests/v1/PasswordRequest';
import bcrypt from 'bcrypt';

const prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs> = new PrismaClient();

class PasswordController {
    //TODO: Documentação
    /**
     * @swagger
     * /users/password/reset-password:
     *    get: 
     *        summary: Reset user password
     *        tags: ['Password']
     */
    async reset(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined> {
        try {
            const translate: i18n = req.i18n;
            const { email, new_password }: PasswordType = PasswordRequest.rules(req.body, translate);

            const user: User | null = await prisma.user.findFirst({ where: { email } });

            if(!user || !user.is_verified) {
                return JsonMessages({
                    statusCode: 410,
                    message: translate.t('error.user.notFound'),
                    res
                });
            }

            const passwordHash: string = await bcrypt.hash(new_password, 15);

            await prisma.user.update({
                where: {
                    id: user.id
                },
                data: {  password: passwordHash }
            });

            return JsonMessages({
                message: translate.t('success.user.password.updated'),
                res
            });
        } catch (err: unknown) {
            return exceptions({err, req, res});
        }
    }
}

export default new PasswordController();