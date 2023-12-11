import { Prisma, PrismaClient, User } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { Request, Response } from 'express';
import { JsonMessages, setCancelLinkSchedule, setExpireLinkSchedule } from '../../../functions/function';
import { i18n } from 'i18next';
import { transporter } from '../../../../config/nodemailer';

import exceptions from '../../../errors/handler';
import crypto from 'crypto';
import { MailType } from '../../../types/type';
import MailRequest from '../../requests/v1/MailRequest';
import { port } from '../../../../config/server';

const prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs> = new PrismaClient();

class MailController {
    //TODO: Documentação
    /**
     * @swagger
     * /users/email/send:
     *    get: 
     *        summary: Send user email
     *        tags: ['Email Verification']
     */
    async send(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined> {
        try {
            const translate: i18n = req.i18n;
            const { email, urlContext = `http://localhost:${port}/api/v1` }: MailType = MailRequest.rules(req.body, translate);
            
            const user: User | null = await prisma.user.findFirst({ where: { email } });

            if(!user) {
                return JsonMessages({
                    statusCode: 410,
                    message: translate.t('error.user.notFound'),
                    res
                });
            }

            if(user.is_verified) {
                return JsonMessages({
                    statusCode: 409,
                    message: translate.t('error.user.exists'),
                    res
                });
            }

            const emailToken: string = crypto.randomBytes(64).toString('hex');

            const createUserEmailToken = await prisma.token.create({
                data: {
                    token: emailToken,
                    user: {
                        connect: { id: user.id }
                    }
                }
            });

            if(createUserEmailToken) {
                await transporter.sendMail({
                    from: '<noreply@medsync.com>',
                    to: `${email}`,
                    subject: "Verfique o seu e-mail",
                    text: `Olá, ${user.name}, verifique o seu e-mail clicando no link abaixo \n `,
                    html:
                    `
                        <span>Olá, ${user.name} 👋!</span><br>
                        <span>Por favor, clique no link abaixo para completar o seu registro:</span><br><br>
                        <a href="${urlContext}/users/mail/verify/${createUserEmailToken.token}">Verificar sua conta</a><br>
                        <span style='font-size: 0.8rem'>Este link expira em 10 minutos</span><br><br>
                        <span>Atenciosamente,</span><br>
                        <span>Time - MedSync</span><br>
                    `
                });

                setExpireLinkSchedule(user.id, req, res);
            }

            return JsonMessages({
                message: translate.t('success.email.sended'),
                data: createUserEmailToken,
                res
            });
        } catch (err: unknown) {
            return exceptions({err, req, res});
        }
    }
    
    /**
     * @swagger
     * /users/email/resend:
     *    get: 
     *        summary: Resend user email
     *        tags: ['Email Verification']
     */
    async resend(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
        try {
            const translate: i18n = req.i18n;
            const { email, urlContext = `http://localhost:${port}/api/v1` }: MailType = MailRequest.rules(req.body, translate);

            const user: User | null = await prisma.user.findFirst({ where: { email } });

            if(!user) {
                return JsonMessages({
                    statusCode: 410,
                    message: translate.t('error.user.notFound'),
                    res
                });
            }

            if(user.is_verified) {
                return JsonMessages({
                    statusCode: 409,
                    message: translate.t('error.user.exists'),
                    res
                });
            }

            const emailToken = crypto.randomBytes(64).toString('hex');

            const createUserEmailToken = await prisma.token.update({
                where: { 
                    user_id: user.id 
                },
                data: { token: emailToken }
            });

            if(createUserEmailToken) {
                await transporter.sendMail({
                    from: '<noreply@medsync.com>',
                    to: `${email}`,
                    subject: "Verfique o seu e-mail",
                    text: `Olá, ${user.name}, verifique o seu e-mail clicando no link abaixo \n `,
                    html:
                    `
                        <span>Olá, ${user.name} 👋!</span><br>
                        <span>Por favor, clique no link abaixo para completar o seu registro:</span><br><br>
                        <a href="${urlContext}/users/mail/verify/${createUserEmailToken.token}">Verificar sua conta</a><br>
                        <span style='font-size: 0.8rem'>Este link expira em 10 minutos</span><br><br>
                        <span>Atenciosamente,</span><br>
                        <span>Time - MedSync</span><br>
                    `
                });
                
                setCancelLinkSchedule();
                setExpireLinkSchedule(user.id, req, res);
            }

            return JsonMessages({
                message: translate.t('success.email.sended'),
                data: createUserEmailToken,
                res
            });
        } catch (err: unknown) {
            return exceptions({err, req, res});
        }
    }

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
                    is_verified: true,
                    token: true
                }
            });

            if(user?.is_verified) {
                return JsonMessages({
                    statusCode: 409,
                    message: translate.t('error.user.exists'),
                    res
                });
            } else if(!user?.token) {
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

            setCancelLinkSchedule();

            return JsonMessages({
                message: translate.t('success.email.verified'),
                res
            });
        } catch (err: unknown) {
            return exceptions({err, req, res});
        }
    }
}

export default new MailController();