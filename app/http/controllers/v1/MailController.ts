import { Prisma, PrismaClient } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { Request, Response } from 'express';
import { JsonMessages } from '../../../functions/function';
import { i18n } from 'i18next';
import exceptions from '../../../errors/handler';

const prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs> = new PrismaClient();

class MailController {
    //TODO: Documentação
    /**
     * @swagger
     * /users/email/verify:
     *    get: 
     *        summary: Verify user email
     *        tags: ['Email Verification']
     */
    async verify(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
        try {
            const translate: i18n = req.i18n;
            const { emailToken } = req.params;

            const user = await prisma.user.findFirst({
                where: {
                    token: { token: emailToken }
                },
                select: {
                    id: true,
                    token: true
                }
            });

            if(!user?.token) {
                return JsonMessages({
                    statusCode: 400,
                    message: translate.t('error.email.linkExpired'),
                    res
                });
            }

            await prisma.user.update({
                where: { id: user.id },
                data: { is_verified: true }
            });

            return JsonMessages({
                message: translate.t('success.user.verified'),
                res
            });
        } catch (err: unknown) {
            return exceptions({err, req, res});
        }
    }
}

export default new MailController();