import { Request, Response } from 'express';
import { JsonMessages } from '../../../functions/function';
import { i18n } from 'i18next';

import exceptions from '../../../errors/handler';
import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import 'dotenv/config';

class EmailController {
    //TODO: Documentação
    /**
     * @swagger
     * /users/email:
     *    post: 
     *        summary: Send user e-mails
     *        tags: ['Send E-mail']
     */
    async send(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
        try {
            const translate: i18n = req.i18n;

            const transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo> = nodemailer.createTransport({
                host: `${process.env.MAIL_HOST}`,
                port: 587,
                secure: false,
                auth: {
                    user: process.env.MAIL_USERNAME,
                    pass: process.env.MAIL_PASSWORD,
                },
                tls : { rejectUnauthorized: false }
            });

            await transporter.sendMail({
                from: `<${process.env.MAIL_USERNAME}>`,
                to: `${process.env.MAIL_TO_USERNAMES}`,
                subject: "Hello World ✔",
                text: "Hello world?",
                html: "<b>Hello world?</b>"
            });
        
            return JsonMessages({
                message: translate.t('success.email.sended'),
                res
            });
        } catch (err: unknown) {
            return exceptions({err, req, res});
        }
    }
}

export default new EmailController();