import { Request, Response } from 'express';
import { JsonMessages } from '../../../functions/function';
import { i18n } from 'i18next';
import { EmailType } from '../../../types/type';

import exceptions from '../../../errors/handler';
import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import EmailRequest from '../../requests/v1/EmailRequest';
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
            const { email }: EmailType = EmailRequest.rules(req.body, translate);
            const availableEmailProviders: string[] = ['gmail.com', 'outlook.com', 'outlook.com.br'];

            let transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo>;
            let options = {};

            if(availableEmailProviders.includes(email.split('@')[1])) {
                if(email.includes('gmail.com')) {
                    options = {
                        host: `smtp.gmail.com`,
                        port: 587,
                        secure: false,
                        auth: {
                            user: process.env.MAIL_USERNAME,
                            pass: process.env.MAIL_PASSWORD
                        },
                        tls: { rejectUnauthorized: false }
                    }
                } else if(email.includes('outlook.com') || email.includes('outlook.com.br')) {
                    options = {
                        host: `${process.env.MAIL_HOST}`,
                        port: 587,
                        secure: false,
                        auth: {
                            user: process.env.MAIL_USERNAME,
                            pass: process.env.MAIL_PASSWORD
                        },
                        tls: { rejectUnauthorized: false }
                    }
                }

                transporter = nodemailer.createTransport(options);

                await transporter.sendMail({
                    from: '<no-reply@qualremedio.com>',
                    to: `${email}`,
                    subject: "Hello World ✔",
                    text: "Hello world?",
                    html: "<b>Hello world?</b>"
                });

                return JsonMessages({
                    message: translate.t('success.email.sended'),
                    res
                });
            }

            return JsonMessages({
                message: translate.t('error.email.invalidProvider'),
                res
            });
        } catch (err: unknown) {
            return exceptions({err, req, res});
        }
    }
}

export default new EmailController();