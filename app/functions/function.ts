import { Response } from 'express';
import { JsonMessages, SendUserMail } from '../types/type';
import { Prisma, PrismaClient } from '@prisma/client';
import { i18n } from 'i18next';

import exceptions from '../errors/handler';
import { transporter } from '../../config/nodemailer';
import { DefaultArgs } from '@prisma/client/runtime/library';

const prisma:  PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs> = new PrismaClient();

// Application Functions 
/**
 * Returns application response.
 * @param {JsonMessages} object
 * @returns JSON response
 */
export function JsonMessages({ statusCode = 200, message, data = null, _links, res }: JsonMessages): Response<any, Record<string, any>> {
    return res.status(statusCode).json({
        status: statusCode,
        message,
        data,
        _links
    });
}

//Authentication
/**
 * Invalidate current user json web token.
 * @param {string} token
 */

export async function invalidateToken(token: string): Promise<void> {
    await prisma.token_Blacklist.create({ data: { token } });
}


/**
 * Verify current user json web token.
 * @param {string} token
 * @returns boolean
*/
export async function verifyToken(token: string): Promise<boolean> {
    const invalidToken = await prisma.token_Blacklist.findUnique({ where: { token } })

    return invalidToken ? true : false;
}

//Field Validation
//TODO: Ver como separar as validações em funções sem erro de `undefined`

/**
 * 
 * @param { SendUserMail } object 
 * @returns 
 */
export async function sendUserMail({ userInfo, req, res }: SendUserMail): Promise<Response<any, Record<string, any>> | undefined> {
    try {
        const { email, name, token } = userInfo;

        await transporter.sendMail({
            from: '<noreply@qualremedio.com>',
            to: `${email}`,
            subject: "Verfique o seu e-mail",
            text: `Olá, ${name}, verifique o seu e-mail clicando no link abaixo \n `,
            html:
            `
                <span>Olá, ${name}, Verifique o seu e-mail clicando no link abaixo ...</span>
                <br>
                <a href="http://localhost:7000/api/v1/users/email/verify/${token.token}">Verificar e-mail</a>
            `
        });
    } catch (err: unknown) {
        return exceptions({err, req, res});
    }
}