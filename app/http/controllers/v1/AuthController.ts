import { Prisma, PrismaClient } from '@prisma/client';
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
            const { name, email, password, cpf, telephone, birth_day, crm_state, crm, specialty_name, account_type }: RegisterType = RegisterRequest.rules(req.body);
            const passwordHash = await bcrypt.hash(password, 15);

            let user: any;

            if(account_type === 'patient' || account_type === 'carer') {
                user = {
                    name,
                    email,
                    password: passwordHash,
                    cpf,
                    telephone,
                    birth_day,
                    role_id: 1
                }
            } else {
                user = {
                    name,
                    email,
                    password: passwordHash,
                    cpf,
                    telephone,
                    birth_day,
                    role_id: 2,
                    doctor: {
                        create: {
                            crm_state,
                            crm,
                            specialty_name
                        }
                    }
                }
            }

            const createUser = await prisma.user.create({ 
                data: {
                    name,
                    email,
                    password: passwordHash,
                    cpf,
                    telephone,
                    birth_day,
                    role_id: 1,
                    carer: {
                        connectOrCreate: {
                            create: {
                                specialty: {
                                    create: {
                                        name: 'sfsdf'
                                    }
                                }
                            },
                            where: {
                                specialty: {
                                    name: 'wqrasrfa'
                                }
                            }
                        }
                    }
                } 
            });

            return JsonMessages({
                statusCode: 201,
                message: 'User has been created',
                data: createUser,
                res
            });
        } catch (error: unknown) {
            return exceptions(error, res);
        }
    }
}

export default new AuthController();