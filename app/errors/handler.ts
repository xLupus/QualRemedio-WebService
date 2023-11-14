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
    console.log(err.message);

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
            let statusCode: number = 422;
            
            if(err.code === 'P2020') { //unique keys
                if(err === 'User_email_key') {
                    err.meta.target = req?.i18n.t('error.data.unique', { field: `${req?.i18n.t('glossary.email')}`});
                }
            } else if(err.code === 'P2025') { //not found
                if(err.message === 'No Bond_Status found') {
                    err.message = req?.i18n.t('error.bond.status.notFound');
                } else if(err.message === 'No Bond found') {
                    err.message = req?.i18n.t('error.bond.notFound');
                }

               statusCode = 200;
            } else {
                err.message = 'Prisma request error'
            }

            return JsonMessages({
                statusCode,
                message: err.message,
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