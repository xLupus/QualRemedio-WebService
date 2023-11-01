import { Prisma, PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { RegisterType } from '../../../types/type';
import { JsonMessages } from '../../../functions/function';

import exceptions from '../../../errors/handler';
import RegisterRequest from '../../requests/v1/RegisterRequest';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

class AuthController {
    async register(req: Request, res: Response) {
        try {
            const { name, email, password, cpf, telephone, birth_day, crm_state, crm, specialty_name, account_type }: RegisterType = RegisterRequest.rules(req.body);
            const passwordHash: string = await bcrypt.hash(password, 15);

            let user: Prisma.UserCreateInput;

            const getUserRoleId = await prisma.role.findFirstOrThrow({
                where: { name: account_type },
                select: { id: true }
            });

            const getMedicalSpecialtyId = await prisma.medical_Specialty.findFirst({
                where: { name: specialty_name },
                select: { id: true }
            });
          
            if(account_type === 'patient') {
                user = {
                    name,
                    email,
                    password: passwordHash,
                    cpf,
                    telephone,
                    birth_day,
                    role: {
                        connect: { id: getUserRoleId!.id }
                    }
                }
            } else if(account_type === 'doctor') {
                user = {
                    name,
                    email,
                    password: passwordHash,
                    cpf,
                    telephone,
                    birth_day,
                    role: {
                        connect: { id: getUserRoleId!.id }
                    },
                    doctor: {
                        create: {
                            crm_state,
                            crm,
                            specialty: {
                                connect: { id: getMedicalSpecialtyId!.id }
                            }
                        }
                    }       
                }
            } else {
                user = {
                    name,
                    email,
                    password: passwordHash,
                    cpf,
                    telephone,
                    birth_day,
                    role: {
                        connect: { id: getUserRoleId!.id }
                    },
                    carer: {
                        create: {
                            specialty: {
                                connect: { id: getMedicalSpecialtyId!.id }
                            }
                        }
                    }  
                }
            }

            const createUser = await prisma.user.create({ data: user });

            return JsonMessages({
                statusCode: 201,
                message: `User has been created`,
                data: createUser,
                res
            });
        } catch (error: unknown) {
            return exceptions(error, res);
        }
    }
}

export default new AuthController();