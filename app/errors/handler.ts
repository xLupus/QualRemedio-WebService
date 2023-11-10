import { PrismaClientInitializationError, PrismaClientKnownRequestError, PrismaClientValidationError } from '@prisma/client/runtime/library';
import { Response } from 'express';
import { JsonWebTokenError } from 'jsonwebtoken';
import { JsonMessages } from '../functions/function';
import { ExceptionsType } from '../types/type';
import { z } from 'zod';

/**
 * Handler application errors
 * @param err Error to handler
 * @param res Application response
 * @returns JSON response
*/
export default function exceptions({ err, req, res }: ExceptionsType): Response<any, Record<string, any>> {
    console.log(err);

    switch (true) {
        case err instanceof PrismaClientInitializationError:
            return JsonMessages({
                statusCode: 500,
                message: 'Prisma initialization error',
                data: err,
                res
            });

        case err instanceof PrismaClientValidationError:
            return JsonMessages({
                statusCode: 422,
                message: 'Prisma validation error',
                data: err,
                res
            });

        case err instanceof PrismaClientKnownRequestError:
            if(err.code === 'P2002' && err.meta.target === 'User_email_key') {
                err.meta.target = req?.i18n.t('error.data.unique', { field: `${req?.i18n.t('glossary.email')}`});
            }

            return JsonMessages({
                statusCode: 422,
                message: 'Prisma request error',
                data: err,
                res
            });

        case err instanceof z.ZodError:
            return JsonMessages({
                statusCode: 422,
                message: 'Zod validation error',
                data: err,
                res
            });

        case err.message === 'No auth token':
        case err instanceof JsonWebTokenError:
        case !err:
            return JsonMessages({
                statusCode: 401,
                message: `${req?.i18n.t('error.data.invalidToken')}`,
                res
            });

        case err instanceof Error:
            return JsonMessages({
                statusCode: 422,
                message: 'Error Exception',
                data: err.message,
                res
            });

        case err instanceof SyntaxError:
            return JsonMessages({
                statusCode: 400,
                message: 'Syntax Error',
                data: err.message,
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