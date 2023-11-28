import { Response, Request } from 'express';
import { JsonMessages, SendUserMail } from '../types/type';
import { Prisma, PrismaClient } from '@prisma/client';
import schedule from 'node-schedule';

import exceptions from '../errors/handler';
import { transporter } from '../../config/nodemailer';
import { DefaultArgs } from '@prisma/client/runtime/library';
import moment from 'moment';

const prisma:  PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs> = new PrismaClient();
let scheduleExpireLink: schedule.Job;

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
export function setExpireLinkSchedule(userId: number, req: Request, res: Response) {
    try {
        const date: string = moment().add(10, 'minutes').toLocaleString();

        scheduleExpireLink = schedule.scheduleJob(date, async () => {
            await prisma.user.delete({ where: { id: userId, is_verified: false }})
        });
    } catch (err: unknown) {
        return exceptions({err, req, res});
    }
}

export function setCancelLinkSchedule(): void {
    scheduleExpireLink.cancel();
}