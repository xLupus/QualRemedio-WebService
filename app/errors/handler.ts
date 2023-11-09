import { PrismaClientInitializationError, PrismaClientKnownRequestError, PrismaClientValidationError } from '@prisma/client/runtime/library';
import { Response } from 'express';
import { JsonWebTokenError } from 'jsonwebtoken';
import { JsonMessages } from '../functions/function';
import { ExceptionsType } from '../types/type';
import { z } from 'zod';

/**
 * Handler application errors
 * @param error Error to handler
 * @param res Application response
 * @returns JSON response
*/
export default function exceptions({error, req, res }: ExceptionsType): Response<any, Record<string, any>> {
    console.log(error.issues);

    switch (true) {
        case error instanceof PrismaClientInitializationError:
            return JsonMessages({
                statusCode: 500,
                message: 'Prisma initialization error',
                data: error,
                res
            });

        case error instanceof PrismaClientValidationError:
            return JsonMessages({
                statusCode: 422,
                message: 'Prisma validation error',
                data: error,
                res
            });

        case error instanceof PrismaClientKnownRequestError:
            if(error.code === 'P2002' && error.meta.target === 'User_email_key') {
                error.meta.target = req?.i18n.t('error.data.unique', { field: `${req?.i18n.t('glossary.email')}`});
            }

            return JsonMessages({
                statusCode: 422,
                message: 'Prisma request error',
                data: error,
                res
            });

        case error instanceof z.ZodError:
            return JsonMessages({
                statusCode: 422,
                message: 'Zod validation error',
                data: error,
                res
            });

        case error.message === 'No auth token':
        case error instanceof JsonWebTokenError:
        case !error:
            return JsonMessages({
                statusCode: 401,
                message: `${req?.i18n.t('error.data.invalidToken')}`,
                res
            });

        case error instanceof Error:
            return JsonMessages({
                statusCode: 422,
                message: 'Error Exception',
                data: error.message,
                res
            });

        case error instanceof SyntaxError:
            return JsonMessages({
                statusCode: 400,
                message: 'Syntax Error',
                data: error.message,
                res
            });

        default:
            return JsonMessages({
                statusCode: 500,
                message: `${req?.i18n.t('error.server.internal')}`,
                res
            });
    }
}