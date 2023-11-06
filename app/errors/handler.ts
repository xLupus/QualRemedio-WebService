import { PrismaClientInitializationError, PrismaClientKnownRequestError, PrismaClientValidationError } from '@prisma/client/runtime/library';
import { Response } from 'express';
import { JsonWebTokenError } from 'jsonwebtoken';
import { JsonMessages } from '../functions/function';
import { z } from 'zod';

/**
 * Handler application errors
 * @param error Error to handler
 * @param res Application response
 * @returns JSON response
*/
export default function exceptions(error: any, res: Response): Response<any, Record<string, any>> {
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
                message: "The informed token is invalid or doesn't exists",
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
                message: 'Internal Server Error',
                res
            });
    }
}