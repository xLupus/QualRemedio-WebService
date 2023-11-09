import { Prisma, PrismaClient, User } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { Request, Response } from 'express';
import { RegisterType } from '../../../types/type';
import { JsonMessages } from '../../../functions/function';
import { RegisterResource } from '../../resources/v1/Auth/RegisterResource';
import { i18n } from 'i18next';

import exceptions from '../../../errors/handler';
import bcrypt from 'bcrypt';
import RegisterRequest from '../../requests/v1/RegisterRequest';
import RegisterLinks from '../../resources/v1/hateoas/Auth/RegisterLinks';

const prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs> = new PrismaClient();

class AuthController {
    async register(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
        try {
            const translate: i18n = req.i18n;
            const { name, email, password, cpf, telephone, birth_day, crm, crm_state, specialty_name, account_type }: RegisterType = RegisterRequest.rules(req.body, translate);
            const passwordHash: string = await bcrypt.hash(password, 15);
            let medicalSpecialtyId: { id: number } = { id: 0 };
            let checkUser: Prisma.UserWhereInput;
            let user: Prisma.UserCreateInput | User[] | null;
            let data: Prisma.UserUpdateInput;

            const roleId: { id: number } = await prisma.role.findFirstOrThrow({
                where: { name: account_type },
                select: { id: true }
            });

            if(account_type === 'doctor' || account_type === 'carer') {
                medicalSpecialtyId = await prisma.medical_Specialty.findFirstOrThrow({
                    where: { name: specialty_name },
                    select: { id: true }
                });              
            }

            checkUser = {
                OR: [
                    {
                        email,
                    },
                    {
                        telephone
                    }
                ]  
            };

            if(account_type === 'doctor' && (crm && crm_state)) {   
                checkUser.OR = [
                    {
                        doctor: {
                            some: {
                                crm,
                                crm_state
                            }
                        }
                    }
                ]
            }
            
            user = await prisma.user.findMany({ where: checkUser });

            if(user.length > 0) {
                checkUser.role = { some: { id: roleId!.id } } //role

                data = { //data
                    role: {
                        connect: {
                            id: roleId!.id
                        }
                    }
                }

                const checkUserRole: User[] | null = await prisma.user.findMany({ where: checkUser });

                if(checkUserRole.length === 0) {
                    if(account_type === 'doctor' && (crm && crm_state)) {
                        data.doctor = {
                            create: {
                                crm_state,
                                crm,
                                specialty: {
                                    connect: { id: medicalSpecialtyId!.id }
                                }
                            }
                        }
                    } else if(account_type === 'carer') {
                        data.carer = {
                            create: {
                                specialty: {
                                    connect: { id: medicalSpecialtyId!.id }
                                }
                            }
                        }
                    }

                    await prisma.user.update({
                        where: { email },
                        data
                    });
    
                    return JsonMessages({
                        message: translate.t('success.user.created'),
                        res
                    });   
                }

                return JsonMessages({
                    message: translate.t('error.user.exists'),
                    res
                }); 
            }

            user = {
                name,
                email,
                password: passwordHash,
                cpf,
                telephone,
                birth_day,
                role: {
                    connect: { id: roleId!.id }
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
                            connect: { id: medicalSpecialtyId!.id }
                        }
                    }
                }
            } else if(account_type === 'carer') {
                user.carer = {
                    create: {
                        specialty: {
                            connect: { id: medicalSpecialtyId!.id }
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
                message: translate.t('success.user.created'),
                data: new RegisterResource(createUser),
                _links: RegisterLinks._links(),
                res
            });
        } catch (error: unknown) {
            return exceptions({error, req, res});
        }
    }
}

export default new AuthController();