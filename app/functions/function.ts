import { Response } from 'express';
import { JsonMessages } from '../types/type';
//import { PrismaClient, Token_blacklist } from '@prisma/client';

//const prisma = new PrismaClient();

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
/*
export async function invalidateToken(token: string): Promise<void> {
    await prisma.token_blacklist.create({ data: { token }});
}
*/

/**
 * Verify current user json web token.
 * @param {string} token
 * @returns boolean
 */
/*
export async function verifyToken(token: string): Promise<boolean> {
    const invalidToken: Token_blacklist | null = await prisma.token_blacklist.findUnique({ where: { token }});

    return invalidToken ? true : false;
}
*/