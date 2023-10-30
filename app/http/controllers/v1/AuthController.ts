import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { RegisterType } from '../../../types/type';

import exceptions from '../../../errors/handler';
import RegisterRequest from '../../requests/v1/RegisterRequest';
import bcrypt from 'bcrypt';
import { JsonMessages } from '../../../functions/function';

const prisma = new PrismaClient();

class AuthController {
    async register(req: Request, res: Response) {
        try {
            const { name, email, password, cpf, telephone, birth_day, account_type }: RegisterType = RegisterRequest.rules(req.body);
            const passwordHash = await bcrypt.hash(password, 15);

            const user = await prisma.user.create({
                data: {
                    name,
                    email,
                    password,
                    cpf,
                    telephone,
                    birth_day,
                    
                }
            });

            return JsonMessages({
                statusCode: 201,
                message: 'User has been created',
                data: user,
                _links: [],
                res
            });
        } catch (error: unknown) {
            return exceptions(error, res);
        }
    }
}

export default new AuthController();