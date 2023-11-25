import { Response } from 'express';
import { JsonMessages, VerifyEmail } from '../types/type';
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
 * @param { VerifyEmail } object 
 * @returns 
 */
export async function verifyEmail({ email, user, req, res }: VerifyEmail): Promise<Response<any, Record<string, any>>> {
    const translate: i18n = req.i18n;
    const availableEmailProviders: string[] = ['gmail.com', 'outlook.com', 'outlook.com.br'];

    if(availableEmailProviders.includes(email.split('@')[1])) {
        
    }

    await transporter.sendMail({
        from: '<no-reply@qualremedio.com>',
        to: `${email}`,
        subject: "Hello World ✔",
        text: "Hello world?",
        html:
        `
            <span>Olá, ${user}, Verifica o seu e-mail clicando no link abaixo ...</span>
            <button>
                <a href=''>Verificar e-mail</a>
            </button>
        `
    });

    return JsonMessages({
        message: translate.t('success.email.sended'),
        res
    });
}