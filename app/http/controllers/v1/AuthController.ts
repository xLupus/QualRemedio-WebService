import { Prisma, PrismaClient, User } from '@prisma/client';
import { Request, Response } from 'express';
import { RegisterType } from '../../../types/type';
import { JsonMessages } from '../../../functions/function';

import exceptions from '../../../errors/handler';
import bcrypt from 'bcrypt';
import RegisterRequest from '../../requests/v1/RegisterRequest';
import RegisterLinks from '../../resources/v1/hateoas/Auth/RegisterLinks';
import {RegisterResource} from '../../resources/v1/Auth/RegisterResource';

const prisma = new PrismaClient();

class AuthController {
    async register(req: Request, res: Response) {
        try {
            const { name, email, password, cpf, telephone, birth_day, crm, crm_state, specialty_name, account_type }: RegisterType = RegisterRequest.rules(req.body);
            const passwordHash: string = await bcrypt.hash(password, 15);
            let getMedicalSpecialtyId: { id: number } = { id: 0 };

            if(account_type === 'doctor' || account_type === 'carer') {
                getMedicalSpecialtyId = await prisma.medical_Specialty.findFirstOrThrow({
                    where: { name: specialty_name },
                    select: { id: true }
                });              
            }
     
            const getUserRoleId = await prisma.role.findFirstOrThrow({
                where: { name: account_type },
                select: { id: true }
            });

            const checkUser: User | null = await prisma.user.findFirst({
                where: {
                    name,
                    cpf,
                    telephone,
                    birth_day,
                    role: {
                        some: { id: getUserRoleId!.id }
                    }
                }
            });

            if(checkUser) {
                return JsonMessages({
                    message: `User already exists`,
                    res
                });
            }

            let user: Prisma.UserCreateInput = {
                name,
                email,
                password: passwordHash,
                cpf,
                telephone,
                birth_day,
                role: {
                    connect: { id: getUserRoleId!.id }
                },
                profile: {
                    create: {
                        bio: 'Tell us a little bit about yourself',
                        picture_url: 'https://placehold.co/120x120/png'
                    }
                }
            };

            if(account_type === 'doctor' && (crm && crm_state)) {
                user.doctor = {
                    create: {
                        crm_state,
                        crm,
                        specialty: {
                            connect: { id: getMedicalSpecialtyId!.id }
                        }
                    }
                }
            } else if(account_type === 'carer') {
                user.carer = {
                    create: {
                        specialty: {
                            connect: { id: getMedicalSpecialtyId!.id }
                        }
                    }
                }
            }

            const createUser = await prisma.user.create({ 
                data: user,
                include: {
                    doctor: true,
                    carer: true
                }
            });
            
            return JsonMessages({
                statusCode: 201,
                message: `User has been created`,
                data: new RegisterResource(createUser),
                _links: RegisterLinks._links(),
                res
            });
        } catch (error: unknown) {
            return exceptions(error, res);
        }
    }
}

export default new AuthController();